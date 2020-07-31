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

export const appRoutes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'home', component: HomeComponent},
    {
        // an sto path eixa /dummy tote to route tha itan px /dummymembers
        // twra einai sketo /members
        path: '',
        runGuardsAndResolvers: 'always',
        children: [
            {path: 'players', component: PlayersListComponent, resolve: {users: PlayerListResolver}},
            {path: 'players/:id', component: PlayerDetailComponent, resolve: {user: PlayerDetailResolver}},
            {path: 'member/edit', component: PlayerEditComponent, resolve: {user: PlayerEditResolver},
             canDeactivate: [PreventUnsavedChanges]},
            {path: 'rank', component: RankComponent},
            {path: 'messages', component: MessagesComponent, canActivate: [AuthGuard]},
            {path: 'likes', component: LikesComponent, resolve: {users: LikesResolver}, canActivate: [AuthGuard]},
            {path: 'admin', component: AdminPanelComponent, canActivate: [AuthGuard], data: {roles: ['Admin']}},
        ]
    },
    {path: '**', redirectTo: 'home', pathMatch: 'full'},
];
