import { Directive, OnInit } from '@angular/core';

@Directive({
  selector: '[appIsLoggedIn]'
})
export class IsLoggedInDirective implements OnInit{
  token = localStorage.getItem('token');

  constructor() { }
  
  ngOnInit() {
    if (this.token) {
      return true;
    }
    else {
      return false;
    }
  }
}
