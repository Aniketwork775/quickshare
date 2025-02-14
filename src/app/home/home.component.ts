import { Component, OnDestroy } from '@angular/core';
import { FileService } from '../services/file.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnDestroy{
  
  constructor(private fileService: FileService){}

  upload:boolean=false;
  openFileDialog(){
    
  }

  uploaded(){
    this.upload=true
  }
  
  ngOnDestroy(): void {
    this.fileService.cleanupondestroy();
  }
}
