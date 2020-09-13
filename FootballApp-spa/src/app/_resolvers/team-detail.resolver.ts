import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { User } from '../_models/user';
import { Injectable } from '@angular/core';
import { MemberService } from '../_services/member.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

export class TeamDetailResolver implements Resolve<User> {
    /**
     *
     */
    team: User;
    constructor(private memberService: MemberService,
                private router: Router,
                private alertify: AlertifyService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<User> {
        // tslint:disable-next-line: no-string-literal
        this.team = JSON.parse(localStorage.getItem('user'));
        return this.memberService.getUser(route.params['id']).pipe(
            catchError(error => {
                this.alertify.error('Problem retrieving data');
                this.router.navigate(['/players']);
                return of(null);
            })
        );
    }
}