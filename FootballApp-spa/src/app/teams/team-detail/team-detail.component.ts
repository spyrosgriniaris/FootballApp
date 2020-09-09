import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/_models/user';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { MemberService } from 'src/app/_services/member.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from '@kolkov/ngx-gallery';
import { RosterPlayers } from 'src/app/_models/rosterPlayers';
import { PaginatedResult, Pagination } from 'src/app/_models/pagination';
import { TeamService } from 'src/app/_services/team.service';

@Component({
  selector: 'app-team-detail',
  templateUrl: './team-detail.component.html',
  styleUrls: ['./team-detail.component.css']
})
export class TeamDetailComponent implements OnInit {
  @ViewChild('memberTabs', {static: true}) memberTabs: TabsetComponent;
  user: User;
  rosterPlayers: RosterPlayers[];
  rosterPlayersPagination: Pagination;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  
  constructor(private memberService: MemberService,
              private alertify: AlertifyService,
              private route: ActivatedRoute,
              private teamService: TeamService) {
                route.params.subscribe(
                  params => {
                    teamService.idOfSelectedTeam.next(params['id'] || undefined);
                  }
                );
               }

  ngOnInit() {
    this.route.data.subscribe(data => {
      // tslint:disable-next-line: no-string-literal
      this.user =  data['team'];
      this.rosterPlayers = data['rosterPlayers'].result;
      this.rosterPlayersPagination = data['rosterPlayers'].pagination;

      // messages area to navigate to messages tab
      this.route.queryParams.subscribe(
      params => {
        // tslint:disable-next-line: no-string-literal
        const selectedTab = params['tab'];
        this.memberTabs.tabs[selectedTab > 0 ? selectedTab : 0].active = true;
      });
    });


    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      }
    ];
    this.galleryImages = this.getImages();
    }

    getImages(){
      const imageUrls = [];
      for (const photo of this.user.photos) {
        imageUrls.push({
          small: photo.url,
          medium: photo.url,
          big: photo.url,
          description: photo.description
        });
      }
      return imageUrls;
    }

    selectTab(tabId: number){
      this.memberTabs.tabs[tabId].active = true;
    }

}
