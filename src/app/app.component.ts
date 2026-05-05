import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthJWTManagementService } from './auth-jwtmanagement.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  user: string =  'User Api Application';

  constructor(
    public authManagement: AuthJWTManagementService,
    private router: Router
  ) {
    if (this.authManagement.isAuthenticated() ) {
      this.user = this.authManagement.getUser().username;
    } else {
      this.user = 'User Api Application';
    }
  }

  logout() {
    this.authManagement.logout();
    this.router.navigate(['/login']);
  }
}
