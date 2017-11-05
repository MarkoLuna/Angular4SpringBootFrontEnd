import { User } from './../user';
import { Alerts } from './../alerts';
import { AuthJWTManagement } from './../AuthJWTManagement'
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RequestOptions } from '@angular/http';
import { RequestOptionsArgs } from '@angular/http';

import { HttpHeaders, HttpResponseBase, HttpErrorResponse } from '@angular/common/http';

import { Http, Response, Headers } from '@angular/http';
import 'rxjs/Rx';

import { AuthJWTManagementService } from './../auth-jwtmanagement.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

declare var $:any;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  title = 'Spring Boot Rest Api App ';
  baseUrl = 'http://127.0.0.1:8080/SpringBootRestApi/api/user/';
  userList: User[];
  user: User;

  visibleAlert: Boolean = false;
  message: String = '';
  success: Boolean = false;
  info: Boolean = false;
  warning: Boolean = false;
  danger: Boolean = false;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient, 
    private authManagement: AuthJWTManagementService ) {}

  ngOnInit(): void {
    this.obtainAllUsers();
  }

  cancel() {
    this.user = null;
  }

  checkAuth(){
    if(!this.authManagement.isAuthenticated() ){
      console.log('UnAuthenticated User');
      this.router.navigate(['/login']);
    }
  }

  save() {
    if (this.user && this.user.id) {
        this.updateUser();
    } else if (this.user) {
      this.createUser();
    }
  }

  obtainAllUsers() {
    this.checkAuth();

    var data = {
        headers: new HttpHeaders()
          .set(this.authManagement.AUTH_TOKEN_HEADER, this.authManagement.getToken())
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json') 
        ,withCredentials: true
      };
    this.http.get(this.baseUrl, data).subscribe((data: User[]) => {
      // console.log(data);
      this.userList = data;
    }, (err: HttpResponseBase) => {
      console.log(err);
    });
  }

  newUser() {
    this.user = new User();
  }

  createUser() {
    console.log('createUser');

    this.http.post(this.baseUrl, this.user).subscribe((data: User) => {
      this.obtainAllUsers();
      this.cancel();
      this.showAlert('User ' + data.name + ' Created successfully', Alerts.ALERT_TYPE_SUCCESS);
    });
  }

  deleteUser(user) {
    this.http.delete(this.baseUrl + user.id).subscribe((data: User) => {
      this.obtainAllUsers();
      this.showAlert('User ' + user.name + ' Deleted successfully', Alerts.ALERT_TYPE_INFO);
    });
  }

  updateUser() {
    this.http.put(this.baseUrl + this.user.id, this.user).subscribe((data: User) => {
      console.log(data);
      this.obtainAllUsers();
      this.cancel();
      this.showAlert('User ' + data.name + ' Updated successfully', Alerts.ALERT_TYPE_SUCCESS);
    });
  }

  viewUser(user) {
    this.checkAuth();
    
    var data = {
        headers: new HttpHeaders()
          .set(this.authManagement.AUTH_TOKEN_HEADER, this.authManagement.getToken())
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json') 
        ,withCredentials: true
      };

    this.http.get(this.baseUrl + user.id, data).subscribe((data: User) => {
      console.log(data);
      this.user = data;
    });
  }

  showAlert(message, typeAlert) {
    this.message = message;
    this.visibleAlert = true;

    if (typeAlert === Alerts.ALERT_TYPE_SUCCESS) {
      this.success = true;
    }else if (typeAlert === Alerts.ALERT_TYPE_INFO) {
      this.info = true;
    }else if (typeAlert === Alerts.ALERT_TYPE_WARNING) {
      this.warning = true;
    }else if (typeAlert === Alerts.ALERT_TYPE_DANGER) {
      this.danger = true;
    }

    setTimeout(() => {
      this.visibleAlert = false;
    }, 5000);
  }
}
