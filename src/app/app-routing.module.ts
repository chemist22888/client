import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {PersonComponent} from './person/person.component';
import {ChatComponent} from './chat/chat.component';
import {LoginGuard} from './interceptor/login-guard';
import {RegistrationComponent} from './registration/registration.component';
import {AdminComponent} from './admin/admin.component';
import {ChatsComponent} from "./chats/chats.component";
import {NewsComponent} from "./news/news.component";
import {FriendRequestComponent} from "./friend-request/friend-request.component";
import {AboutComponent} from "./about/about.component";


const appRoutes: Routes = [
  {path: 'login', component: LoginComponent},
  // { path: '', redirectTo: '' },
  {path: 'user/:login', component: PersonComponent},
  {path: 'chat/:id', component: ChatComponent, canActivate: [LoginGuard], pathMatch: 'full'},
  {path: 'me', component: PersonComponent, canActivate: [LoginGuard]},
  {path: 'register', component: RegistrationComponent},
  {path: 'admin', component: AdminComponent},
  {path: 'chats', component: ChatsComponent},
  {path: 'news', component: NewsComponent},
  {path: 'request', component: FriendRequestComponent},
  {path: 'about', component: AboutComponent},
];
export const routing = RouterModule.forRoot(appRoutes);

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
