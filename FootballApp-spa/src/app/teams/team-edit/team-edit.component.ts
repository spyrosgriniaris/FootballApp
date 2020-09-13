import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/_models/user';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MemberService } from 'src/app/_services/member.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { SocialMediaModalComponent } from 'src/app/players/social-media-modal/social-media-modal.component';
import { RosterPlayers } from 'src/app/_models/rosterPlayers';
import { Pagination } from 'src/app/_models/pagination';
import { Subscription } from 'rxjs';
import { TeamService } from 'src/app/_services/team.service';

@Component({
  selector: 'app-team-edit',
  templateUrl: './team-edit.component.html',
  styleUrls: ['./team-edit.component.css']
})
export class TeamEditComponent implements OnInit {
  @ViewChild('editForm', {static: true}) editForm: NgForm;
  team: User;
  photoUrl: string;
  bsModalRef: BsModalRef;
  rosterPlayers: RosterPlayers[];
  rosterPlayersPagination: Pagination;
  newPlayer: Subscription;
  // prevents user from closing browser window without saving the changes in form
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }

  constructor(private memberService: MemberService,
              private alertify: AlertifyService,
              private route: ActivatedRoute,
              private authService: AuthService,
              private modalService: BsModalService,
              private teamService: TeamService) {
     }

  ngOnInit() {
    this.route.data.subscribe(data => {
      // tslint:disable-next-line: no-string-literal
      this.team = data['team'];
      this.rosterPlayers = data['rosterPlayers'].result;
      this.rosterPlayersPagination = data['rosterPlayers'].pagination;
      });
    this.photoUrl = this.team.photoUrl;
    this.authService.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);
  }

  updateTeam() {
    this.memberService.updateUser(this.authService.decodedToken.nameid, this.team).subscribe(next => {
      this.alertify.success('Profile updated successfully!');
      this.editForm.reset(this.team);
    }, error => {
      this.alertify.error(error);
    });
  }

  updateMainPhoto(photoUrl){
    this.team.photoUrl = photoUrl;
  }

  editSocialMedia(user: User) {
    const initialState = {
      user
    };
    this.bsModalRef = this.modalService.show(SocialMediaModalComponent, {initialState});
    this.bsModalRef.content.updateSocialMediaEmitter.subscribe(
      (socialMediaArray: string[]) => {
        this.team.facebookUrl = socialMediaArray[0];
        this.team.instagramUrl = socialMediaArray[1];
        this.team.twitterUrl = socialMediaArray[2];
        console.log('edw');
        this.memberService.updateUser(this.authService.decodedToken.nameid, this.team).subscribe(
          next => {
            this.alertify.success('Social Media Updated!');
          }, error => {
            this.alertify.error(error);
          }
        );
      }
    );
  }

}
