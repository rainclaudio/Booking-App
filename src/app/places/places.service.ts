import { HttpClient } from '@angular/common/http';
import { TokenizeResult } from '@angular/compiler/src/ml_parser/lexer';
import { Injectable, platformCore } from '@angular/core';
import { NumberValueAccessor } from '@angular/forms';
import { BehaviorSubject, of } from 'rxjs';
import { take, map, tap, delay, switchMap, reduce } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { PlaceLocation } from './location.model';
import { PlaceNode } from './placeNode';
/*
[
    new PlaceNode(
      1,
      'Manhattan Mansion',
      'In the heart of NY city',
      'https://i.insider.com/5ca28544c6cc502cd946a147?width=700',
      149.99,
      new Date('2019-01-01'),
      new Date('2019-12-31'),
      'abc'
    ),
    new PlaceNode(
      2,
      'Amout Tojours',
      'A romantic place in Paris',
      'https://i.pinimg.com/564x/6e/12/a3/6e12a3c9d28b00988370e1c646ad2d7a.jpg',
      200.99,

      new Date('2019-01-01'),
      new Date('2019-12-31'),
      'abc'
    ),

    new PlaceNode(
      3,
      'The foggy Palace',
      'Not your average city trip!',
      'https://i.pinimg.com/originals/9c/88/44/9c8844b217bdb6c17db14f51ad2e51a5.jpg',
      200.99,

      new Date('2019-01-01'),
      new Date('2019-12-31'),
      'abc'
    ),
    new PlaceNode(
      4,
      'Muelle de las Almas',
      'Magic Chiloe Place',
      'https://www.gochile.cl/fotos/header/108655-10592886_274406302748680_2031203982527292118_n.jpg',
      100.99,

      new Date('2019-01-01'),
      new Date('2019-12-31'),
      'abc'
    ),
    new PlaceNode(
      5,
      'Cambridge University',
      'Wonderful University',
      'https://www.legalcheek.com/wp-content/uploads/2020/05/cambridge.jpg',
      10.99,

      new Date('2019-01-01'),
      new Date('2019-12-31'),
      'abc'
    ),
  ]
*/

interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description_place: string;
  // id_place: number;
  imageUrl: string;
  price: number;
  title_place: string;
  userId: string;
  location: PlaceLocation;
}

@Injectable({
  providedIn: 'root',
})
/*
export class PlaceNode {
  constructor(
    public id_place: string,
    public title_place: string,
    public description_place: string,
    public imageUrl: string,
    public price: number
  ) {}
}
*/
/*
placeInput: PlaceNode[] = [
  new PlaceNode(
    1,
    'Manhattan Mansion',
    'In the heart of NY city',
    '',
    149.99
  )

];*/
export class PlacesService {
  private _placesVector = new BehaviorSubject<PlaceNode[]>([]);
  get places() {
    return this._placesVector.asObservable();
  }
  get_place(id: string) {
    return this.authservice.token.pipe(
        take(1),
        switchMap((token) => {
          return this.http.get<PlaceData>(
            `https://ionic-angular-course-d0193-default-rtdb.firebaseio.com/offered-places/${id}.json?auth=${token}`
          );
        }),
      map((placeData) => {
        return new PlaceNode(
          id,
          placeData.title_place,
          placeData.description_place,
          placeData.imageUrl,
          placeData.price,
          new Date(placeData.availableFrom),
          new Date(placeData.availableTo),
          placeData.userId,
          placeData.location
        );
      })
    );
  }
  fetchPlaces() {
    console.log('fetching places---');

    return this.authservice.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.get<{ [key: string]: PlaceData }>(
          `https://ionic-angular-course-d0193-default-rtdb.firebaseio.com/offered-places.json?auth=${token}`
        );
      }),
      map((resData) => {
        const placeNode = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            placeNode.push(
              new PlaceNode(
                key,
                resData[key].title_place,
                resData[key].description_place,
                resData[key].imageUrl,
                resData[key].price,
                new Date(resData[key].availableFrom),
                new Date(resData[key].availableTo),
                resData[key].userId,
                resData[key].location
              )
            );
          }
        }
        return placeNode;
      }),
      tap((places) => {
        this._placesVector.next(places);
      })
    );
  }
  uploadImage(image: File) {
    const uploadData = new FormData();
    uploadData.append('image', image);

    return this.authservice.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.post<{ imageUrl: string; imagePath: string }>(
          'https://us-central1-ionic-angular-course-d0193.cloudfunctions.net/storeImage',
          uploadData,
          { headers: { Authorization: 'Bearer ' + token } }
        );
      })
    );
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date,
    location: PlaceLocation,
    imageUrl: string
  ) {
    let generatedId: string;
    let newPlace: PlaceNode;
    let fetchedUserId: string;
    return this.authservice.userId.pipe(
      take(1),
      switchMap(userId => {
        fetchedUserId = userId;
        return this.authservice.token;
      }),
      take(1),
      switchMap(token => {
        if (!fetchedUserId) {
          throw new Error('No user found');
        }
        newPlace = new PlaceNode(
          Math.random().toString(),
          title,
          description,
          imageUrl,
          // 'https://i.pinimg.com/564x/6e/12/a3/6e12a3c9d28b00988370e1c646ad2d7a.jpg',
          price,
          dateFrom,
          dateTo,
          fetchedUserId,
          location
        );
        return this.http.post<{ name: string }>(
          `https://ionic-angular-course-d0193-default-rtdb.firebaseio.com/offered-places.json?auth=${token}`,
          {
            ...newPlace,
            id: null,
          }
        );
      }),
      switchMap((resData) => {
        generatedId = resData.name;
        return this.places;
      }),
      take(1),
      tap((places) => {
        newPlace.id_place = generatedId;
        this._placesVector.next(places.concat(newPlace));
      })
    );

    // return this._placesVector.pipe(
    //   take(1),
    //   delay(1000),
    //   tap((places) => {
    //     this._placesVector.next(places.concat(newPlace));
    //   })
    // );
    // console.table(this._placesVector);
  }
  updatePlace(placeId: string, title: string, description: string) {
    let updatedPlaces: PlaceNode[];
    let fecthedToken: string;
    return this.authservice.token.pipe(take(1),

    switchMap(token => {
      fecthedToken = token;
      return this.places;
    }),take(1),
      switchMap((places) => {
        if (!places || places.length <= 0) {
          return this.fetchPlaces();
        } else {
          return of(places);
        }
      }),
      switchMap((places) => {
        const updatedPlaceIndex = places.findIndex(
          (pl) => pl.id_place === placeId
        );
        updatedPlaces = [...places];
        const old = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new PlaceNode(
          old.id_place,
          title,
          description,
          old.imageUrl,
          old.price,
          old.availableFrom,
          old.availableTo,
          old.userId,
          old.location
        );
        return this.http.put(
          `https://ionic-angular-course-d0193-default-rtdb.firebaseio.com/offered-places/${placeId}.json?auth=${fecthedToken}`,
          { ...updatedPlaces[updatedPlaceIndex], id_place: null }
        );
      }),
      tap(() => {
        this._placesVector.next(updatedPlaces);
      })
    );
  }
  constructor(private authservice: AuthService, private http: HttpClient) {}
}
