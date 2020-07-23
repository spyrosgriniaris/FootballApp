import { Directive, Input, ViewContainerRef, TemplateRef, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Subscription } from 'rxjs';
import { NavComponent } from '../nav/nav.component';
import { AppComponent } from '../app.component';

@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective implements OnInit{
  @Input() appHasRole: string[];
  isVisible = false;
  tokenChangedSubscriptionForLogin: Subscription; // subscription of subject tokenChanged of auth service
  tokenChangedSubscriptionForLogOut: Subscription;
  tokenChangedSubscriptionForRefresh: Subscription;
  token = localStorage.getItem('token');

  constructor(private viewContainerRef: ViewContainerRef,
              private templateRef: TemplateRef<any>,
              private authService: AuthService,
              private nav: NavComponent,
              private app: AppComponent) { }
  // ngOnDestroy(): void {
  //   this.tokenChangedSubscription.unsubscribe();
  // }

  ngOnInit() {
    this.tokenChangedSubscriptionForLogin = this.authService.tokenChangedForLogin.subscribe(
      (token: string) => {
        this.token = token;
        if (this.token != null) {
          const userRoles = this.authService.decodedToken.role as Array<string>;
          // if no roles, clear the viewContainerRef
          if (!userRoles) {
            this.viewContainerRef.clear();
          }
          // if user has role need then render the element
          if (this.authService.roleMatch(this.appHasRole)) {
            if (!this.isVisible) {
              this.isVisible = true;
              this.viewContainerRef.createEmbeddedView(this.templateRef);
            }
            else {
              this.isVisible = false;
              this.viewContainerRef.clear();
            }
          }
        }
        else {
          this.isVisible = false;
          this.viewContainerRef.clear();
        }
      }
    );
    this.tokenChangedSubscriptionForLogOut = this.nav.tokenChangedForLogout.subscribe(
      (token: string) => {
        this.isVisible = false;
        this.viewContainerRef.clear();
      }
    );

    this.tokenChangedSubscriptionForRefresh = this.app.tokenChangedForRefresh.subscribe(
      (token: string) => {
        this.token = token;
        if (this.token != null) {
          const userRoles = this.authService.decodedToken.role as Array<string>;
          // if no roles, clear the viewContainerRef
          if (!userRoles) {
            this.viewContainerRef.clear();
          }
          // if user has role need then render the element
          if (this.authService.roleMatch(this.appHasRole)) {
            if (!this.isVisible) {
              this.isVisible = true;
              this.viewContainerRef.createEmbeddedView(this.templateRef);
            }
          }
        }
      }
    );
  }


}
