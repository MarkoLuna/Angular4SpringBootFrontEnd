import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { AuthJWTManagementService } from './../auth-jwtmanagement.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  user: String = '';
  password: String = '';
  errors: boolean = false;
  error: string = '';

  constructor(private route: ActivatedRoute,
    private router: Router,
    private authManagement: AuthJWTManagementService) { }

  ngOnInit() {
  }

  login(event) {
    event.preventDefault();

    if (this.user === '' || this.password === '') {
      console.log('completa los campos');
      this.error = 'completa los campos';
      this.errors = true;
      return;
    }
    this.errors = false;

    // username: 'admin', password: 'password'
    const credentials = {username: this.user, password: this.password};

    this.authManagement.auth(credentials).then(() => {
      if (this.authManagement.isAuthenticated()) {
        this.goToUserPage();
      }else {
        console.log('credenciales erroneas');
      }
    }).catch((data: HttpErrorResponse) => {
      const error = JSON.parse(data.error);
      if (error.error === 'Unauthorized' || error.status === 401) {
        this.error = error.message;
        this.errors = true;
      }
    });
  }

  goToUserPage() {
    this.router.navigate(['/home']);
  }
}
