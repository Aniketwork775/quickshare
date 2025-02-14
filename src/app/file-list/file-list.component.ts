import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss']
})
export class FileListComponent implements OnInit {
  files: any[] = [];
  userIpAddress: any;
  sessionToken:any=null;
  constructor(private firestore: AngularFirestore,private http:HttpClient) {}

  async ngOnInit() {
    this.getIPAddress();
  }

  getIPAddress() {
    this.sessionToken=sessionStorage.getItem('Token');
    this.http.get('https://ipinfo.io/json').subscribe((response:any) => {
      this.userIpAddress=response.ip;
      // console.log("this.userIpAddress",this.userIpAddress);
      this.loadFiles();
    },(err)=>{
      // console.error('Error fetching IP:', err);
      const randomIP = this.generateRandomIp();
      // console.log('Using Random IP:', randomIP);
      this.userIpAddress=randomIP;
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
    // const fileSnapshots = await this.firestore.collection('files').get().toPromise();
    // if (fileSnapshots) {
    //   this.files = fileSnapshots.docs.map(doc => {
    //     const data = doc.data() as Record<string, any>; // Ensures data is treated as an object
    //     return { ...data, key: doc.id };
    //   });
    // }
    // console.log("this.userIpAddress=====",this.userIpAddress);
    
    const fileSnapshots = await this.firestore.collection('files').get().toPromise();
if (fileSnapshots) {
  this.files = fileSnapshots.docs
    .map(doc => {
      const data = doc.data() as Record<string, any>; // Ensures data is treated as an object
      return { ...data, key: doc.id };
    })
    .filter((file:any) => file?.Token === this.sessionToken && file.ipAddress === this.userIpAddress); // Filters files where IP is '127.0.0.1' 
}
    // this.firestore.collection('files', ref => ref.where('ipAddress', '==', this.userIpAddress))
    //   .valueChanges()
    //   .subscribe(files => {
    //     this.files = files;
    //   });

  }

  loadnewFiles() {
    setTimeout( () => {
      this.loadFiles();
      // const fileSnapshots = await this.firestore.collection('files').get().toPromise();
      // if (fileSnapshots) {
      //   this.files = fileSnapshots.docs
      //     .map(doc => {
      //       const data = doc.data() as Record<string, any>; // Ensures data is treated as an object
      //       return { ...data, key: doc.id };
      //     })
      //     .filter((file: any) => file?.Token === this.sessionToken && file.ipAddress === this.userIpAddress); 
      // }
    }, 1000);
  }
  

  downloadFile(file: any) {
    const link = document.createElement('a');
    link.href = `data:application/octet-stream;base64,${file.fileData}`;
    link.download = file.name;
    link.click();
  }

  deleteFile(fileId: string) {
    // console.log(fileId);
    
    this.firestore.collection('files').doc(fileId).delete().then(() => {
      alert('File deleted successfully');
      this.loadFiles();
    });
  }

  copyLink(file: { name: string, fileData: string,key:string }) {
    const blob = this.base64ToBlob(file.fileData);
    const url = window.URL.createObjectURL(blob);
    const a=btoa(url);
    const b=btoa(file.name);
    // const shareableLink = `${window.location.origin}/download/${a}/${b}`;
    const shareableLink = `${window.location.origin}/#/file/${file.key}`;
    navigator.clipboard.writeText(shareableLink).then(() => {
      alert('Shareable link copied!');
    });
  }

  getRemainingTime(expiresAt: number): string {
    const now = Date.now();
    const timeLeft = expiresAt - now;

    if (timeLeft <= 0) return 'Expired';

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mint = Math.floor((timeLeft % (1000 * 60 * 60 )) / (1000 * 60))+1;
    var str='';
    if(days>0){
      str=`${days} days`;
      if(hours>0){
        str=str+`, ${hours} hours`;
        if(mint>0){
          str=str+`, ${mint} mints`
        }
      }
    }
    else{
      if(hours>0){
        str=`${hours} hours`;
        if(mint>0){
          str=str+`, ${mint} mints`
        }
      }
      else{
        if(mint>0){
          str=`${mint} mints`
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
}
