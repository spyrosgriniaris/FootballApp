import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MessagesComponent } from './messages/messages.component';
import { LikesComponent } from './likes/likes.component';
import { RankComponent } from './rank/rank.component';
import { AuthGuard } from './_guards/auth.guard';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { PlayersListComponent } from './players/players-list/players-list.component';
import { PlayerListResolver } from './_resolvers/player-list.resolver';
import { PlayerDetailComponent } from './players/player-detail/player-detail.component';
import { PlayerDetailResolver } from './_resolvers/player-detail.resolver';
import { PlayerEditComponent } from './players/player-edit/player-edit.component';
import { PlayerEditResolver } from './_resolvers/player-edit.resolver';
import { PreventUnsavedChanges } from './_guards/prevent-unsaved-changes.guard';
import { LikesResolver } from './_resolvers/likes.resolver';
import { RankResolver } from './_resolvers/rank.resolver';
import { TeamDetailComponent } from './teams/team-detail/team-detail.component';
import { TeamsStartComponent } from './teams/team-detail/teams-start/teams-start.component';
import { TeamPlayersEditComponent } from './teams/team-detail/team-players-edit/team-players-edit.component';
import { TeamPlayerDetailComponent } from './teams/team-detail/team-player-detail/team-player-detail.component';
import { TeamRosterPlayersListResolver } from './_resolvers/team-rosterPlayers-list.resolver';
import { TeamEditComponent } from './teams/team-edit/team-edit.component';
import { TeamEditResolver } from './_resolvers/team-edit.resolver';
import { TeamEditRosterPlayersListResolver } from './_resolvers/team-edit-rosterPlayers-list.resolver';
import { TeamDetailResolver } from './_resolvers/team-detail.resolver';

export const appRoutes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'home', component: HomeComponent},
    {
        // an sto path eixa /dummy tote to route tha itan px /dummymembers
        // twra einai sketo /members
        path: '',
        runGuardsAndResolvers: 'always',
        children: [
            {path: 'players', component: PlayersListComponent, canActivate: [AuthGuard], resolve: {users: PlayerListResolver}},
            {path: 'players/:id', component: PlayerDetailComponent, resolve: {user: PlayerDetailResolver}},
            {path: 'teams/edit', component: TeamEditComponent, canDeactivate: [PreventUnsavedChanges], resolve: {team: TeamEditResolver,
                 rosterPlayers: TeamEditRosterPlayersListResolver},
                children: [
                    {path: '', component: TeamsStartComponent},
                    { path: 'rosterPlayers', component: TeamsStartComponent },
                    { path: 'rosterPlayers/new', component: TeamPlayersEditComponent },
                    {path: 'rosterPlayers/:playersId', component: TeamPlayerDetailComponent}
                ] },
            {path: 'teams/:id', component: TeamDetailComponent, resolve: {team: TeamDetailResolver,
                 rosterPlayers: TeamRosterPlayersListResolver},
                children: [
                    { path: '', component: TeamsStartComponent },
                    // { path: 'rosterPlayers/new', component: TeamPlayersEditComponent },
                    { path: 'rosterPlayers/:playersId', component: TeamPlayerDetailComponent },
                    // { path: 'rosterPlayers/:playersId/edit', component: TeamPlayersEditComponent }
                ]},
            {path: 'member/edit', component: PlayerEditComponent, resolve: {user: PlayerEditResolver},
             canDeactivate: [PreventUnsavedChanges]},
            {path: 'rank', component: RankComponent, canActivate: [AuthGuard], resolve: {users: RankResolver}},
            {path: 'messages', component: MessagesComponent, canActivate: [AuthGuard]},
            {path: 'likes', component: LikesComponent, resolve: {users: LikesResolver}, canActivate: [AuthGuard]},
            {path: 'admin', component: AdminPanelComponent, canActivate: [AuthGuard], data: {roles: ['Admin']}},
        ]
    },
    {path: '**', redirectTo: 'home', pathMatch: 'full'},
];
