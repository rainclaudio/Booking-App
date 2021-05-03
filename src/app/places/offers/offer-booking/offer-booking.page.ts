import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { PlaceNode } from '../../placeNode';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-offer-booking',
  templateUrl: './offer-booking.page.html',
  styleUrls: ['./offer-booking.page.scss'],
})
export class OfferBookingPage implements OnInit,OnDestroy {
  currentPlace: PlaceNode;
  private placeSub: Subscription;
  id_place: string;
  constructor(private route: ActivatedRoute, private navCtrl:NavController, private placesService: PlacesService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap =>{
      if(!paramMap.has('offer-bookingId')){
        this.navCtrl.navigateBack('places/tabs/offers');
        return;
      }
    // CONCLUSIÓN: este viene de places routing module
    this.id_place = paramMap.get('offer-bookingId');
    this.placeSub = this.placesService.get_place(this.id_place).subscribe(place => {
      this.currentPlace = place;
    });


  });

  }
  ngOnDestroy(){
    if(this.placeSub){
      this.placeSub.unsubscribe();
    }
  }
}
