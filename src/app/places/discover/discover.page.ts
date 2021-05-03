import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { PlaceNode } from '../placeNode';
import { PlacesService } from '../places.service';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {
  placesVectorCopy: PlaceNode[];
  listedLoadedPlaces: PlaceNode[];
  private placesSub: Subscription;
  relevantPlaces: PlaceNode[];
  isloading = false;
  constructor(
    private placesService: PlacesService,
    private menuCtrl: MenuController,
    private authService: AuthService
  ) {}
  // menu controller get access to menus

  ngOnInit() {
    // console.log("hello?");
    this.placesSub = this.placesService.places.subscribe((places) => {
      this.placesVectorCopy = places;
      this.relevantPlaces = this.placesVectorCopy;
      this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    });
    // this.placesVectorCopy = this.placesService.get_places();
  }
  ionViewWillEnter(){
    this.isloading = true;
    this.placesService.fetchPlaces().subscribe( () => {
      this.isloading = false;
    });
  }
  onOpenMenu() {
    // if closed open else close
    // console.log("click");
    this.menuCtrl.toggle();
  }

  onFilterUpdate(event: any) {
    // StrictFunctionType TURNED OFF
    // g
    if (event.detail.value === 'all') {
      this.relevantPlaces = this.placesVectorCopy;
      this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    } else {
      this.relevantPlaces = this.listedLoadedPlaces.filter(place =>
        place.userId !== this.authService.userId);
        this.listedLoadedPlaces = this.relevantPlaces.slice(1);
      }
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }
}
