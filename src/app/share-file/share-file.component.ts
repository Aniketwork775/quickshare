import { Component, Input } from '@angular/core';
import { openDB } from 'idb';

@Component({
  selector: 'app-share-file',
  templateUrl: './share-file.component.html',
  styleUrls: ['./share-file.component.scss']
})
export class ShareFileComponent {
  @Input() fileToShare: any = null;
  shareLink: any = null;

  // Generate a shareable link
  async generateShareLink() {
    if (this.fileToShare) {
      // You can customize this URL with your base URL and file key
      this.shareLink = `${window.location.origin}/file/${this.fileToShare.key}`;
    }
  }

  // Copy the shareable link to clipboard
  copyLink() {
    if (this.shareLink) {
      navigator.clipboard.writeText(this.shareLink).then(() => {
        alert('Link copied to clipboard!');
      });
    }
  }
}
