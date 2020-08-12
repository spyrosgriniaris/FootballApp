import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService,
              private alertify: AlertifyService,
              private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot): boolean {
    const roles = next.data.roles as Array<string>;
    if (roles) {
      const match = this.authService.roleMatch(roles);
      if (match) {
        return true;
      }
      else {
        this.router.navigate(['/players']);
        this.alertify.error('You are not authorised to access this area');
        // return false;
      }
    }
    if (this.authService.loggedIn()) {
      return true;
    }

    this.alertify.error('You have to login first!');
    this.router.navigate(['/home']);
    return false;
  }
}
