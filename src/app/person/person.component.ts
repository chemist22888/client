import {Component, Input, OnInit} from '@angular/core';
import {User} from '../entity/user';
import {HttpServiceService} from '../service/http-service.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {UserService} from '../service/user.service';
import {Message} from '../entity/message';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
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
  @Input()login: string;
  stompClient: any;
  APPLY_FRIEND_REQUEST = 1;
  CANCEL_FRIEND_REQUEST = -1;
  ACCEPT_FRIEND_REQUEST = 2;
  DELETE_FRIEND = -2;
  DECLINE_FRIEND_REQUEST = 0;
  me: User;
  avatarUrl: SafeUrl;
  constructor(    private route: ActivatedRoute,
                  private httpService: HttpServiceService,
                  private router: Router,
                  private userService: UserService,
                  private sanitizer: DomSanitizer,
                  ) {

    // const login1: Observable<string> = route.params.pipe(map(p => p.login));
    // login1.subscribe(login => this.login = login);
  }
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
    this.me = JSON.parse(localStorage.getItem('me'));
    console.log('e' + this.router.url);
    if (this.router.url === '/me') {
      this.login = localStorage.getItem('username');
    } else {
      this.login = this.route.snapshot.paramMap.get('login'); }
    console.log(this.login + 'llo');
    this.httpService.user(this.login).subscribe(user => {
      console.log(user);
      this.user = user;
      console.log(user.friendStatus);

      this.httpService.loadImage(user.avatar).subscribe(image => {
        const unsafeImageUrl = URL.createObjectURL(image);
        this.avatarUrl = this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
      });
      user.wall.posts.forEach(post => {
        post.imageUrls = [];
        // console.log(post.images);
        post.images.forEach(image => {
          console.log(image);
          this.httpService.loadImage(image).subscribe(result => {
                    const unsafeImageUrl = URL.createObjectURL(result);
                    const imageUrl = this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
                    post.imageUrls.push(imageUrl);
                  });
                });

      });
    });

    this.connect();
  }


//   loadImage(name:string):SafeUrl {
//     this.httpService.loadImage(name).subscribe(result => {
//       const src = this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;' + result);
//       return src;
//     });
// }


  private connect() {
    const ws = new SockJS('http://localhost:8080/socket');
    this.stompClient = Stomp.over(ws);
    this.stompClient.connect({Authorization: 'Basic ' + localStorage.getItem('token')},  (frame) => {
      this.stompClient.subscribe('/user/friend',  (sdkEvent) => {
        this.onMessageReceived(sdkEvent);
      });
    });
  }
  onMessageReceived(message) {
    console.log('friends');
    let textMsg: string = message.toString();
    textMsg = textMsg.substring(textMsg.indexOf('{'));
    // JSON.parse(textMsg).chatId;
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
    }
  }
  likePost(post: Post) {
    console.log('like');
    const like = new Like();
    like.user = this.me;
    this.userService.likePost(post.id).subscribe(res => post.likes.push(like));
  }
}
