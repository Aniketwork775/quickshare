import { Component } from '@angular/core';
import { openDB } from 'idb';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {
  selectedFile: File | null = null;
  uploadProgress: number | null = null;
  uploading: boolean = false;

  // Initialize IndexedDB on component load
  async ngOnInit() {
    const db = await openDB('quickshare-db', 1, {
      upgrade(db) {
        // Create the 'files' object store if it doesn't exist
        db.createObjectStore('files');
      }
    });
  }

  // Handle file selection
  onFileSelect(event: any) {
    this.selectedFile = event.target.files[0];
  }

  // Upload file to IndexedDB
  async uploadFile() {
    if (!this.selectedFile) return;

    this.uploading = true;
    this.uploadProgress = 0;

    const db = await openDB('quickshare-db', 1);
    const fileReader = new FileReader();

    fileReader.onloadstart = () => {
      // Initialize the progress bar
      this.uploadProgress = 0;
    };

    fileReader.onprogress = (e: ProgressEvent<FileReader>) => {
      if (e.loaded && e.total) {
        this.uploadProgress = Math.round((e.loaded / e.total) * 100);
      }
    };

    fileReader.onloadend = async () => {
      const fileData = fileReader.result as ArrayBuffer;
      
      // Store the file in IndexedDB
      await db.put('files', fileData, this.selectedFile?.name);
      
      console.log(`File uploaded to IndexedDB: ${this.selectedFile?.name}`);
      this.uploadProgress = 100; // Completed upload
      this.uploading = false; // Hide the cancel button after upload completes
    };

    // Start reading the file as ArrayBuffer
    fileReader.readAsArrayBuffer(this.selectedFile);
  }

  // Cancel file upload (for demo purposes)
  cancelUpload() {
    this.uploading = false;
    this.uploadProgress = null;
    console.log('File upload canceled');
  }
}
