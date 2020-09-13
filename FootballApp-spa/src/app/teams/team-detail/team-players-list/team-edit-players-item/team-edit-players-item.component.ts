import { Component, OnInit, Input } from '@angular/core';
import { RosterPlayers } from 'src/app/_models/rosterPlayers';
import { TeamService } from 'src/app/_services/team.service';

@Component({
  selector: 'app-team-edit-players-item',
  templateUrl: './team-edit-players-item.component.html',
  styleUrls: ['./team-edit-players-item.component.css']
})
export class TeamEditPlayersItemComponent implements OnInit {

  @Input() rosterPlayer: RosterPlayers;
  @Input() index: number;
  player: RosterPlayers;

  constructor(private teamService: TeamService) { }

  ngOnInit() {
  }

  deleteRosterPlayer() {
    console.log('delete ' + this.rosterPlayer.id);
    this.teamService.rosterPlayerDeleted.next(this.rosterPlayer.id);
  }

}
