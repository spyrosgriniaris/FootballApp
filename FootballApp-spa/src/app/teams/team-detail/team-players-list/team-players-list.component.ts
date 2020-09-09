import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Pagination, PaginatedResult } from 'src/app/_models/pagination';
import { TeamService } from 'src/app/_services/team.service';
import { RosterPlayers } from 'src/app/_models/rosterPlayers';

@Component({
  selector: 'app-team-players-list',
  templateUrl: './team-players-list.component.html',
  styleUrls: ['./team-players-list.component.css']
})
export class TeamPlayersListComponent implements OnInit {

  @Input() rosterPlayersInit: RosterPlayers[];
  @Input() pagination: Pagination;
  rosterPlayers: RosterPlayers[];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private teamService: TeamService) { }

  ngOnInit() {
  }

  onNewRosterPlayer() {
    // i want to use relative route, so i inject the existing one
    this.router.navigate(['rosterPlayers/new'], {relativeTo: this.route});
  }

  pageChanged(event: any): void{
    this.pagination.currentPage = event.page;
    this.loadRosterPlayers();
  }

  loadRosterPlayers() {
    // console.log(this.userParams.searchWord);
    this.teamService.getUsers(this.pagination.currentPage, this.pagination.itemsPerPage).subscribe(
      (res: PaginatedResult<RosterPlayers[]>) => {
        this.rosterPlayers = res.result;
        this.pagination = res.pagination;
      }, error => {
        console.log(error);
      }
    );
  }

}
