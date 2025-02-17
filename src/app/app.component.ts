import { Component, OnInit } from '@angular/core';
import { FileService } from './services/file.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title:string="quickshare";
  constructor(private fileService: FileService,private router:Router) {}

  ngOnInit() {
    this.fileService.cleanupExpiredFiles();
    setInterval(() => {
      this.fileService.cleanupExpiredFiles();
    }, 60 * 60 * 1000); // ✅ Run every hour
  }

  toggleDarkMode(){

  }

  navigation(){
    this.router.navigate(['']);
  }
}
