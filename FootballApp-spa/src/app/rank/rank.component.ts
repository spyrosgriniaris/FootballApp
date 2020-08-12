import { Component, OnInit } from '@angular/core';
import { User } from '../_models/user';
import { Pagination, PaginatedResult } from '../_models/pagination';
import { MemberService } from '../_services/member.service';
import { AlertifyService } from '../_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-rank',
  templateUrl: './rank.component.html',
  styleUrls: ['./rank.component.css']
})
export class RankComponent implements OnInit {

  users: User[];
  pagination: Pagination;
  currentUserId: number;

  constructor(private membersService: MemberService,
              private alertify: AlertifyService,
              private route: ActivatedRoute,
              private authService: AuthService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.users = data['users'].result;
      this.pagination = data['users'].pagination;
      });
    this.currentUserId = this.authService.decodedToken.nameid;
  }

  pageChanged(event: any): void{
    this.pagination.currentPage = event.page;
    console.log(event.page);
    this.loadUsers();
  }

  loadUsers() {
    this.membersService.getRanking(this.pagination.currentPage, this.pagination.itemsPerPage). subscribe(
      (res: PaginatedResult<User[]>) => {
        this.users = res.result;
        this.pagination = res.pagination;
      }, error => {
        this.alertify.error(error);
      }
    );
  }

  sendLike(recipientId: number, recipientKnownAs: string) {
    this.membersService.sendLike(this.authService.decodedToken.nameid, recipientId).subscribe(
      data => {
        this.alertify.success('You have liked ' + recipientKnownAs);
      }, error => {
        this.alertify.error(error);
      }
    );
  }

}
