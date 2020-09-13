import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { RosterPlayers } from 'src/app/_models/rosterPlayers';
import { TeamService } from 'src/app/_services/team.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-team-player-detail',
  templateUrl: './team-player-detail.component.html',
  styleUrls: ['./team-player-detail.component.css']
})
export class TeamPlayerDetailComponent implements OnInit, OnDestroy {
  rosterPlayers: RosterPlayers[];
  pageNumberSub: Subscription;
  teamId: number;
  playerId: number;
  page: number;
  playerToDisplay: RosterPlayers;

  constructor(private route: ActivatedRoute,
              private teamService: TeamService,
              private authService: AuthService) { }


  ngOnDestroy(): void {
    // this.idOfSelectedTeamSub.unsubscribe();
    this.pageNumberSub.unsubscribe();
  }

  ngOnInit() {
    this.pageNumberSub = this.teamService.pageChanged.subscribe(
      page => {
        this.page = page;
        if (this.playerId) {
          this.showPlayer();
        }
      }
    );

    // take id of player selected from route parameters
    this.route.params.subscribe(
      (params: Params) => {
        this.playerId = +params['playersId'];
        if (this.playerId) {
          this.showPlayer();
        }
      }
    );
  }

  showPlayer() {
    this.teamService.getRosterPlayer(this.playerId).subscribe(
      player => {
        this.playerToDisplay = player;
      }
    );
  }
}
