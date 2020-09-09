import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { User } from '../_models/user';
import { Injectable } from '@angular/core';
import { MemberService } from '../_services/member.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';

@Injectable({
    providedIn: 'root'
})

export class TeamEditResolver implements Resolve<User> {
    /**
     *
     */
    constructor(private memberService: MemberService,
                private router: Router,
                private alertify: AlertifyService,
                private authService: AuthService) {}

        resolve(route: ActivatedRouteSnapshot): Observable<User> {
            return this.memberService.getUser(this.authService.decodedToken.nameid).pipe(
                catchError(error => {
                    this.alertify.error('Problem retrieving data.');
                    this.router.navigate(['/players']);
                    return of(null); // gurnaw null observable
                })
            );
        }
}