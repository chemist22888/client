import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Chat} from '../entity/chat';
import {Message} from '../entity/message';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) { }
  getChat(id: string) {
    return this.http.get<Chat>(`http://localhost:8080/chat/${id}`);
  }
  writeMessage(text: string, id: string) {
    const httpBody = new HttpParams()
      .set('id', id)
      .set('text', text);
    return this.http.post<Message>('http://localhost:8080/send', httpBody);
  }
}
