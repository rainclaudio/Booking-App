import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import {Capacitor, Plugins} from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit,OnDestroy{
  private authSub: Subscription;
  private previousAuthState = false;

  constructor(
    private authService: AuthService,
    private platform: Platform,
    private router: Router) {
      this.initializeApp();
    }
  onLogOutFunction(){
    this.authService.logout();
  }
  initializeApp(){
    this.platform.ready().then( () => {
      if(Capacitor.isPluginAvailable('SplashScreen')){
        Plugins.SplashScreen.hide();
      }
    });
  }
  ngOnInit(){
   this.authSub =  this.authService.getuserIsAuthenticated.subscribe(isAuth => {
     if (!isAuth && this.previousAuthState !== isAuth){
      this.router.navigateByUrl('/auth');

     }
     this.previousAuthState = isAuth; 
    });
  }
  ngOnDestroy(){
    if(this.authSub){
      this.authSub.unsubscribe();
    }
  }
}
