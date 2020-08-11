import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';
import { MemberService } from '../_services/member.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../_models/user';

@Injectable({
    providedIn: 'root'
})

export class RankResolver implements Resolve<User[]> {
    // properties for pagination
    pageNumber = 1;
    pageSize = 5;

    constructor(private membersService: MemberService,
                private router: Router,
                private alertify: AlertifyService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<User[]> {
        return this.membersService.getRanking(this.pageNumber, this.pageSize).pipe(
            catchError(error => {
                this.alertify.error('Problem retrieving data.');
                this.router.navigate(['/players']);
                return of(null); // gurnaw null observable
            })
        );
    }
}