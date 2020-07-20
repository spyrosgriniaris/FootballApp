import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PlayersListComponent } from './players-list/players-list.component';
import { MessagesComponent } from './messages/messages.component';
import { LikesComponent } from './likes/likes.component';
import { RankComponent } from './rank/rank.component';
import { AuthGuard } from './_guards/auth.guard';

export const appRoutes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'home', component: HomeComponent},
    {
        // an sto path eixa /dummy tote to route tha itan px /dummymembers
        // twra einai sketo /members
        path: '',
        runGuardsAndResolvers: 'always',
        children: [
            {path: 'players', component: PlayersListComponent},
            {path: 'messages', component: MessagesComponent, canActivate: [AuthGuard]},
            {path: 'likes', component: LikesComponent, canActivate: [AuthGuard]},
            {path: 'rank', component: RankComponent}
        ]
    },
    {path: '**', redirectTo: 'home', pathMatch: 'full'},
];
