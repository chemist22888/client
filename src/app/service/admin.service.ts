import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Post} from '../entity/post';
import {Comment} from '../entity/comment';
import {map} from 'rxjs/operators';
import {HttpServiceService} from './http-service.service';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import * as constants from '../configs/constants'

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private http: HttpClient, private httpService: HttpServiceService, private sanitizer: DomSanitizer) {}
  loadMorePosts(lastId= -1, quantity = -1): Observable<Post[]> {
    return this.http.get<Post[]>(`${constants.BASE_URL}/admin/getPosts?lastId=${lastId}&quantity=${quantity}`);
  }
  loadMoreComments(lastId= -1, quantity = -1): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${constants.BASE_URL}/admin/getComments?lastId=${lastId}&quantity=${quantity}`);
  }
  loadMoreImages(lastId: number = -1, quantity: number = -1): Observable<string[]> {
    return this.http.get<string[]>(`${constants.BASE_URL}/admin/getImages?lastId=${lastId}&quantity=${quantity}`);
  }
  deletePost(postId: number) {
    return this.http.post<string[]>(`${constants.BASE_URL}/admin/dropPost`, new HttpParams()
      .set('id', String(postId)));
  }
  deleteComment(commentId: number) {
    return this.http.post<string[]>(`${constants.BASE_URL}/admin/dropComment`, new HttpParams()
      .set('id', String(commentId)));
  }
  deleteImage(imageId: number) {
    return this.http.post<string[]>(`${constants.BASE_URL}/admin/dropImage`, new HttpParams()
      .set('id', String(imageId)));
  }
}
