import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Post} from '../entity/post';
import {Comment} from '../entity/comment';
import {map} from 'rxjs/operators';
import {HttpServiceService} from './http-service.service';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private http: HttpClient, private httpService: HttpServiceService, private sanitizer: DomSanitizer) {}
  loadMorePosts(lastId= -1, quantity = -1): Observable<Post[]> {
    return this.http.get<Post[]>(`http://localhost:8080/admin/getPosts?lastId=${lastId}&quantity=${quantity}`);
  }
  loadMoreComments(lastId= -1, quantity = -1): Observable<Comment[]> {
    return this.http.get<Comment[]>(`http://localhost:8080/admin/getComments?lastId=${lastId}&quantity=${quantity}`);
  }
  loadMoreImages(lastId: number = -1, quantity: number = -1): Observable<string[]> {
    return this.http.get<string[]>(`http://localhost:8080/admin/getImages?lastId=${lastId}&quantity=${quantity}`);
  }
  formParams(lastId?: number, quantity?: number): string {
    let params = '';
    if (lastId) {
      params += `lastId=${lastId}&`;
    }
    if (quantity) {
      params += `quantity=${quantity}`;
    } else {
      params += `quantity=10`;
    }
    return params;
  }
}

