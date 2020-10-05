import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {User} from '../entity/user';
import {HttpServiceService} from '../service/http-service.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {UserService} from '../service/user.service';
import {Message} from '../entity/message';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {DataReciever} from '../data-reciever';
import * as constants from '../configs/constants';
import {Post} from '../entity/post';
import {Like} from '../entity/like';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit, DataReciever {
  public img: SafeUrl[];
  prop = 1;
  user: User;
  @Input() login: string;
  stompClient: any;
  APPLY_FRIEND_REQUEST = 1;
  CANCEL_FRIEND_REQUEST = -1;
  ACCEPT_FRIEND_REQUEST = 2;
  DELETE_FRIEND = -2;
  DECLINE_FRIEND_REQUEST = 0;
  me: User;
  avatarUrl: SafeUrl;
  uploadedImages: number[] = [];
  imagesPreview: SafeUrl[] = [];
  postText = '';
  id: number;
  filename: string;
  @ViewChild('imageInput', {static: false}) myDiv: ElementRef;

  constructor(private route: ActivatedRoute,
              private httpService: HttpServiceService,
              private router: Router,
              private userService: UserService,
              private sanitizer: DomSanitizer) {}

  applyRequest() {
    this.userService.applyRequest(this.user.username).subscribe(() => this.user.friendStatus = 1);
  }

  acceptRequest() {
    this.userService.acceptRequest(this.user.username).subscribe(() => this.user.friendStatus = 2);
  }

  declineRequest() {
    this.userService.declineRequest(this.user.username).subscribe(() => this.user.friendStatus = 0);
  }

  unbond() {
    this.userService.unbond(this.user.username).subscribe(() => this.user.friendStatus = 0);
  }

  cancel() {
    this.userService.cancelRequest(this.user.username).subscribe(() => this.user.friendStatus = 0);
  }

  ngOnInit() {
    this.id = Number.parseInt(localStorage.getItem('id'), 0);
    this.me = JSON.parse(localStorage.getItem('me'));
    if (this.router.url === '/me') {
      this.login = localStorage.getItem('username');
    } else {
      this.login = this.route.snapshot.paramMap.get('login');
    }
    this.httpService.user(this.login).subscribe(user => {
      this.user = user;

      this.httpService.loadImage(user.avatar).subscribe(image => {
        const unsafeImageUrl = URL.createObjectURL(image);
        this.avatarUrl = this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
      });
      user.posts.forEach(post => {
        post.imageUrls = [];
        post.text = post.text.replace(/(\r\n|\n|\r)/gm, '<br>');
        post.liked = post.likers.filter(liker => liker.id === this.id).length !== 0;
      });
    });

    this.connect();
  }

  private connect() {
    const ws = new SockJS(`${constants.BASE_URL}/socket`);
    this.stompClient = Stomp.over(ws);
    this.stompClient.connect({Authorization: 'Basic ' + localStorage.getItem('token')}, (frame) => {
      this.stompClient.subscribe('/user/friend', (sdkEvent) => {
        this.onMessageReceived(sdkEvent);
      });
    });
  }

  onMessageReceived(message) {
    console.log('friends');
    let textMsg: string = message.toString();
    textMsg = textMsg.substring(textMsg.indexOf('{'));

    if (JSON.parse(textMsg).username === this.user.username) {
      this.user.friendStatus = JSON.parse(textMsg).friendStatus;
    }
  }

  recieve(type, object) {
    console.log(type);
    console.log(object);
    switch (type) {
      case constants.FRIEND_DATA:
        const userid = object.user.id;
        if (userid === this.user.id) {
          switch (object.friendStatus) {
            case constants.ACCEPT_FRIEND_REQUEST:
              this.user.friendStatus = 2;
              break;
            case constants.DELETE_FRIEND:

              this.user.friendStatus = 0;
              break;
            case constants.CANCEL_FRIEND_REQUEST:

              this.user.friendStatus = 0;
              break;
            case constants.APPLY_FRIEND_REQUEST:
              this.user.friendStatus = -1;
              break;
            case constants.DECLINE_FRIEND_REQUEST:
              this.user.friendStatus = 0;
              break;
          }
        }
        break;
      case constants.COMENT_DATA:
        const postId = object.post.id;
        if (postId !== this.id) {
          const postIndex = this.user.posts.findIndex(post => post.id === postId);
          this.user.posts[postIndex].coments.push(object);
        }
    }
  }

  likePost(post: Post) {
    console.log('e');
    const like = new Like();
    like.user = new User(this.id);
    this.userService.likePost(post.id).subscribe(res => {
      post.likes.push(like);
      post.liked = true;
      post.likers.push(new User(this.id));
    });
  }

  unlikePost(post: Post) {
    console.log('e');
    const like = new Like();

    this.userService.unlikePost(post.id).subscribe(res => {
      console.log('rooock');
      post.liked = false;
      post.likes = post.likes.filter((likepost) => likepost.user.id !== this.id);
      post.likers = post.likers.filter((liker) => liker.id !== this.id);
    });
  }

  uploadImage(evt, funct: (event: ProgressEvent, filename: string) => void) {
    const files = evt.target.files;
    const file = files[0];
    this.filename = file.name;

    if (files && file) {
      const reader = new FileReader();
      // this.filename = file.name;
      reader.onload = funct.bind(this);
      console.log(this.filename);
      reader.readAsBinaryString(file);
    }
  }

  _handleReaderLoaded(readerEvt) {
    const binaryString = readerEvt.target.result;
    const encodedString = btoa(binaryString);
    const type = this.filename.substr(this.filename.lastIndexOf('.') + 1, 3);

    this.httpService.uploadImage(encodedString, type)
      .subscribe(e => {
        this.uploadedImages.push(Number.parseInt(JSON.stringify(e), 0));
        const imageUrl = this.sanitizer.bypassSecurityTrustUrl(`data:image/${type};base64,` + encodedString);
        this.imagesPreview.push(imageUrl);
      });
  }

  writePost(text: string) {
    this.httpService.writePost(text, this.uploadedImages).subscribe(res => {
      this.uploadedImages = [];
      this.imagesPreview = [];
      res.text = res.text.replace(/(\r\n|\n|\r)/gm, '<br>');

      res.imageUrls = [];
      res.images.forEach(image => {
        this.httpService.loadImage(image).subscribe(result => {
          const unsafeImageUrl = URL.createObjectURL(result);
          const imageUrl = this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
          res.imageUrls.push(imageUrl);
        });
      });
      this.user.posts.push(res);
    });
  }

  loadAvatar(event) {
    const binaryString = event.target.result;
    const encodedString = btoa(binaryString);
    // console.log(binaryString);
    const type = this.filename.substr(this.filename.lastIndexOf('.') + 1, 3);

    this.httpService.uploadAvatar(encodedString, type)
      .subscribe(e => {
        console.log(e);
        this.httpService.loadImage(e).subscribe(res => {
          this.uploadedImages.push(e);
          const reader = new FileReader();
          reader.readAsDataURL(res);
          reader.onloadend = ev => {
            this.avatarUrl = this.sanitizer.bypassSecurityTrustUrl('' + reader.result)
          };
        });
      });
  }

  writeComment(text: string, post: Post) {
    this.httpService.sendComment(text, post.id).subscribe(comment => {
      post.coments.push(comment);
    });
  }
}
