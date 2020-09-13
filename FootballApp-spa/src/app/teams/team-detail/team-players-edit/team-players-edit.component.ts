import { Component, OnInit, ViewChild, Injectable } from '@angular/core';
import { TeamService } from 'src/app/_services/team.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { User } from 'src/app/_models/user';
import { RosterPlayers } from 'src/app/_models/rosterPlayers';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-team-players-edit',
  templateUrl: './team-players-edit.component.html',
  styleUrls: ['./team-players-edit.component.css']
})
@Injectable({
  providedIn: 'root'
})
export class TeamPlayersEditComponent implements OnInit {
  @ViewChild('rosterForm', {static: true}) rosterForm: NgForm;
  team: User;
  teamId: number;
  rosterPlayer: any;
  // variables to create a roster player
  fullName: string;
  age: number;
  position: string;
  foot: string;
  newItem = new Subject<RosterPlayers>();

  constructor(private teamService: TeamService,
              private alertify: AlertifyService,
              private authService: AuthService) { }

  ngOnInit() {
    this.teamId = +this.authService.decodedToken.nameid;
  }

  addRosterPlayer() {
    if (this.rosterForm.valid) {
      this.rosterPlayer = Object.assign({}, this.rosterForm.value);
      this.rosterPlayer.teamId = this.teamId;
      console.log(this.rosterPlayer);
      this.teamService.addRosterPlayer(this.teamId, this.rosterPlayer).subscribe(
        next => {
          this.alertify.success('Player Added');
          this.rosterForm.reset();
          this.teamService.newItem.next(this.rosterPlayer);
        }, error => {
          this.alertify.error('Player could not be added');
        }
      );
    }
  }
}
