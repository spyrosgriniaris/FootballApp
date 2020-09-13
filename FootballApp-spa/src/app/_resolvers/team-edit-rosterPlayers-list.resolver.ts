import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../_models/user';
import { Injectable } from '@angular/core';
import { MemberService } from '../_services/member.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TeamService } from '../_services/team.service';
import { AuthService } from '../_services/auth.service';

@Injectable({
    providedIn: 'root'
})

export class TeamEditRosterPlayersListResolver implements Resolve<User> {
    pageNumber = 1;
    pageSize = 10;
    team: User;
    /**
     *
     */
    constructor(private teamService: TeamService,
                private router: Router,
                private alertify: AlertifyService,
                private route: ActivatedRoute) {}

    resolve(route: ActivatedRouteSnapshot): Observable<User> {
        // tslint:disable-next-line: no-string-literal
        this.team = JSON.parse(localStorage.getItem('user'));
        console.log(this.team.id);
        return this.teamService.getUsers(this.team.id, this.pageNumber, this.pageSize).pipe(
            catchError(error => {
                this.alertify.error('Problem retrieving data');
                this.router.navigate(['/players']);
                return of(null);
            })
        );
    }
}
