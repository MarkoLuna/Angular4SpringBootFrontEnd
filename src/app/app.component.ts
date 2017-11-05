import { Component } from '@angular/core';

import { AuthJWTManagementService } from './auth-jwtmanagement.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  user : String =  'User Api Application';
  constructor(private authManagement: AuthJWTManagementService){
    if(this.authManagement.isAuthenticated() ){
      // console.log('User Authenticated');
      this.user = this.authManagement.getUser().username;
    }else{
      this.user = 'User Api Application';
    }
  }


}
