import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-social-media-modal',
  templateUrl: './social-media-modal.component.html',
  styleUrls: ['./social-media-modal.component.css']
})
export class SocialMediaModalComponent implements OnInit {

  @Output() updateSocialMediaEmitter = new EventEmitter();
  user: User;
  facebookUrl = '';
  twitterUrl = '';
  instagramUrl = '';
  socialMedia: string[] = [];

  constructor(public bsModalRef: BsModalRef) {}
  ngOnInit() {
    this.facebookUrl = this.user.facebookUrl;
    this.instagramUrl = this.user.instagramUrl;
    this.twitterUrl = this.user.twitterUrl;
    console.log(this.user.facebookUrl);
  }

  updateSocialMedia() {
    this.socialMedia.push(this.facebookUrl);
    this.socialMedia.push(this.instagramUrl);
    this.socialMedia.push(this.twitterUrl);
    this.updateSocialMediaEmitter.emit(this.socialMedia);
    this.bsModalRef.hide();
  }
}
