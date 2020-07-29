import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { MemberService } from 'src/app/_services/member.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { Photo } from 'src/app/_models/photo';
import { environment } from 'src/environments/environment';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {

  @Input() photos: Photo[];
  @Output() getMemberPhotoChange = new EventEmitter<string>();
  // we use output to inform parent component about the change
  // outputs need eventemitters
  // we emit this change in setMainPhoto function
  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  response: string;
  baseUrl = environment.apiUrl;

  // variable of instant refresh of main photo
  currentMain: Photo;

  constructor(private authService: AuthService,
              private memberService: MemberService,
              private alertify: AlertifyService) { }

  ngOnInit() {
    this.initializeUploader();
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader() {
    // o uloader xreiazetai token gia na exei prosvasi sto api mas.
    // entos tis efarmogis to kanei o authguard gia ta links
    this.uploader = new FileUploader({
      url: this.baseUrl + 'members/' + this.authService.decodedToken.nameid + '/photos',
      authToken: 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024 // 10MB
    });

    this.uploader.onAfterAddingFile = (file) => {file.withCredentials = false; };
    this.uploader.onErrorItem = (item, response, status, headers) => {
      console.log('error  ', JSON.parse(response));
      console.log(localStorage.getItem('token'));
    };
    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const res: Photo = JSON.parse(response);
        console.log(res);
        const photo = {
          id: res.id,
          url: res.url,
          dateAdded: res.dateAdded,
          description: res.description,
          isMain: res.isMain
        };
        this.photos.push(photo);
        // ananewsi photo profil amesws molis anevei apo neo eggegrammeno xristi
        if (photo.isMain){
          this.authService.changeMemberPhoto(photo.url);
          this.authService.currentUser.photoUrl = photo.url;
          localStorage.setItem('user', JSON.stringify(this.authService.currentUser));
        }
      }
    };
  }

  setMainPhoto(photo: Photo) {
    this.memberService.setMainPhoto(this.authService.decodedToken.nameid, photo.id).subscribe(
      () => {
        console.log('Successfull update of main photo');
      // filter function returns a copy of the array and filters out what doesn't match the condition
      // in our case is an array of 1 element, because it's only 1 the main photo, so we are pointing in position 0
        this.currentMain = this.photos.filter(p => p.isMain === true)[0];
        this.currentMain.isMain = false;
        photo.isMain = true;
      // we then go to parent component template (html) to use the emitter (member-edit)
      // this.getMemberPhotoChange.emit(photo.url);
      // otan allazw ti photo enimerwnw kai to localstorage gia na isxuoun oi allges kai sto refresh
        this.authService.changeMemberPhoto(photo.url);
        this.authService.currentUser.photoUrl = photo.url;
        localStorage.setItem('user', JSON.stringify(this.authService.currentUser));
    // tslint:disable-next-line: no-shadowed-variable
    }, error => {
      console.log(error);
      this.alertify.error(error);
    });
  }

  deletePhoto(id: number){ // photo id
    this.alertify.confirm('Ae you sure you want to delete this photo?', () => {
      this.memberService.deletePhoto(this.authService.decodedToken.nameid, id).subscribe(() => {
        this.photos.splice(this.photos.findIndex(p => p.id === id), 1);
        this.alertify.success('Photo has been deleted');
      }, error => {
        this.alertify.error('Failed to delete the photo');
      });
    });
  }
}

