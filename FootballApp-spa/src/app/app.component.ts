import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from './_services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'FootballApp';
  jwtHelper = new JwtHelperService();

  constructor(private authService: AuthService){}
  // tslint:disable-next-line: use-lifecycle-interface
  ngOnInit(){
    const token = localStorage.getItem('token');
    // afairw apo local storage sti logout tou nav component
    if (token){
      this.authService.decodedToken = this.jwtHelper.decodeToken(token);
    }
  }
}
