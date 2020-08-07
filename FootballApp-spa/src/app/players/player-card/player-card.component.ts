import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/_models/user';
import { AuthService } from 'src/app/_services/auth.service';
import { MemberService } from 'src/app/_services/member.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-player-card',
  templateUrl: './player-card.component.html',
  styleUrls: ['./player-card.component.css']
})
export class PlayerCardComponent implements OnInit {
  @Input() user: User;
  isNew = false;
  constructor(private authService: AuthService,
              private memberService: MemberService,
              private alertify: AlertifyService
    ) { }

  ngOnInit() {
    // conver user created date in utc and add 4 days
    const userCreatedDate = new Date(this.user.created);
    userCreatedDate.setDate(userCreatedDate.getDate() + 4);

    // today's date
    const today = new Date();

    if (today < userCreatedDate) {
      this.isNew = true;
    }
  }

    // like functionality
    sendLike(id: number) {
      this.memberService.sendLike(this.authService.decodedToken.nameid, id).subscribe(
        data => {
          this.alertify.success('You have liked ' + this.user.knownAs);
        }, error => {
          this.alertify.error(error);
        }
      );
    }

}
