import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
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
  deletePost(postId: number) {
    return this.http.post<string[]>(`http://localhost:8080/admin/dropPost`, new HttpParams()
      .set('id', String(postId)));
  }
  deleteComment(commentId: number) {
    return this.http.post<string[]>(`http://localhost:8080/admin/dropComment`, new HttpParams()
      .set('id', String(commentId)));
  }
  deleteImage(imageId: number) {
    return this.http.post<string[]>(`http://localhost:8080/admin/dropImage`, new HttpParams()
      .set('id', String(imageId)));
  }
}

