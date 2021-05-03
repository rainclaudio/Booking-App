import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Booking } from './booking.model';
import { BookingService } from './booking.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {
  loadedBookingsVectorCopy: Booking[];
  private bookingSub: Subscription;
  constructor(
    private bookingService: BookingService,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.bookingSub = this.bookingService.getbookings.subscribe((bookins) => {
      this.loadedBookingsVectorCopy = bookins;
    });
  }
  onCancelFunction(bookingId: string, slidingEl: IonItemSliding) {
    this.loadingController.create({message: 'Canceling Booking....'})
    .then(LoadingEl => {


      LoadingEl.present();
      this.bookingService.cancelBooking(bookingId).subscribe( () => {
        LoadingEl.dismiss();
      });


    })
  }
  ngOnDestroy() {
    if (this.bookingSub) {
      this.bookingSub.unsubscribe();
    }
  }
}
