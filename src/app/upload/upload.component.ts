import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {
  selectedFile: File | null = null;
  uploading: boolean = false;

  constructor(private firestore: AngularFirestore) {}

  onFileSelect(event: any) {
    this.selectedFile = event.target.files[0];
  }

  async uploadFile() {
    if (this.selectedFile) {
      this.uploading = true;
      const fileReader = new FileReader();

      fileReader.onload = async (event: any) => {
        const base64String = event.target.result.split(',')[1]; // Extract Base64 data

        // Save Base64 string and metadata in Firestore
        await this.firestore.collection('files').add({
          name: this.selectedFile?.name,
          size: this.selectedFile?.size,
          fileData: base64String,
          createdAt: new Date()
        });

        this.uploading = false;
        alert('File uploaded successfully!');
      };

      fileReader.readAsDataURL(this.selectedFile); // Convert file to Base64
    }
  }
}
