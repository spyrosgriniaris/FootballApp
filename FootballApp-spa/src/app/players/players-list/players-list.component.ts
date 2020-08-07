import { Component, OnInit } from '@angular/core';
import { noop, Observable, Observer, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/_models/user';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { MemberService } from 'src/app/_services/member.service';
import { Pagination, PaginatedResult } from 'src/app/_models/pagination';
import { HttpClient } from '@angular/common/http';
import { UserSearchResponse } from 'src/app/_models/user-search-response';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-players-list',
  templateUrl: './players-list.component.html',
  styleUrls: ['./players-list.component.css']
})
export class PlayersListComponent implements OnInit {
  users: User[];
  user: User = JSON.parse(localStorage.getItem('user'));
  pagination: Pagination;
  genderList = [{value: 'male', display: 'Males'}, {value: 'female', display: 'Female'}];
  userParams: any = {};

  // variables for search
  // searchWord: string;
  // suggestions$: Observable<User[]>;
  // errorMessageForSearch: string;


  constructor(private memberService: MemberService,
              private alertify: AlertifyService,
              private route: ActivatedRoute,
              private http: HttpClient) { }

  ngOnInit() {
    //this.loadUsers();
    this.route.data.subscribe(
      data => {
        this.users = data['users'].result;
        this.pagination = data['users'].pagination;
      }
    );

    // additional filtering area
    this.userParams.gender = this.user.gender === 'female' ? 'female' : 'male';
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;
    this.userParams.searchWord = '';
    // end of additional filtering area

    // this.suggestions$ = new Observable((observer: Observer<string>) => {
    //   observer.next(this.searchWord);
    // }).pipe(
    //   switchMap((query: string) => {
    //     if (query) {
    //       console.log(query);
    //       // using github public api to get users by name
    //       return this.http.get<UserSearchResponse>(
    //         'http://localhost:5000/api/members/SearchUsers/' + query).pipe(
    //         map((data: UserSearchResponse) => data && data.items || []),
    //         tap(() => noop, err => {
    //           // in case of http error
    //           this.errorMessageForSearch = err && err.message || 'Something goes wrong';
    //         })
    //       );
    //     }
    //     return of([]);
    //   })
    // );
  }


  loadUsers() {
    // console.log(this.userParams.searchWord);
    this.memberService.getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, this.userParams).subscribe(
      (res: PaginatedResult<User[]>) => {
        this.users = res.result;
        this.pagination = res.pagination;
      }, error => {
        console.log(error);
      }
    );
  }

  pageChanged(event: any): void{
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }

  resetFilters() {
    this.userParams.gender = this.user.gender === 'female' ? 'female' : 'male';
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;
    this.loadUsers();
  }

  searchUsers() {
    if (!this.userParams.searchWord) {
      this.userParams.searchWord = '';
      this.loadUsers();
    }
    else {
      this.loadUsers();
    }
  }

}
