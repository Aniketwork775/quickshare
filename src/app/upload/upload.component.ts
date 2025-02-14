import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {
  selectedFile: File | null = null;
  selectedExpiration: number = 7; // Default to 7 days
  uploadProgress: number | null = null;
  uploading: boolean = false;
  @Output() uploaded=new EventEmitter();
  file:any='';
  expirationOptions = [
    { label: '1 Hour', value: 1 / 24 },
    { label: '1 Day', value: 1 },
    { label: '3 Days', value: 3 },
    { label: '7 Days', value: 7 },
    { label: '30 Days', value: 30 }
  ];
  userIpAddress: any;

  constructor(private firestore: AngularFirestore,private http:HttpClient) {
    this.getIPAddress();
  }

  onFileSelect(event: any) {
    this.selectedFile = event.target.files[0];
  }


  getIPAddress() {
    // this.http.get<{ ip:any }>('https://api64.ipify.org?format=json').subscribe(
    //   (response) => {
    //     this.userIpAddress = response.ip;
    //     console.log("this.userIpAddress===",this.userIpAddress);
        
    //   },
    //   (error) => {
    //     console.error('Error fetching IP address', error);
    //   }
    // );
    this.http.get('https://ipinfo.io/json').subscribe((response:any) => {
      this.userIpAddress=response.ip;
      console.log(this.userIpAddress);
      
    },(err)=>{
      console.error('Error fetching IP:', err);
      const randomIP = this.generateRandomIp();
      console.log('Using Random IP:', randomIP);
      this.userIpAddress=randomIP;
    });
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
      expiresAt.setDate(expiresAt.getDate() + this.selectedExpiration);

      // Simulating upload progress
      const interval = setInterval(() => {
        if (this.uploadProgress! < 100) {
          this.uploadProgress! += 10; // Increment progress
        } else {
          clearInterval(interval);
          this.uploading = false;
        }
      }, 300);

      // Store in Firestore
      await this.firestore.collection('files').add({
        name: this.selectedFile?.name,
        size: this.selectedFile?.size,
//      fileData: base64String,
        createdAt: new Date(),
        fileData,
        expiresAt: expiresAt.getTime(),
        ipAddress: this.userIpAddress // Store the user's IP address
      });

      alert('File uploaded successfully!');
      let input=window.document.getElementById('fileInput')
      this.uploaded.emit();
      this.selectedFile = null;
      this.uploadProgress = null;
    };
    reader.readAsDataURL(this.selectedFile);
  }


  // async uploadFile() {
  //   if (this.selectedFile) {
  //     this.uploading = true;
  //     const fileReader = new FileReader();

  //     fileReader.onload = async (event: any) => {
  //       const base64String = event.target.result.split(',')[1]; // Extract Base64 data

  //       // Save Base64 string and metadata in Firestore
  //       await this.firestore.collection('files').add({
  //         name: this.selectedFile?.name,
  //         size: this.selectedFile?.size,
  //         fileData: base64String,
  //         createdAt: new Date()
  //       });

  //       this.uploading = false;
  //       alert('File uploaded successfully!');
  //     };

  //     fileReader.readAsDataURL(this.selectedFile); // Convert file to Base64
  //   }
  // }

  cancelUpload() {
    this.uploading = false;
    this.uploadProgress = null;
  }
}
