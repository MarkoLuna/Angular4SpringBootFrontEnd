import { Component } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { AuthJWTManagementService } from './auth-jwtmanagement.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  user: String =  'User Api Application';
  authenticated = false;
  constructor(
    private authManagement: AuthJWTManagementService,
    private router: Router) {

    if (this.authManagement.isAuthenticated() ) {
      // console.log('User Authenticated');
      this.user = this.authManagement.getUser().username;
    }else {
      this.user = 'User Api Application';
    }
  }

  logout() {
    this.authManagement.logout();
    this.router.navigate(['/login']);
  }
}
