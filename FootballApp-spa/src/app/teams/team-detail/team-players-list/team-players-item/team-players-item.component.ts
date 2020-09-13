import { Component, OnInit, Input } from '@angular/core';
import { RosterPlayers } from 'src/app/_models/rosterPlayers';

@Component({
  selector: 'app-team-players-item',
  templateUrl: './team-players-item.component.html',
  styleUrls: ['./team-players-item.component.css']
})
export class TeamPlayersItemComponent implements OnInit {

  @Input() rosterPlayer: RosterPlayers;
  @Input() index: number;

  constructor() { }

  ngOnInit() {

  }

}
