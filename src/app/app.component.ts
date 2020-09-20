import {AfterViewChecked, AfterViewInit, Component, OnInit, ViewChild, ViewChildren} from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {ActivatedRoute, Router, RouterOutlet} from '@angular/router';
import {InjectableRxStompConfig, RxStompService, StompHeaders} from '@stomp/ng2-stompjs';
// import * from as Msg '@stomp/stompjs';
import {CookieService} from 'ngx-cookie-service';

// import {Message} as Msg from '/en'
import {from} from 'rxjs';
import {Message} from './entity/message';
import {Chat} from './entity/chat';
import {ChatComponent} from './chat/chat.component';
import {Route} from '@angular/router';
import {UserService} from './service/user.service';
import { HttpClient } from '@angular/common/http';
import {DataReciever} from './data-reciever';
import * as constants from './configs/constants';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})
export class AppComponent implements OnInit{
  title = 'client';
  webSocketEndPoint = 'http://localhost:8080/ws';
  topic = '/topic/greetings';
  stompClient: any;
  @ViewChildren(ChatComponent, {})
  chatComponent: ChatComponent;
  i = 0;
  recieverComponent: DataReciever;
  recieverComponentName: string;
  constructor( private http:HttpClient,private router:Router,private cs: CookieService, private route: ActivatedRoute,
               private userService: UserService) {}
  ngOnInit() {
    console.log(++this.i);
    this.connect();
  }
  public onRouterOutletActivate(event: any) {
    console.log(event);
    const currentComponent = (this.router as any).rootContexts.contexts
      && (this.router as any).rootContexts.contexts.get('primary')
      && (this.router as any).rootContexts.contexts.get('primary').outlet.component;
    if (currentComponent && currentComponent.prop ) {
      this.recieverComponent = currentComponent;
      this.recieverComponentName = currentComponent.constructor.name;
    }
  }

  private connect() {


    const accessToken = localStorage.getItem('access_token');
    const id = Number.parseInt(localStorage.getItem('id'),0);


    const ws = new SockJS('http://localhost:8080/socket?access_token=' + accessToken);
    ws.withCredentials = true ;
    this.stompClient = Stomp.over(ws);
    this.stompClient.connect({Authorization: `Bearer ${accessToken}`},  (frame) => {
      this.stompClient.subscribe('/user/queue/chat',  (sdkEvent) => {
        console.log(this.recieverComponent);
        console.log(this.i++);
        console.log(sdkEvent);
        const msg = JSON.parse(sdkEvent.body);
        if (msg.user.id !== id) {
          alert(msg.text);
          console.log(msg.text);
        }

        if (this.recieverComponent && this.recieverComponentName === 'ChatComponent') {
          this.recieverComponent.recieve(constants.MESSAGE_DATA, msg);
        }
      });

      this.stompClient.subscribe('/user/queue/friend',  (sdkEvent) => {
        const friendRequest = JSON.parse(sdkEvent.body);

        if (this.recieverComponent && this.recieverComponent.constructor.name === 'PersonComponent') {
          this.recieverComponent.recieve(constants.FRIEND_DATA, friendRequest);
        }
      });
    });
  }

}
