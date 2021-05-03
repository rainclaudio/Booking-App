import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonItemSliding } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { PlaceNode } from '../placeNode';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit,OnDestroy {
  offerVectorPlacescopy: PlaceNode[];
  private placesSub: Subscription;
  isLoading = false;
  constructor(private pageService: PlacesService, private router: Router) { }

  ngOnInit() {
        // this.offerVectorPlacescopy = this.pageService.get_places();

    this.placesSub = this.pageService.places.subscribe(places => {
      this.offerVectorPlacescopy = places;
    });
  }

  ionViewWillEnter(){
    this.isLoading = true;
    this.pageService.fetchPlaces().subscribe(() =>{
      this.isLoading = false;
    });
  }

  onEditFunction(id_place: string, slidingItem: IonItemSliding){
    slidingItem.close();
    this.router.navigate(['/','places','tabs','offers','edit',id_place]);

  }
  ngOnDestroy(){
    if(this.placesSub){
      this.placesSub.unsubscribe();
    }
  }
}
