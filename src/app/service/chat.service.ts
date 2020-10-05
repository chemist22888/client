import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Chat} from '../entity/chat';
import {Message} from '../entity/message';
import * as constants from '../configs/constants';
@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) { }
  getChat(id: string) {
    return this.http.get<Chat>(`${constants.BASE_URL}/chat/${id}`);
  }
  getChats() {
    return this.http.get<Chat[]>(`${constants.BASE_URL}/chats`);
  }
  writeMessage(text: string, id: string) {
    const httpBody = new HttpParams()
      .set('id', id)
      .set('text', text);
    return this.http.post<Message>(`${constants.BASE_URL}/send`, httpBody);
  }
}
