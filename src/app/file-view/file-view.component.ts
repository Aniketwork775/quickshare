import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-file-view',
  templateUrl: './file-view.component.html',
  styleUrls: ['./file-view.component.scss']
})
export class FileViewComponent implements OnInit {
  file: { name: string, fileData: string } | null = null;
  loading = true;

  constructor(private route: ActivatedRoute, private firestore: AngularFirestore, private router: Router) {}

  ngOnInit() {
    const fileId = this.route.snapshot.paramMap.get('id');
    if (fileId) {
      this.fetchFile(fileId);
    } else {
      this.loading = false;
    }
  }

  // async fetchFile(fileId: string) {
  //   try {
  //     const doc = await this.firestore.collection('files').doc(fileId).get().toPromise();
  //     if (doc?.exists) {
  //       this.file = doc.data() as any;
  //     } else {
  //       alert('File not found!');
  //       this.router.navigate(['/']);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching file:', error);
  //   } finally {
  //     this.loading = false;
  //   }
  // }
  async fetchFile(fileId: string) {
    try {
      const doc = await this.firestore.collection('files').doc(fileId).get().toPromise();
      if (doc?.exists) {
        const fileData = doc.data() as any;
        const now = Date.now();
  
        if (fileData.expiresAt < now) {
          alert('This file has expired and is no longer available.');
          this.router.navigate(['/']);
          return;
        }
  
        this.file = fileData;
      } else {
        alert('File not found!');
        this.router.navigate(['/']);
      }
    } catch (error) {
      console.error('Error fetching file:', error);
    } finally {
      this.loading = false;
    }
  }
  

  downloadFile() {
    if (!this.file) return;
    const blob = this.base64ToBlob(this.file.fileData);
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = this.file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  private base64ToBlob(base64: string) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: 'application/octet-stream' });
  }
}
