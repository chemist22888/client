import {Component, OnInit} from '@angular/core';
import {User} from '../entity/user';
import {HttpServiceService} from '../service/http-service.service';
import {AuthenticationService} from '../service/authentication.service';
import {UserService} from '../service/user.service';
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
              private authService: AuthenticationService, private userService: UserService) {
  }

  submit() {
    this.authService.token(this.username, this.password).subscribe(() => {

      this.userService.getMeShort().subscribe(user => {
        localStorage.setItem('username',user['username']);
        localStorage.setItem('id',user['id']);

        this.router.navigateByUrl('/me');
      });
    }, error => console.log('err' + error));
  }
  ngOnInit() {
  }
}
