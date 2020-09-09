import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorInterceptorProvider } from './_services/error.interceptor';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TimeagoModule } from 'ngx-timeago';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { JwtModule } from '@auth0/angular-jwt';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { FileUploadModule } from 'ng2-file-upload';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatFormFieldModule} from '@angular/material/form-field';
import { CookieLawModule } from 'angular2-cookie-law';

import { AppComponent } from './app.component';
import { ValueComponent } from './value/value.component';
import { NavComponent } from './nav/nav.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { LikesComponent } from './likes/likes.component';
import { MessagesComponent } from './messages/messages.component';
import { RankComponent } from './rank/rank.component';
import { RouterModule } from '@angular/router';
import { appRoutes } from './routes';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { HasRoleDirective } from './_directives/hasRole.directive';
import { UserManagementComponent } from './admin/user-management/user-management.component';
import { PhotoManagementComponent } from './admin/photo-management/photo-management.component';
import { RolesModalComponent } from './admin/roles-modal/roles-modal.component';
import { PlayersListComponent } from './players/players-list/players-list.component';
import { PlayerCardComponent } from './players/player-card/player-card.component';
import { PlayerDetailComponent } from './players/player-detail/player-detail.component';
import { PlayerEditComponent } from './players/player-edit/player-edit.component';
import { PhotoEditorComponent } from './players/photo-editor/photo-editor.component';
import { PositionsModalComponent } from './players/positions-modal/positions-modal.component';
import { IsLoggedInDirective } from './_directives/isLoggedIn.directive';
import { SocialMediaModalComponent } from './players/social-media-modal/social-media-modal.component';
import { TeamDetailComponent } from './teams/team-detail/team-detail.component';
import { TeamPlayerDetailComponent } from './teams/team-detail/team-player-detail/team-player-detail.component';
import { TeamsStartComponent } from './teams/team-detail/teams-start/teams-start.component';
import { TeamPlayersListComponent } from './teams/team-detail/team-players-list/team-players-list.component';
import { TeamPlayersItemComponent } from './teams/team-detail/team-players-list/team-players-item/team-players-item.component';
import { TeamPlayersEditComponent } from './teams/team-detail/team-players-edit/team-players-edit.component';
import { TeamEditComponent } from './teams/team-edit/team-edit.component';
import { IsTeamDirective } from './_directives/isTeam.directive';
import { IsPlayerDirective } from './_directives/isPlayer.directive';



export function tokenGetter() {
   return localStorage.getItem('token'); // vazw kai sta imports to jwt
}

@NgModule({
   declarations: [
      AppComponent,
      ValueComponent,
      NavComponent,
      HomeComponent,
      RegisterComponent,
      PlayersListComponent,
      PlayerCardComponent,
      LikesComponent,
      MessagesComponent,
      RankComponent,
      AdminPanelComponent,
      HasRoleDirective,
      IsLoggedInDirective,
      UserManagementComponent,
      PhotoManagementComponent,
      RolesModalComponent,
      PlayerDetailComponent,
      PlayerEditComponent,
      PhotoEditorComponent,
      LikesComponent,
      PositionsModalComponent,
      SocialMediaModalComponent,
      TeamDetailComponent,
      TeamPlayerDetailComponent,
      TeamsStartComponent,
      TeamPlayersListComponent,
      TeamPlayersItemComponent,
      TeamPlayersEditComponent,
      TeamEditComponent,
      IsTeamDirective,
      IsPlayerDirective
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule,
      BrowserAnimationsModule,
      ButtonsModule,
      BsDatepickerModule.forRoot(),
      TimeagoModule.forRoot(),
      BsDropdownModule.forRoot(),
      CollapseModule.forRoot(),
      RouterModule.forRoot(appRoutes),
      TabsModule.forRoot(),
      ModalModule.forRoot(),
      PaginationModule.forRoot(),
      TypeaheadModule.forRoot(),
      NgxGalleryModule,
      MatAutocompleteModule,
      MatFormFieldModule,
      FileUploadModule,
      CookieLawModule,
      JwtModule.forRoot({
         config: {
            tokenGetter: tokenGetter,
            allowedDomains: ["localhost:5000"],
            disallowedRoutes: ["localhost:5000/api/values"]
         },
      }),
   ],
   providers: [
      ErrorInterceptorProvider
   ],
   entryComponents: [
      RolesModalComponent
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
