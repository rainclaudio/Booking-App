import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { Subscription } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { BookingService } from 'src/app/bookings/booking.service';
import { MapModalComponent } from 'src/app/shared/map-modal/map-modal.component';
import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';
import { PlaceNode } from '../../placeNode';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  currentPlace: PlaceNode;
  private placeSub: Subscription;
  id_place: string;
  isLoading = false;
  isbookable = false;
  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private placesService: PlacesService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private bookingService: BookingService,
    private LoadingController: LoadingController,
    private authService: AuthService,
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('places/tabs/discover');
        return;
      }
      this.isLoading = true;
      // CONCLUSIÓN: este viene de places routing module
      this.id_place = paramMap.get('placeId');
      let fetchedUserId: string;
      this.authService.userId.pipe(
        take(1),
        switchMap((userId) => {
          if (!userId) {
            throw new Error('Found no user!');
          }
          fetchedUserId = userId;
          return this.placesService.get_place(this.id_place);
        })
      ).subscribe(
        (place) => {
          this.currentPlace = place;
          this.isbookable = place.userId !== fetchedUserId;
          this.isLoading = false;
        },
        (error) => {
          this.alertController
            .create({
              header: 'An error ocurred',
              message: 'Could not load place',
              buttons: [
                {
                  text: 'Okay',
                  handler: () => {
                    this.router.navigate(['/places/tabs/discover']);
                  },
                },
              ],
            })
            .then((alertEl) => alertEl.present());
        }
      );
      // this.currentPlace = this.placesService.get_place(this.id_place);
    });
  }
  onBookPlaceFunction() {
    // this.route.navigateByUrl('/places/tabs/discover');
    // this.navCtrl.navigateBack('/places/tabs/discover');
    this.actionSheetCtrl
      .create({
        header: 'Choose an Action',
        buttons: [
          {
            text: 'Select Date',
            handler: () => {
              this.openBookingModal('select');
            },
          },
          {
            text: 'Random Date',
            handler: () => {
              this.openBookingModal('random');
            },
          },
          {
            text: 'Cancel',
            role: 'cancel',
          },
        ],
      })
      .then((actionSheetEl) => {
        actionSheetEl.present();
      });
  }

  openBookingModal(mode: 'select' | 'random') {
    console.log(mode);
    this.modalCtrl
      .create({
        component: CreateBookingComponent,
        componentProps: {
          selectedPlace: this.currentPlace,
          selectedMode: mode,
        },
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then((resultData) => {
        if (resultData.role === 'confirm') {
          this.LoadingController.create({ message: 'Booking place....' }).then(
            (loadingEl) => {
              loadingEl.present();
              const data = resultData.data.bookingData;

              this.bookingService
                .addBooking(
                  this.currentPlace.id_place,
                  this.currentPlace.title_place,
                  this.currentPlace.imageUrl,
                  data.firstName,
                  data.lastName,
                  data.guestNumber,
                  data.startDate,
                  data.endDate
                )
                .subscribe(() => {
                  loadingEl.dismiss();
                  // this removes the loading indicator
                });
            }
          );
        }
      });
  }
  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }

  onShowFullMap() {
    this.modalCtrl
      .create({
        component: MapModalComponent,
        componentProps: {
          center: {
            lat: this.currentPlace.location.lat,
            lng: this.currentPlace.location.lng,
          },
          selectable: false,
          closeButtonText: 'Close',
          title: this.currentPlace.location.address,
        },
      })
      .then((modalEl) => {
        modalEl.present();
      });
  }
  // hay stock de tepa de II
  // llevar bolsa para mugre
}
