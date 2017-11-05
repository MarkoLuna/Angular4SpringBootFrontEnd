import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Http, Response, Headers } from '@angular/http';
import { HttpHeaders, HttpResponseBase, HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class AuthJWTManagementService {

  AUTH_TOKEN_HEADER : string = 'Authorization';
  TOKEN_PREFIX : string = 'Bearer';
  loginUrl = 'http://127.0.0.1:8080/SpringBootRestApi/login';
  authenticate : boolean = false;

  user = {username: 'admin', password: 'password'};

  constructor(private http: HttpClient) {
    if(this.getToken() !== ''){
      this.authenticate = true;
    }
  }

  auth(credentials) {
    var promise = new Promise((resolve, reject) => {
      this.http.post(this.loginUrl, credentials, {
        headers: new HttpHeaders().set('Content-Type', 'text/plain'),
          observe: 'response'
      }).subscribe((data) => {
          this.setToken(data.headers.get(this.AUTH_TOKEN_HEADER));
  
          if(this.getToken() !== ''){
              this.authenticate = true;
          }else{
              this.authenticate = false;
              console.error('NO '+this.AUTH_TOKEN_HEADER+' token found');
          }
          this.user = credentials;
          resolve();
      }, (err: HttpErrorResponse) => {
          this.authenticate = false;
        console.log('Something went wrong! on login');
        console.log(err);
        console.log(err.message);
        reject(err.message);
      });
    });
    return promise;
  }

  isAuthenticated(){
      return this.authenticate && this.getToken() !== '';
  }
  setToken(token){
      localStorage.setItem(this.AUTH_TOKEN_HEADER, token);
  }

  getToken(){
      if(localStorage.getItem(this.AUTH_TOKEN_HEADER)!=null)
          return localStorage.getItem(this.AUTH_TOKEN_HEADER);
      return '';
  }

  getUser(){
    return this.user;
  }
}
