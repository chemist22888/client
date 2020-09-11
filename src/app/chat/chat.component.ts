import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Chat} from '../entity/chat';
import {ChatService} from '../service/chat.service';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {Message} from '../entity/message';
import {DataReciever} from '../data-reciever';
import * as constants from '../configs/constants';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, DataReciever {

  constructor(private route: ActivatedRoute, private chatService: ChatService) {

  }
  @Input()
  chatId: string;
  chat: Chat;
  messageText: string;
  stompClient: any;
  myId: number;
  prop=2;
  ngOnInit() {
    this.chatId = this.route.snapshot.paramMap.get('id');
    this.chatService.getChat(this.chatId).subscribe(chat => {
      console.log('t1t' + chat.id);
      this.chat = chat;
      this.connect();
      this.myId = parseInt(localStorage.getItem('id'));

  });

    console.log('tt');}
  private connect() {


    const accessToken = localStorage.getItem('access_token');



    const ws = new SockJS('http://localhost:8080/socket?access_token='+accessToken);
        ws.withCredentials = true ;
    this.stompClient = Stomp.over(ws);
    this.stompClient.reconnect_delay = 5000;
    this.stompClient.connect({Authorization: `Bearer ${accessToken}`});
  }
  onMessageReceived(message) {
    let textMsg: string = message.toString();
    textMsg = textMsg.substring(textMsg.indexOf('{'));
    console.log(message);
    const msg: Message = JSON.parse(message.body);
    // JSON.parse(textMsg).chatId;
    console.log(msg.chat.id + ' ' + this.chat.id);
    if (msg.chat.id === this.chat.id) {
      console.log('5f');
      // msg.chat = this.chat;
      const l = this.chat.messages.push(msg);
      // console.log(this.chat.messages[l-1])
      // msg);messages.push(msg);
    }
    console.log('Message Recieved from Server :: ' + msg.text);
  }

  sendMessage() {

    const msg = new Message();
    msg.text = this.messageText;
    msg.chat = Object.assign({}, this.chat);
    msg.chat.messages = null;
    // msg.chat.messages = null;
    console.log('t1t' + this.chat.messages.length);
    if (this.chat) {
      this.stompClient.send('/app/send/message/c' + this.chat.id, {}, JSON.stringify(msg));

      // this.chatComponent.chat.messages.push(msg);
    }
    // this.chatService.writeMessage(this.messageText,this.chatId).subscribe(message => this.chat.messages.push(message));
  }

  recieve(type, msg) {
    console.log(msg);
    console.log(msg.chat.id + ' ' + this.chat.id);
    if (type === constants.MESSAGE_DATA && msg.chat.id === this.chat.id) {
      console.log('5f');
      // msg.chat = this.chat;
      const l = this.chat.messages.push(msg);
      console.log('Message Recieved from Server :: ' + msg.text);
      // console.log(this.chat.messages[l-1])
      // msg);messages.push(msg);
    }
    console.log('Message Recieved from Server :: ' + msg.text);
  }

}
