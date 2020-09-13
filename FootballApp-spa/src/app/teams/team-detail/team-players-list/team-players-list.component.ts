import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Pagination, PaginatedResult } from 'src/app/_models/pagination';
import { TeamService } from 'src/app/_services/team.service';
import { RosterPlayers } from 'src/app/_models/rosterPlayers';
import { User } from 'src/app/_models/user';
import { AuthService } from 'src/app/_services/auth.service';
import { Subscription } from 'rxjs';
import { TeamPlayersEditComponent } from '../team-players-edit/team-players-edit.component';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-team-players-list',
  templateUrl: './team-players-list.component.html',
  styleUrls: ['./team-players-list.component.css']
})
export class TeamPlayersListComponent implements OnInit {

  @Input() rosterPlayersInit: RosterPlayers[];
  @Input() pagination: Pagination;
  newPlayerSub: Subscription;
  rosterPlayers: RosterPlayers[];
  teamIdSub: Subscription;
  rosterPlayerDeletedSub: Subscription;
  teamId: number;
  user: User;
  token: string;
  isCurrentTeam: boolean;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private teamService: TeamService,
              private authService: AuthService,
              private alertify: AlertifyService) {
               }

  ngOnInit() {


    this.newPlayerSub = this.teamService.newItem.subscribe(
      player => {
        this.rosterPlayersInit.push(player);
        this.loadRosterPlayers();
        // console.log(this.rosterPlayersInit);
      }
    );

    this.route.params.subscribe(
      (params: Params) => {
        if (params['id']) {
          this.isCurrentTeam = false;
        }
        else {
          this.isCurrentTeam = true;
        }
      }
    );
    this.teamIdSub = this.teamService.idOfSelectedTeam.subscribe(
      id => {
        this.teamId = id;
      }
    );

    if (this.teamId === null || this.teamId === undefined) {
      this.teamId = +this.authService.decodedToken.nameid;
    }

    this.rosterPlayerDeletedSub = this.teamService.rosterPlayerDeleted.subscribe(
      id => {
        console.log(id + ' apo list');
        // this.router.navigate(['/teams/edit'], {relativeTo: this.route});
        this.teamService.deleteRosterPlayer(id).subscribe(
          () => {
            this.alertify.success('Player deleted!');
          }, error => {
            this.alertify.error('Something went wrong');
          }
        );
        this.rosterPlayersInit.splice(this.rosterPlayersInit.findIndex(r => r.id === id), 1);
        
      }
    );
  }

  onNewRosterPlayer() {
    // i want to use relative route, so i inject the existing one
    this.router.navigate(['rosterPlayers/new'], {relativeTo: this.route});
  }

  pageChanged(event: any): void{
    this.pagination.currentPage = event.page;
    this.teamService.pageChanged.next(event.page);
    this.loadRosterPlayers();
  }

  loadRosterPlayers() {
    console.log(this.pagination.currentPage);
    this.teamService.getUsers(this.teamId, this.pagination.currentPage, this.pagination.itemsPerPage).subscribe(
      (res: PaginatedResult<RosterPlayers[]>) => {
        this.rosterPlayersInit = res.result;
        this.pagination = res.pagination;
      }, error => {
        console.log(error);
      }
    );
  }

}
