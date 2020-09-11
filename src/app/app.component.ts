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



    const ws = new SockJS('http://localhost:8080/socket?access_token=' + accessToken);
    ws.withCredentials = true ;
    this.stompClient = Stomp.over(ws);
    this.stompClient.connect({Authorization: `Bearer ${accessToken}`},  (frame) => {
      this.stompClient.subscribe('/user/chat',  (sdkEvent) => {
        console.log(this.recieverComponent);
        console.log(this.i++);
        const msg = JSON.parse(sdkEvent.body);

        alert(msg.text);
        console.log(msg.text);
        if (this.recieverComponent && this.recieverComponentName === 'ChatComponent') {
          console.log(msg.text);
          console.log(this.recieverComponentName);
          this.recieverComponent.recieve(constants.MESSAGE_DATA, msg);
        }
        // }
        // this.onMessageReceived(sdkEvent);
      });

      this.stompClient.subscribe('/user/queue/friend',  (sdkEvent) => {
        console.log(this.recieverComponent);
        console.log(this.recieverComponentName);
        console.log(this.i++);
        const friendRequest = JSON.parse(sdkEvent.body);

        if (this.recieverComponent && this.recieverComponent.constructor.name === 'PersonComponent') {
          console.log("eee");
          this.recieverComponent.recieve(constants.FRIEND_DATA, friendRequest);
        }
        // }
        // this.onMessageReceived(sdkEvent);
      });
    });
  }


  onFriendRequestRecieved(friendRequest){
    let textMsg: string = friendRequest.toString();
    textMsg = textMsg.substring(textMsg.indexOf('{'));
    const msg: Message = JSON.parse(textMsg);
  }
  onMessageReceived(message) {
    let textMsg: string = message.toString();
    textMsg = textMsg.substring(textMsg.indexOf('{'));
    const msg: Message = JSON.parse(textMsg);
    // console.loge Recieved from Server :: ' + msg.text);

  // initializeWebSocketConnection() e

    // const sHeaders = new StompHeaders();
    // sHeaders.Authorization = 'Basic bG9naW4xOnBhc3N3b3Jk';
    // // put the CSRF h
    // console.log(child.getName());er into the connectHeaders on the config
  // uscribe('/user/chat/1', (message) => {
    //     if (message.body) {
    //       console.log('EEE' + message.body);
    //     }
    //   });
    // });
  }

  sendMessage(message) {
    const currentComponent = (this.router as any).rootContexts.contexts
      && (this.router as any).rootContexts.contexts.get('primary')
      && (this.router as any).rootContexts.contexts.get('primary').outlet.component;

    console.log(currentComponent.constructor.name);

    this.userService.getLogin().subscribe(login => console.log(login));
    const chat = new Chat();
    chat.id = 1;
    const msg = new Message();
    msg.text = 'hello';
    msg.chat = chat;
    if (chat) {
      // this.chatComponent.chat.messages.push(msg);
    }

    // this.stompClient.send('/app/send/message/1', {}, JSON.stringify(msg));
    // this.rxStompService.publish({destination: '/app/send/message', body: message});
    // this.stompClient.send('/app/send/message' , {}, message);
    // $('#input').val('');
  }

  onFileChanged(event) {
        const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {



     this.http.post('http://localhost:8080/loadImage', 'data:image/png;base64,'
     + btoa(reader.result.toString().split(',')[1]))
        .subscribe(e=>console.log(e));
    };

}
  handleFileSelect(evt) {
    const files = evt.target.files;
    const file = files[0];

    if (files && file) {
      const reader = new FileReader();

      reader.onload = this._handleReaderLoaded.bind(this);

      reader.readAsBinaryString(file);
    }
  }



  _handleReaderLoaded(readerEvt) {
    const binaryString = readerEvt.target.result;
    const base64textString = btoa(binaryString);

    this.http.post('http://localhost:8080/loadImage', 'data:image/png;base64,'
      + base64textString)
      .subscribe(e => console.log(e));
    console.log(btoa(binaryString));
  }
}
