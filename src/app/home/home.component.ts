import { Component, OnDestroy, ViewChild } from '@angular/core';
import { FileService } from '../services/file.service';
import { FileListComponent } from '../file-list/file-list.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnDestroy{
  @ViewChild('FileListComponent') FileListComponent!: FileListComponent;
  
  constructor(private fileService: FileService){}
  
  ngOnDestroy(): void {
    this.fileService.cleanupondestroy();
  }
}
