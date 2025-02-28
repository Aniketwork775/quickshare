import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {
  selectedFile: File | null = null;
  selectedExpiration: number = 300; // Default to 5 minutes
  uploadProgress: number | null = null;
  uploading: boolean = false;
  isDragOver: boolean = false;
  @Output() uploaded = new EventEmitter();
  expirationOptions = [
    { label: '1 mint', value: 60 },
    { label: '5 mint', value: 300 },
    { label: '10 mint', value: 600 },
    { label: '30 mint', value: 1800 }
  ];
  userIpAddress: any;
  sessionToken: any = null;

  constructor(
    private firestore: AngularFirestore,
    private http: HttpClient,
    private notificationService: NotificationService
  ) {
    this.getIPAddress();
    this.sessionToken = sessionStorage.getItem('Token');
    if (this.sessionToken == null) {
      this.sessionToken = this.generateRandomToken();
      sessionStorage.setItem('Token', this.sessionToken);
    }
  }

  // Generate a random token for session tracking
  generateRandomToken(): string {
    return Math.random().toString(36);
  }

  onFileSelect(event: any) {
    this.selectedFile = event.target.files[0];
  }

  // Drag event handlers
  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.selectedFile = event.dataTransfer.files[0];
      event.dataTransfer.clearData();
    }
  }

  getIPAddress() {
    this.http.get('https://ipinfo.io/json').subscribe(
      (response: any) => {
        this.userIpAddress = response.ip;
      },
      (err) => {
        const randomIP = this.generateRandomIp();
        this.userIpAddress = randomIP;
      }
    );
  }

  generateRandomIp(): string {
    return `${this.getRandom(1, 255)}.${this.getRandom(0, 255)}.${this.getRandom(0, 255)}.${this.getRandom(1, 255)}`;
  }

  getRandom(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  uploadFile() {
    if (!this.selectedFile) return;

    this.uploading = true;
    this.uploadProgress = 0;

    const reader = new FileReader();
    reader.onload = async (event: any) => {
      const fileData = event.target.result.split(',')[1]; // Convert to Base64

      const expiresAt = new Date();
      expiresAt.setSeconds(expiresAt.getSeconds() + this.selectedExpiration);

      // Simulate upload progress
      const interval = setInterval(() => {
        if (this.uploadProgress! < 100) {
          this.uploadProgress! += 10;
        } else {
          clearInterval(interval);
          this.uploading = false;
        }
      }, 300);

      // Store in Firestore
      await this.firestore.collection('files').add({
        name: this.selectedFile?.name,
        size: this.selectedFile?.size,
        createdAt: new Date(),
        fileData,
        expiresAt: expiresAt.getTime(),
        ipAddress: this.userIpAddress,
        Token: this.sessionToken
      });

      this.onUploadSuccess();
      this.uploaded.emit();
      this.selectedFile = null;
      this.uploadProgress = null;
    };
    reader.readAsDataURL(this.selectedFile);
  }

  onUploadSuccess() {
    this.notificationService.showSuccess('File uploaded successfully!');
  }

  onUploadError() {
    this.notificationService.showError('File upload failed. Please try again.');
  }

  cancelUpload() {
    this.uploading = false;
    this.uploadProgress = null;
  }
}
