import { Component, OnInit } from '@angular/core';
import {User} from '../entity/user';
import {HttpServiceService} from '../service/http-service.service';
import { AuthenticationService } from '../service/authentication.service';
import { UserService } from '../service/user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    username: string;
    password: string;
  constructor(private router: Router, private httpService: HttpServiceService,
              private authService: AuthenticationService, private userService: UserService ) { }

  submit() {
    const token =  btoa(`${this.username}:${this.password}`);
    this.authService.token(this.username, this.password).subscribe(() => {

      console.log('logged in');

      this.userService.getLogin().subscribe(me => {console.log(me['username']);
      localStorage.setItem('username', me['username']);
      localStorage.setItem('me', JSON.stringify(me));
      localStorage.setItem('id', me['id']);

      this.router.navigateByUrl('/me').then(() => {
          window.location.reload();
        });
      });
      // localStorage.setItem('token', token);
      // localStorage.setItem('username',this.username);
      //                                              console.log( btoa(`${this.username}:${this.password}`));
    }, error => console.log('err' + error));
  }
  ngOnInit() {
  }

}
