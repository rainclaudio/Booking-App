import { Component, OnInit } from '@angular/core';
import {Plugins, Capacitor, Camera, CameraSource, CameraResultType} from '@capacitor/core';
@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {
  selectedImage: string;

  constructor() { }

  ngOnInit() {}

  onPickImage(){
    if(!Capacitor.isPluginAvailable('Camera')){
      return;
    }
    Plugins.Camera.getPhoto({
      // 1 to 100
      quality: 50,
      source: CameraSource.Prompt,
      correctOrientation: true,
      height: 320,
      width: 200,
      // converted to string
      resultType: CameraResultType.Base64
    });
  }
}
