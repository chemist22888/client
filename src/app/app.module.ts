import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppRoutingModule, routing} from './app-routing.module';
import {LoginInterceptor} from './interceptor/login-interceptor';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { PersonComponent } from './person/person.component';
import {ErrorInterceptor} from './interceptor/error-interceptor';
import { ChatComponent } from './chat/chat.component';
import {LoginGuard} from './interceptor/login-guard';
import {InjectableRxStompConfig, RxStompService, rxStompServiceFactory} from '@stomp/ng2-stompjs';
import {myRxStompConfig} from './ws/my-rx-stomp-config';
import { CookieService } from 'ngx-cookie-service';
import { RegistrationComponent } from './registration/registration.component';
import { AdminComponent } from './admin/admin.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PersonComponent,
    ChatComponent,
    RegistrationComponent,
    AdminComponent
  ],
  imports: [routing,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule, ReactiveFormsModule
  ],
  providers: [
    LoginGuard,
    CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoginInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    { provide: RxStompService,
      useFactory: rxStompServiceFactory,
      deps: [InjectableRxStompConfig]},
    {
      provide: InjectableRxStompConfig,
      useValue: myRxStompConfig
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
