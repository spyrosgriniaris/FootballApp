import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { PaginatedResult } from '../_models/pagination';
import { RosterPlayers } from '../_models/rosterPlayers';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  baseUrl = environment.apiUrl;
  // subject to store the id of selected team, taken from route parameters
  // and make it available to the parent component
  idOfSelectedTeam = new BehaviorSubject(undefined);

constructor(private http: HttpClient) { }

getUsers(teamId, page?, itemsPerPage?): Observable<PaginatedResult<RosterPlayers[]>> {
  const paginatedResult: PaginatedResult<RosterPlayers[]> = new PaginatedResult<RosterPlayers[]>();
  let params = new HttpParams();

  if (page != null && itemsPerPage != null) {
    params = params.append('pageNumber', page);
    params.append('pageSize', itemsPerPage);
  }

  return this.http.get<RosterPlayers[]>(this.baseUrl + 'team/' + teamId + '/getRosterPlayers', { observe: 'response', params})
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

}
