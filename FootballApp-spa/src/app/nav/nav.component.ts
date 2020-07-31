import { Component, OnInit,ViewEncapsulation, AfterViewInit, HostListener } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
  tokenChangedForLogout = new Subject<string>();
  collapsed = true;

  constructor(public authService: AuthService,
              private router: Router,
              private alertify: AlertifyService) { }

  ngOnInit() {
  }

  login() {
    this.authService.login(this.model).subscribe(
      next => {
        this.alertify.success('Login successfully');
      }, error => {
        this.alertify.error(error);
        console.log(error);
      }, () => {
        this.router.navigate(['/players']);
      }
    );
  }

  loggedIn() {
    return this.authService.loggedIn();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.authService.decodedToken = null;
    this.authService.currentUser = null;
    this.alertify.message('logged out');
    this.tokenChangedForLogout.next('loggedOut');
    this.router.navigate(['/home']);
  }

}
