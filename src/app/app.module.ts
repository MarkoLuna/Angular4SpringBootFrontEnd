import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AboutComponent } from './about/about.component';
import { MainComponent } from './main/main.component';

import { HttpModule } from '@angular/http';

import { AuthJWTManagementService } from './auth-jwtmanagement.service';
import { AuthComponent } from './auth/auth.component'

const appRoutes: Routes = [
  { path: 'home', component: MainComponent },
  { path: 'about', component: AboutComponent },
  { path: 'login', component: AuthComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    AboutComponent,
    MainComponent,
    AuthComponent
    
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    HttpModule,
    FormsModule
    
  ],
  providers: [AuthJWTManagementService],
  bootstrap: [AppComponent]
})
export class AppModule { }
