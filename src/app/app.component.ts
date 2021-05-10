import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import {Capacitor, Plugins} from '@capacitor/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private authService: AuthService,
    private platform: Platform,
    private router: Router) {
      this.initializeApp();
    }
  onLogOutFunction(){
    this.authService.logout();
    this.router.navigateByUrl('/auth');
    console.log("click");
  }
  initializeApp(){
    this.platform.ready().then( () => {
      if(Capacitor.isPluginAvailable('SplashScreen')){
        Plugins.SplashScreen.hide();
      }
    });
  }
}
