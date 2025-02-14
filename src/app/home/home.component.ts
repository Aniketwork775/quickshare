import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  upload:boolean=false;
  openFileDialog(){
    
  }

  uploaded(){
    this.upload=true
  }
}
