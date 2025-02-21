import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FileService } from './services/file.service';
import { Router } from '@angular/router';
import { ThreeDBackgroundComponent } from './three-dbackground/three-dbackground.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title:string="quickshare";
  isDarkMode: any;
  constructor(private fileService: FileService,private router:Router,private renderer: Renderer2) {}
  @ViewChild('threeBubbles', { static: false }) threeBubbles!: ThreeDBackgroundComponent;
  ngOnInit() {
    this.fileService.cleanupExpiredFiles();
    setInterval(() => {
      this.fileService.cleanupExpiredFiles();
    }, 60 * 60 * 1000); // ✅ Run every hour

    // ngOnInit() {
      const savedTheme = localStorage.getItem('theme');
      this.isDarkMode = savedTheme === 'dark';
      this.updateTheme();
    // }
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    this.updateTheme();
    this.threeBubbles.changeTheme(this.isDarkMode ? 'dark' : 'light');
  }

  private updateTheme() {
    if (this.isDarkMode) {
      this.renderer.addClass(document.body, 'dark-mode');
    } else {
      this.renderer.removeClass(document.body, 'dark-mode');
    }
  }

  navigation(){
    this.router.navigate(['']);
  }
}
