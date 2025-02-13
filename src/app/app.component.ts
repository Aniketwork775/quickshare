import { Component, OnInit } from '@angular/core';
import { FileService } from './services/file.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private fileService: FileService) {}

  ngOnInit() {
    setInterval(() => {
      this.fileService.cleanupExpiredFiles();
    }, 60 * 60 * 1000); // ✅ Run every hour
  }
}
