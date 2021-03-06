import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from './_services/auth.service';
import { Subject, Subscription } from 'rxjs';
import { Router, NavigationStart } from '@angular/router';
import { User } from './_models/user';
import { environment } from 'src/environments/environment';

export let browserRefresh = false;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'FootballApp';
  jwtHelper = new JwtHelperService();
  tokenChangedForRefresh = new Subject<string>();
  subscription: Subscription;

  cookieLawSeen: boolean;
  @ViewChild('cookieLaw')
  cookieLawEl: any;

  constructor(private authService: AuthService,
              private router: Router){
                // detects refresh of browser
                this.subscription = router.events.subscribe((event) => {
                  if (event instanceof NavigationStart) {
                    browserRefresh = !router.navigated;
                    this.tokenChangedForRefresh.next(localStorage.getItem('token'));
                  }
                });
              }
  // tslint:disable-next-line: use-lifecycle-interface
  ngOnInit(){
    const token = localStorage.getItem('token');
    const user: User = JSON.parse(localStorage.getItem('user'));
    // afairw apo local storage sti logout tou nav component
    if (token){
      this.authService.decodedToken = this.jwtHelper.decodeToken(token);
    }
    if (user){
      this.authService.currentUser = user;
      this.authService.changeMemberPhoto(user.photoUrl);
    }
    this.cookieLawSeen = this.cookieLawEl.cookieLawSeen;
  }

  // cookies policy accept
}
