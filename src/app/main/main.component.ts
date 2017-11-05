import { User } from './../user';
import { Alerts } from './../alerts';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RequestOptions } from '@angular/http';
import { RequestOptionsArgs } from '@angular/http';

import { HttpHeaders, HttpResponseBase, HttpErrorResponse } from '@angular/common/http';

import { Http, Response, Headers } from '@angular/http';
import 'rxjs/Rx';

declare var $:any;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  title = 'Spring Boot Rest Api App ';
  baseUrl = 'http://127.0.0.1:8080/SpringBootRestApi/api/user/';
  loginUrl = 'http://127.0.0.1:8080/SpringBootRestApi/login';
  userList: User[];
  user: User;

  AUTH_TOKEN_HEADER : string = 'Authorization';
  TOKEN_PREFIX : string = 'Bearer';

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
      headers: new HttpHeaders().set('Content-Type', 'text/plain'),
        observe: 'response'
    }).subscribe((data) => {
      this.setJWT(data.headers.get(this.AUTH_TOKEN_HEADER));

       if(this.getJWT() !== ''){
        setTimeout(
          () => this.obtainAllUsers()
        , 3000);
      }else{
        console.error('NO '+this.AUTH_TOKEN_HEADER+' token found');
      }
    }, (err: HttpErrorResponse) => {
      console.log('Something went wrong! on login');
      console.log(err);
      console.log(err.message);
    });
  }

  deleteUser2() {
    this.http.delete(this.baseUrl + '59ec07b2310fd20608c9b493',{
      headers: new HttpHeaders().set(this.AUTH_TOKEN_HEADER, this.getJWT())
    }).subscribe((data: any) => {
      // this.obtainAllUsers();
      this.showAlert('User ' + '59ec07b2310fd20608c9b493' + ' Deleted successfully', Alerts.ALERT_TYPE_INFO);
    });
  }

  viewUser2() {
    this.http.get(this.baseUrl + '59ec07b2310fd20608c9b493', {
      headers: new HttpHeaders().set(this.AUTH_TOKEN_HEADER, this.getJWT()), //.set('Content-Type', 'application/json')  'application/json', // .replace(this.TOKEN_PREFIX, '')
      observe: 'response',
    }).subscribe((data) => {
      console.log(data);
      // this.user = data;
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
    if(this.getJWT() === ''){
      console.log('Authenticating User');
      this.login();
      return;
    }

    var data = {
        headers: new HttpHeaders()
          .set(this.AUTH_TOKEN_HEADER, this.getJWT())
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json') 
        ,withCredentials: true
      };
    this.http.get(this.baseUrl, data).subscribe((data: User[]) => {
      // console.log(data);
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

  setJWT(jwt){
    localStorage.setItem(this.AUTH_TOKEN_HEADER, jwt);
  }

  getJWT(){
    if(localStorage.getItem(this.AUTH_TOKEN_HEADER)!=null)
      return localStorage.getItem(this.AUTH_TOKEN_HEADER);
    return '';
  }
}
