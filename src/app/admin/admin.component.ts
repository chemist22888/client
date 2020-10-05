import {AfterViewChecked, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Post} from '../entity/post';
import {Comment} from '../entity/comment';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AdminService} from '../service/admin.service';
import {HttpServiceService} from '../service/http-service.service';
import {findIndex} from "rxjs/operators";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  posts: Post[] = [];
  comments: Comment[] = [];
  images: Map<number, SafeUrl> = new Map<number, SafeUrl>();
  form: FormGroup;
  keys: Array<number>;
  constructor(fb: FormBuilder, private adminService: AdminService,
              private httpService: HttpServiceService,
              private sanitizer: DomSanitizer,
              private cdRef: ChangeDetectorRef) {
    this.form = fb.group({
      type: ['', Validators.required]
    });
  }
  getKeys(): Array<number> {
    return Array.from(this.images.keys());
  }
  ngOnInit() {
  }
  loadMorePosts() {
    const id = (this.posts.length > 0) ? this.posts[this.posts.length - 1].id : -1;

    this.adminService.loadMorePosts(id, 10).subscribe(
      posts => {
        posts.forEach(post => {
          post.imageUrls = [];
          post.images.forEach(imageId => {
            this.httpService.loadImage(imageId).subscribe(image => {
              const unsafeImageUrl = URL.createObjectURL(image);
              const imageUrl = this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
              post.imageUrls.push(imageUrl);
            });
          });
          this.posts.push(post);
        });
      }
    );
  }
  loadMoreComments() {
    const id = (this.comments.length > 0) ? this.comments[this.comments.length - 1].id : -1;

    this.adminService.loadMoreComments(id, 10).subscribe(
      comments => {
        comments.forEach(comment => {
          this.comments.push(comment);
        });
      }
    );
  }
  loadMoreImages() {
    const id = (this.images.size > 0) ? this.images[this.images.size - 1] : -1;

    this.adminService.loadMoreImages(id, 10).subscribe(
      urls => {
        urls.forEach(url => {
          // tslint:disable-next-line:no-shadowed-variable
          const id = Number.parseInt(url, 0);
          this.httpService.loadImage(id).subscribe(image => {
            const unsafeImageUrl = URL.createObjectURL(image);
            const imageUrl = this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
            this.images.set(id, imageUrl);
          });
        });
        this.keys = Array.from(this.images.keys());
      }
    );

  }
  deletePost(id) {
    this.adminService.deletePost(id).subscribe(res => {
      const index =  this.posts.findIndex(post => post.id === id);

      if (index > -1) {
        this.posts.splice(index, 1);
      }
    });
  }
  deleteComment(id) {
    this.adminService.deleteComment(id).subscribe(res => {
      const index =  this.posts.findIndex(comment => comment.id === id);
      if (index > -1) {
        this.comments.splice(index, 1);
      }
    });;
  }
  deleteImage(id) {
    this.adminService.deleteImage(id).subscribe(res => {
      this.images.delete(id);
    });;
  }
}
