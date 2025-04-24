import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { trigger, transition, style, animate } from '@angular/animations';
import { NotificationService } from '../services/notification.service';

import * as QRCode from 'qrcode-generator';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';



@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class FileListComponent implements OnInit {
  files: any[] = [];
  userIpAddress: any;
  sessionToken: any = null;
  searchQuery: string = '';
  previewFile: any = null;
  fileUrl!: SafeResourceUrl;

  constructor(
    private firestore: AngularFirestore,
    private http: HttpClient,
    private notificationService: NotificationService,
    private sanitizer: DomSanitizer
  ) {}

  async ngOnInit() {
    this.getIPAddress();
  }

  getIPAddress() {
    this.sessionToken = sessionStorage.getItem('Token');
    this.http.get('https://ipinfo.io/json').subscribe((response: any) => {
      this.userIpAddress = response.ip;
      this.loadFiles();
    }, (err) => {
      const randomIP = this.generateRandomIp();
      this.userIpAddress = randomIP;
      this.loadFiles();
    });
  }

  generateRandomIp(): string {
    return `${this.getRandom(1, 255)}.${this.getRandom(0, 255)}.${this.getRandom(0, 255)}.${this.getRandom(1, 255)}`;
  }
  
  getRandom(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async loadFiles() {
    const fileSnapshots = await this.firestore.collection('files').get().toPromise();
    if (fileSnapshots) {
      this.files = fileSnapshots.docs
        .map(doc => {
          const data:any = doc.data() as Record<string, any>;
          return { 
            ...data, key: doc.id,
            previewUrl: this.generatePreviewUrl(data.fileData, data.name)
          };
        })
        .filter((file: any) => file?.Token === this.sessionToken && file.ipAddress === this.userIpAddress);
    }
  }

  loadnewFiles() {
    setTimeout(() => {
      this.loadFiles();
    }, 1000);
  }

  downloadFile(file: any) {
    const link = document.createElement('a');
    link.href = `data:application/octet-stream;base64,${file.fileData}`;
    link.download = file.name;
    link.click();
  }

  deleteFile(fileId: string) {
    this.firestore.collection('files').doc(fileId).delete().then(() => {
      this.onDeleteFile();
      this.loadFiles();
    });
  }

  onDeleteFile() {
    this.notificationService.showSuccess('File deleted successfully!');
  }

  copyLink(file: { name: string, fileData: string, key: string }) {
    // const shareableLink = `${window.location.origin}/#/file/${file.key}`;
    const shareableLink = `${window.location.origin}/quickshare/#/file/${file.key}`;
    navigator.clipboard.writeText(shareableLink).then(() => {
      this.notificationService.showInfo("Shareable link copied!");
    });
  }

  toggleQRCode(file: any) {
    file.showQR = !file.showQR;
    if (file.showQR && !file.qrCode) {
      // const shareableLink = `${window.location.origin}/#/file/${file.key}`;
      const shareableLink = `${window.location.origin}/quickshare/#/file/${file.key}`;
      const typeNumber = 4; // Adjust type number based on content length
      const errorCorrectionLevel = 'L';
      const qr = QRCode(typeNumber, errorCorrectionLevel);
      qr.addData(shareableLink);
      qr.make();
      // Create an image tag for the QR code; scale factor is set to 4
      file.qrCode = qr.createImgTag(4);
    }
  }

  isImage(fileName: string): boolean {
    return /\.(jpg|jpeg|png|gif)$/i.test(fileName);
  }

  isPDF(fileName: string): boolean {
    return /\.pdf$/i.test(fileName);
  }

  setFileUrl(url: string) {
    
    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    // console.log("this.fileUrl================",this.fileUrl);
  }

  generatePreviewUrl(fileData: string, fileName: string): string {
    // console.log('hello');
    
    if (this.isImage(fileName)) {
      return `data:image/png;base64,${fileData}`;
    } else if (this.isPDF(fileName)) {
      this.setFileUrl(`data:application/pdf;base64,${fileData}`)
      return `data:application/pdf;base64,${fileData}`;
    }
    return '';
  }

  openPreview(file: any) {
    // console.log("file----------",file);
    
    this.previewFile = file;
  }

  closePreview() {
    this.previewFile = null;
  }

  // ✅ Filtering files in TypeScript instead of using a filter pipe
  get filteredFiles() {
    if (!this.searchQuery) return this.files;
    return this.files.filter(file =>
      file.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  getRemainingTime(expiresAt: number): string {
    const now = Date.now();
    const timeLeft = expiresAt - now;
    if (timeLeft <= 0) return 'Expired';

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mint = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)) + 1;
    let str = '';
    if (days > 0) {
      str = `${days} days`;
      if (hours > 0) {
        str += `, ${hours} hours`;
        if (mint > 0) {
          str += `, ${mint} mints`;
        }
      }
    } else {
      if (hours > 0) {
        str = `${hours} hours`;
        if (mint > 0) {
          str += `, ${mint} mints`;
        }
      } else {
        if (mint > 0) {
          str = `${mint} mints`;
        }
      }
    }
    return str;
  }

  private base64ToBlob(base64: string) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: 'application/octet-stream' });
  }

  getPreviewUrl(file: any): SafeResourceUrl {
    // Check if it's a Blob (file uploaded from the local system)
    if (file instanceof File) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(file));
    }
    // Otherwise, assume it's a remote URL and sanitize it
    return this.sanitizer.bypassSecurityTrustResourceUrl(file.url);
  }
}
