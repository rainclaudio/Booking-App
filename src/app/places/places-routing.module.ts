import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlaceDetailPage } from './discover/place-detail/place-detail.page';

import { PlacesPage } from './places.page';
/*
con tabs: ensamblamos places page y places discover juntos
por eso es necesario quitar el title de places page
con discover ensamblamos discover page

¨*/
const routes: Routes = [
  {
    path: 'tabs',
    component: PlacesPage,
    children: [
        // primer path: discover
// contains: placedetail as children
  {
    path: 'discover',
    children: [
      {
      path: '',
      loadChildren: () => import('./discover/discover.module').then( m => m.DiscoverPageModule)

      },
      {
        path: ':placeId',
        loadChildren: () => import('./discover/place-detail/place-detail.module').then(m => m.PlaceDetailPageModule)
      }
    ]
  },
  // segundo path: offers
  // containg: new offer (hard) / new offer (dynamic) / offerbooking (dinamic)
  {
    path: 'offers',
    children: [
      {
        path: '',
        loadChildren: () => import('./offers/offers.module').then( m => m.OffersPageModule)
      },
      {
        path: 'new-offer',
        loadChildren: () => import('./offers/new-offer/new-offer.module').then( m => m.NewOfferPageModule)

      },
      {
        path:'edit/:edit-offerId',
        loadChildren: () => import('./offers/edit-offer/edit-offer.module').then( m => m.EditOfferPageModule)

      },
      {
        path: ':offer-bookingId',
          loadChildren: () => import('./offers/offer-booking/offer-booking.module').then( m => m.OfferBookingPageModule)

      }
    ]
  }
  ,
  {
    path: '',
    redirectTo: 'places/tabs/discover',
    pathMatch:'full'
  }
   ]
  },
  {
    path: '',
    redirectTo: '/places/tabs/discover',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlacesPageRoutingModule {}
