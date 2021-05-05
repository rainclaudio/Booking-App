import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private  userIsAuthenticated = true;
  private _userId = 'abc';
  constructor() { }
  get getuserIsAuthenticated(){
    return this.userIsAuthenticated;
  }
  login(){
    this.userIsAuthenticated = true;
  }
  logout(){
    this.userIsAuthenticated = false;
  }
  get userId(){
    return this._userId;
  }
  onLoginFunction(){

  }
}
