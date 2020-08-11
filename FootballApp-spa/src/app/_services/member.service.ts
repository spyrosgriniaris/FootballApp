import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { PaginatedResult } from '../_models/pagination';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  baseUrl = environment.apiUrl;
  // variables for search in players-list component
  searchWord: string;
  suggestions$: Observable<User[]>;
  errorMessageForSearch: string;


  constructor(private http: HttpClient) { }

  // getUsers(): Observable<User[]> {
  //   return this.http.get<User[]>(this.baseUrl + 'members');
  // }
  getUsers(page?, itemsPerPage?, userParams?, likesParam?): Observable<PaginatedResult<User[]>> {
    const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();
    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params.append('pageSize', itemsPerPage);
    }

    if (userParams != null){
      params = params.append('minAge', userParams.minAge);
      params = params.append('maxAge', userParams.maxAge);
      params = params.append('gender', userParams.gender);
      params = params.append('searchWord', userParams.searchWord);
    }

    // likes functionality
    if (likesParam === 'Likers')
    {
      params = params.append('likers', 'true');
    }

    if (likesParam === 'Likees')
    {
      params = params.append('likees', 'true');
    }
    // end of likes functionality

    return this.http.get<User[]>(this.baseUrl + 'members', { observe: 'response', params})
    .pipe(
      map(response => {
        paginatedResult.result = response.body;
        if (response.headers.get('Pagination') != null){
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }
        return paginatedResult;
      })
    );
  }

  getRanking(page?, itemsPerPage?): Observable<PaginatedResult<User[]>> {

    const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();
    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params.append('pageSize', itemsPerPage);
    }

    return this.http.get<User[]>(this.baseUrl + 'members/GetRanking', { observe: 'response', params})
    .pipe(
      map(response => {
        paginatedResult.result = response.body;
        if (response.headers.get('Pagination') != null){
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }
        return paginatedResult;
      })
    );
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(this.baseUrl + 'members/' + id);
  }

  updateUser(id: number, user: User){
    return this.http.put(this.baseUrl + 'members/' + id, user);
  }

  setMainPhoto(userId: number, id: number) {
    return this.http.post(this.baseUrl + 'members/' + userId + '/photos/' + id + '/setMain', {});
  }

  deletePhoto(userId: number, id: number){
    return this.http.delete(this.baseUrl + 'members/' + userId + '/photos/' + id);
  }

  sendLike(id: number, recipientId: number) {
    return this.http.post(this.baseUrl + 'members/' + id + '/like/' + recipientId, {});
  }

  getUserWithPositions(userId: number) {
    return this.http.get(this.baseUrl + 'admin/usersWithRoles');
  }

  updateUserPositions(user: User, positions: {}) {
    console.log(user.userName);
    console.log(positions);
    return this.http.post(this.baseUrl + 'members/' + user.id + '/UpdatePositions', positions);
  }

}
