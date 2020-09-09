import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { RosterPlayers } from 'src/app/_models/rosterPlayers';
import { TeamService } from 'src/app/_services/team.service';
import {  Subscription } from 'rxjs';

@Component({
  selector: 'app-team-player-detail',
  templateUrl: './team-player-detail.component.html',
  styleUrls: ['./team-player-detail.component.css']
})
export class TeamPlayerDetailComponent implements OnInit, OnDestroy {
  rosterPlayers: RosterPlayers[];
  idOfSelectedTeamSub: Subscription;
  teamId: number;
  playerId: number;
  playerToDisplay: RosterPlayers;

  constructor(private route: ActivatedRoute,
              private teamService: TeamService) { }


  ngOnDestroy(): void {
    this.idOfSelectedTeamSub.unsubscribe();
  }

  ngOnInit() {

    // take id of player selected from route parameters
    this.route.params.subscribe(
      (params: Params) => {
        this.playerId = +params['playersId'];
        this.idOfSelectedTeamSub = this.teamService.idOfSelectedTeam.subscribe(
          data => {
            this.teamId = data;
          }
        );
        // get roster players of team displayed
        if (this.teamId !== undefined) {
          this.teamService.getUsers(this.teamId).subscribe(
            data => {
              this.rosterPlayers = data.result;
              this.playerToDisplay = this.rosterPlayers[this.playerId];
            }
          );
        }
      }
    );
  }
}
