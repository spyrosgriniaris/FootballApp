import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../_models/user';
import { AlertifyService } from '../_services/alertify.service';
import { MemberService } from '../_services/member.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})

export class LikesResolver implements Resolve<User[]> {
    // properties for pagination
    pageNumber = 1;
    pageSize = 5;
    likesParam = 'Likers';

    constructor(private memberService: MemberService,
                private router: Router,
                private alertify: AlertifyService) {}

                // after pagination
    resolve(route: ActivatedRouteSnapshot): Observable<User[]> {
        return this.memberService.getUsers(this.pageNumber, this.pageSize, null, this.likesParam).pipe(
            catchError(error => {
                this.alertify.error('Problem retrieving data.');
                this.router.navigate(['/home']);
                return of(null); // gurnaw null observable
            })
        );
    }
}