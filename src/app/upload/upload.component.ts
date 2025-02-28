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
  selectedFiles: File[] = [];
  selectedExpiration: number = 300; // Default to 5 minutes
  uploadProgressArray: number[] = [];
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
    const files: FileList = event.target.files;
    this.selectedFiles = Array.from(files);
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
      const files: FileList = event.dataTransfer.files;
      this.selectedFiles = Array.from(files);
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

  uploadFiles() {
    if (this.selectedFiles.length === 0) return;
    this.uploading = true;
    this.uploadProgressArray = this.selectedFiles.map(() => 0);
    this.uploadNext(0);
  }

  uploadNext(index: number) {
    if (index >= this.selectedFiles.length) {
      this.uploading = false;
      this.notificationService.showSuccess('All files uploaded successfully!');
      this.uploaded.emit();
      this.selectedFiles = [];
      return;
    }
    const file = this.selectedFiles[index];
    const reader = new FileReader();
    reader.onprogress = (event: ProgressEvent<FileReader>) => {
      if (event.lengthComputable) {
        // We'll consider 50% progress for reading the file
        this.uploadProgressArray[index] = Math.round((event.loaded / event.total) * 50);
      }
    };
    reader.onload = async (event: any) => {
      const fileData = event.target.result.split(',')[1]; // Base64 data
      const expiresAt = new Date();
      expiresAt.setSeconds(expiresAt.getSeconds() + this.selectedExpiration);
      // Simulate the upload to Firestore taking additional progress (50% to 100%)
      // Since Firestore .add() doesn't support progress events, we simulate a short delay
      await this.firestore.collection('files').add({
        name: file.name,
        size: file.size,
        createdAt: new Date(),
        fileData,
        expiresAt: expiresAt.getTime(),
        ipAddress: this.userIpAddress,
        Token: this.sessionToken
      });
      // Set progress to 100% for this file
      this.uploadProgressArray[index] = 100;
      // Proceed to next file after a short delay
      setTimeout(() => { 
        this.uploadProgressArray=[];
        this.uploadNext(index + 1), 300
      });
    };
    reader.onerror = () => {
      this.notificationService.showError(`Error reading file: ${file.name}`);
      this.uploadNext(index + 1);
    };
    reader.readAsDataURL(file);
  }

  cancelUpload() {
    this.uploading = false;
    this.uploadProgressArray = [];
  }
}
