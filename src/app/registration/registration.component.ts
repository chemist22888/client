import { Component, OnInit } from '@angular/core';
import {HttpServiceService} from '../service/http-service.service';
import {ActivatedRoute, Route, Router} from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  username: string;
  password: string;
  email: string;
  confirmId: string;
  constructor(private httpService: HttpServiceService, private route: ActivatedRoute,private router: Router) { }

  ngOnInit() {
    console.log('aa');

    this.route.queryParamMap.subscribe(params => {
      this.confirmId = params.get('confirmId');
      console.log(this.confirmId);

      if (this.confirmId) {
        console.log(this.confirmId);
        this.httpService.confirmRegistration(this.confirmId).subscribe(() => {
          this.router.navigateByUrl('/login');
        });
      }
    });
  }

  register() {
    this.httpService.registrateUser(this.username, this.password, this.email).subscribe(res => {console.log(res);});
  }
}
