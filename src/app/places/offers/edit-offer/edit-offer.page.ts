import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertController,
  LoadingController,
  NavController,
} from '@ionic/angular';
import { Subscription } from 'rxjs';
import { PlaceNode } from '../../placeNode';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {
  currentPlace: PlaceNode;
  private placeSub: Subscription;
  form: FormGroup;
  isLoading = false;
  id_place: string;
  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private placesService: PlacesService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('edit-offerId')) {
        this.navCtrl.navigateBack('places/tabs/offers');
        return;
      }
      this.id_place = paramMap.get('edit-offerId');

      this.isLoading = true;
      // CONCLUSIÓN: este viene de places routing module

      this.placeSub = this.placesService.get_place(this.id_place).subscribe(
        (place) => {
          this.currentPlace = place;

          this.form = new FormGroup({
            title: new FormControl(this.currentPlace.title_place, {
              updateOn: 'blur',
              validators: [Validators.required],
            }),
            description: new FormControl(this.currentPlace.description_place, {
              updateOn: 'blur',
              validators: [Validators.required, Validators.maxLength(180)],
            }),
          });
          this.isLoading = false;
        },
        (error) => {
          this.alertController.create({
            header: 'An error occurred!',
            message: 'Place could not be fetched. Please try again later..',
            buttons: [
              {
                text: 'Okay',
                handler: () => {
                  this.router.navigate(['/places/tabs/offers']);
                },
              },
            ],
          }).then(
              alertEl => {
                alertEl.present();
              }
          );
        }
      );
    });
  }
  onUpdateOffer() {
    if (!this.form.valid) {
      return;
    }
    this.loadingCtrl
      .create({
        message: 'updating place...',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.placesService
          .updatePlace(
            this.currentPlace.id_place,
            this.form.value.title,
            this.form.value.description
          )
          .subscribe(() => {
            loadingEl.dismiss();
            this.form.reset();
            this.router.navigate(['/places/tabs/offers']);
          });
      });
  }
  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }
}
