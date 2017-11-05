import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { AuthJWTManagementService } from './../auth-jwtmanagement.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  user : String = '';
  password : String = '';

  constructor(private route: ActivatedRoute,
    private router: Router,
    private authManagement: AuthJWTManagementService) { }

  ngOnInit() {
  }

  login(event){
    event.preventDefault();
    console.log(event);

    console.log(this.user);
    console.log(this.password);  

    if(this.user === '' || this.password === ''){
      console.log("completa los campos");
      return;
    }

    // username: 'admin', password: 'password'
    const credentials = {username: this.user, password: this.password};

    this.authManagement.auth(credentials).then(()=>{
      if(this.authManagement.isAuthenticated()){
        this.goToUserPage();
      }else{
        console.log("credenciales erroneas");
      }
      
    }).catch((data)=>{
      console.log("ha sucedido un error");
      console.log(data);
    });
  }

  goToUserPage(){
    this.router.navigate(['/home']);
  }
}
