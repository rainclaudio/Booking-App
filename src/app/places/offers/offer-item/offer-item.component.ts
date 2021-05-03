import { Component, OnInit,Input } from '@angular/core';
import {PlaceNode} from '../../placeNode'
@Component({
  selector: 'app-offer-item',
  templateUrl: './offer-item.component.html',
  styleUrls: ['./offer-item.component.scss'],
})
export class OfferItemComponent implements OnInit {

 @Input() offer: PlaceNode;

  constructor() { }

  ngOnInit() {}
getDummyDate(){
  return new Date();
}

}
