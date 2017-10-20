import { User } from './../user';
import { Alerts } from './../alerts';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RequestOptions } from '@angular/http';
import { RequestOptionsArgs } from '@angular/http';

import { HttpHeaders, HttpResponseBase, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  title = 'Spring Boot Rest Api App ';
  baseUrl = 'http://localhost:8080/SpringBootRestApi/api/user/';
  loginUrl = 'http://localhost:8080/SpringBootRestApi/login';
  userList: User[];
  user: User;

  visibleAlert: Boolean = false;
  message: String = '';
  success: Boolean = false;
  info: Boolean = false;
  warning: Boolean = false;
  danger: Boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.obtainAllUsers();
  }

  cancel() {
    this.user = null;
  }

  save() {
    if (this.user && this.user.id) {
        this.updateUser();
    } else if (this.user) {
      this.createUser();
    }
  }

  login() {
    const credentials = {username: 'admin', password: 'password'};
    this.http.post(this.loginUrl, credentials, {
      headers: new HttpHeaders().set('Content-Type', 'text/plain'), // 'application/json'
        // .set('Content-Type', 'application/x-www-form-urlencoded'),
        observe: 'response'
    }).subscribe((data) => {
      console.log(data);
      console.log(data.headers.get('authorization'));
      console.log(data.headers.get('cache-control'));
      console.log(data.headers.keys());
    }, (err: HttpErrorResponse) => {
      console.log('Something went wrong! on login');
      console.log(err);
      console.log(err.message);
    });
  }

  createUser() {
    console.log('createUser');

    this.http.post(this.baseUrl, this.user).subscribe((data: User) => {
      this.obtainAllUsers();
      this.cancel();
      this.showAlert('User ' + data.name + ' Created successfully', Alerts.ALERT_TYPE_SUCCESS);
    });
  }

  obtainAllUsers() {
    this.http.get(this.baseUrl).subscribe((data: User[]) => {
      this.userList = data;
    }, (err: HttpResponseBase) => {
      // console.log(err);
      if (err.status === 403) {
        console.log('Authenticating User');
        this.login();
      }
    });
  }

  newUser() {
    this.user = new User();
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
    this.http.get(this.baseUrl + user.id).subscribe((data: User) => {
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
