import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take, tap, delay, switchMap, map } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import { Booking } from './booking.model';

interface BookData {
  bookedFrom: string;
  bookedTo: string;
  firstname: string;
  guestNumber: number;
  lastname: string;
  placeId: string;
  placeImage: string;
  placeTitle: string;
  userId: string;
}

@Injectable({ providedIn: 'root' })
export class BookingService {
  private _bookingsVector = new BehaviorSubject<Booking[]>([]);
  constructor(private authService: AuthService, private http: HttpClient) {}
  get getbookings() {
    return this._bookingsVector.asObservable();
  }
  cancelBooking(bookingId: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.delete(
          `https://ionic-angular-course-d0193-default-rtdb.firebaseio.com/booked-places/${bookingId}.json?auth=${token}`
        );
      }),
      switchMap(() => {
        return this._bookingsVector;
      }),
      take(1),
      tap((bookings) => {
        this._bookingsVector.next(bookings.filter((b) => b.id !== bookingId));
      })
    );
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
    let generatedId: string;
    let newBooking: Booking;
    let fetchedUserId: string;
    return this.authService.userId.pipe(
      take(1),
      switchMap((userId) => {
        if (!userId) {
          throw new Error('No user id found!');
        }
        fetchedUserId = userId;

        return this.authService.token;
      }),
      take(1),
      switchMap((token) => {
        newBooking = new Booking(
          Math.random().toString(),
          placeId.toString(),
          fetchedUserId,
          placeTitle,
          placeImage,
          firstname,
          lastname,
          guestnumber,
          dateFrom,
          dateTo
        );
        return this.http.post<{ name: string }>(
          `https://ionic-angular-course-d0193-default-rtdb.firebaseio.com/booked-places.json?auth=${token}`,
          {
            ...newBooking,
            // this replaces the current id given from the function
            id: null,
          }
        );
      }),
      switchMap((resData) => {
        generatedId = resData.name;
        return this.getbookings;
      }),
      take(1),
      tap((places) => {
        newBooking.id = generatedId;
        this._bookingsVector.next(places.concat(newBooking));
      })
    );
    /*
    return this._bookingsVector.pipe(
      take(1),
      delay(1000),
      tap((bookings) => {
        this._bookingsVector.next(bookings.concat(newBooking));
      })
    );*/
  }

  fetchBookings() {
    let fetchedUserId: string;
    return this.authService.userId.pipe(
      take(1),
      switchMap((userId) => {
        if (!userId) {
          throw new Error('User not found');
        }
        fetchedUserId = userId;
        return this.authService.token;

      }),
      take(1),
      switchMap(token => {
        return this.http.get<{ [key: string]: BookData }>(
          `https://ionic-angular-course-d0193-default-rtdb.firebaseio.com/booked-places.json?orderBy="userId"&equalTo="${fetchedUserId}"&auth=${token}`
        );
      }),
      map((resData) => {
        const booking = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            booking.push(
              new Booking(
                key,
                resData[key].placeId,
                resData[key].userId,
                resData[key].placeTitle,
                resData[key].placeImage,
                resData[key].firstname,
                resData[key].lastname,
                resData[key].guestNumber,
                new Date(resData[key].bookedFrom),
                new Date(resData[key].bookedTo)
              )
            );
          }
        }
        return booking;
      }),
      tap((bookings3) => {
        this._bookingsVector.next(bookings3);
      })
    );
  }
}
