import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/_models/user';
import { MemberService } from 'src/app/_services/member.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PositionsModalComponent } from '../positions-modal/positions-modal.component';

@Component({
  selector: 'app-player-edit',
  templateUrl: './player-edit.component.html',
  styleUrls: ['./player-edit.component.css']
})
export class PlayerEditComponent implements OnInit {
  @ViewChild('editForm', {static: true}) editForm: NgForm;
  user: User;
  photoUrl: string;
  bsModalRef: BsModalRef;
  userPositions: string[] = [];
  positionsToDisplay: string[] = [];

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
              private modalService: BsModalService) {
               }

  ngOnInit() {
    this.route.data.subscribe(data => {
    // tslint:disable-next-line: no-string-literal
    this.user = data['user'];
    });
    this.photoUrl = this.user.photoUrl;
    this.authService.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);
    this.userPositions = this.getPositionsArray(this.user);
    // console.log(this.userPositions);
  }

  updateUser() {
    this.memberService.updateUser(this.authService.decodedToken.nameid, this.user).subscribe(next => {
      this.alertify.success('Profile updated successfully!');
      this.editForm.reset(this.user);
    }, error => {
      this.alertify.error(error);
    });
  }

  updateMainPhoto(photoUrl){
    this.user.photoUrl = photoUrl;
  }

  editPositionModal(user: User) {
    this.positionsToDisplay = [];
    const initialState = {
      user,
      positions: this.getPositionsArray(user)
    };
    this.bsModalRef = this.modalService.show(PositionsModalComponent, {initialState});
    this.bsModalRef.content.updateSelectedPositions.subscribe(
      (values) => {
        const positionsToUpdate = {
          positionNames: [...values.filter(el => el.checked === true).map(el => el.name)]
        };
        this.userPositions = positionsToUpdate['positionNames'];
        if (positionsToUpdate) {
          this.memberService.updateUserPositions(user, positionsToUpdate).subscribe(
            () => {
              user.positions = [...positionsToUpdate.positionNames];
              this.positionsToDisplay = user.positions;
            }, error => {
              console.log(error);
            }
          );
        }
      }
    );
  }

  private getPositionsArray(user: User) {
    const positions = [];
    user.positions.forEach(posObj => {
      this.userPositions.push(posObj['position']);
    });
    const availablePositions: any[] = [
      {name: 'Defender', value: 'Defender'},
      {name: 'Midfielder', value: 'Midfielder'},
      {name: 'Striker', value: 'Striker'},
      {name: 'Goalkeeper', value: 'Goalkeeper'}
    ];

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < availablePositions.length; i++) {
      let isMatch = false;
      // tslint:disable-next-line: prefer-for-of
      for (let j = 0; j < this.userPositions.length; j++) {
        if (availablePositions[i].name === this.userPositions[j]) {
          isMatch = true;
          availablePositions[i].checked = true;
          positions.push(availablePositions[i]);
          this.positionsToDisplay.push(availablePositions[i].name);
          break;
        }
      }
      if (!isMatch) {
        availablePositions[i].checked = false;
        positions.push(availablePositions[i]);
      }
    }
    return positions;
  }

}
