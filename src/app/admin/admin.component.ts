import {AfterViewChecked, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Post} from '../entity/post';
import {Comment} from '../entity/comment';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AdminService} from '../service/admin.service';
import {HttpServiceService} from '../service/http-service.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  posts: Post[] = [];
  comments: Comment[] = [];
  images: Map<string, SafeUrl> = new Map<string, SafeUrl>();
  form: FormGroup;
  keys: Array<string>;
  constructor(fb: FormBuilder, private adminService: AdminService,
              private httpService: HttpServiceService,
              private sanitizer: DomSanitizer,
              private cdRef: ChangeDetectorRef) {
    this.form = fb.group({
      type: ['', Validators.required]
    });
  }
  getKeys(): Array<string> {
    return Array.from(this.images.keys());
  }
  ngOnInit() {
  }
  loadMorePosts() {
    const id = (this.posts.length > 0) ? this.posts[this.posts.length - 1].id : -1;

    this.adminService.loadMorePosts(id, 10).subscribe(
      posts => {
        console.log(posts);
        posts.forEach(post => {
          this.posts.push(post);
          console.log(post);
        });
      }
    );
  }
  loadMoreComments() {
    const id = (this.comments.length > 0) ? this.comments[this.comments.length - 1].id : -1;

    this.adminService.loadMoreComments(id, 10).subscribe(
      comments => {
        console.log(comments);
        comments.forEach(comment => {
          this.comments.push(comment);
          console.log(comment);
        });
      }
    );
  }
  loadMoreImages() {
    const id = (this.images.size > 0) ? this.images[this.images.size - 1] : -1;

    this.adminService.loadMoreImages(id, 10).subscribe(
      urls => {
        urls.forEach(url => {
          this.httpService.loadImage(url).subscribe(image => {
            const unsafeImageUrl = URL.createObjectURL(image);
            const imageUrl = this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
            this.images.set(url, imageUrl);
          });
        });
        this.keys = Array.from(this.images.keys());
      }
    );

  }
}
