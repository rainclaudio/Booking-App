import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take, tap,delay } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import { Booking } from './booking.model';
@Injectable({ providedIn: 'root' })
export class BookingService {
  private _bookingsVector = new BehaviorSubject<Booking[]>([]);
  constructor(private authService: AuthService) {}
  get getbookings() {
    return this._bookingsVector.asObservable();
  }
  addBooking(
    placeId: string,
    placeTitle: string,
    placeImage: string,
    firstname: string,
    lastname: string,
    guestnumber: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    const newBooking = new Booking(
      Math.random().toString(),
      placeId.toString(),
      this.authService.userId,
      placeTitle,
      placeImage,
      firstname,
      lastname,
      guestnumber,
      dateFrom,
      dateTo
    );
    return this._bookingsVector.pipe(
      take(1),
      delay(1000),
      tap((bookings) => {
        this._bookingsVector.next(bookings.concat(newBooking));
      })
    );
  }
  cancelBooking(bookingId: string) {
    return this._bookingsVector.pipe(
      take(1),
      delay(1000),
      tap((bookings) => {
        this._bookingsVector.next(bookings.filter(b => b.id !== bookingId));
      })
    );
  }
}
