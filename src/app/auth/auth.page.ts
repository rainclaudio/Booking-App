import { Component, OnInit } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLoading = false;
  isLogin = true;
  constructor(private authService: AuthService,
     private router: Router,
     private loadingController: LoadingController) { }

  ngOnInit() {
  }
  onLoginFunction(){

    this.isLoading = true;
    this.authService.login();

    this.loadingController.create({
        keyboardClose: true,
        message: 'Logging in...'}).then( loadingEl => {
              loadingEl.present();
              setTimeout(() => {
                this.isLoading = false;
                loadingEl.dismiss();
                this.router.navigateByUrl('/places/tabs/discover');

              },1500);
            })


  }
  onSwitchAuthMode(){
    console.log("switched");
    this.isLogin = !this.isLogin;
  }
  onSubmit(form: NgForm){
    console.log("OnsubmitFunctiono");
    if(!form.valid){
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    console.table(email,password);
    if(this.isLogin){
    // send a reques to lgoin  server
    }else {
      // send a reques to signup server
    }
  }

}
