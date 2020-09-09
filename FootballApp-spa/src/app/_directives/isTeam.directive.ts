import { Directive, ViewContainerRef, TemplateRef, OnInit } from '@angular/core';
import { User } from '../_models/user';

@Directive({
  selector: '[appIsTeam]'
})
export class IsTeamDirective implements OnInit{

  user: User = JSON.parse(localStorage.getItem('user'));

  constructor(private viewContainerRef: ViewContainerRef,
              private templateRef: TemplateRef<any>) { }
  ngOnInit() {
    if (this.user.role === 'Team') {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
    else {
      this.viewContainerRef.clear();
    }
  }
}
