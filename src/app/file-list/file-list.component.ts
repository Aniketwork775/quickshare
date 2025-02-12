import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss']
})
export class FileListComponent implements OnInit {
  files: any[] = [];

  constructor(private firestore: AngularFirestore) {}

  async ngOnInit() {
    await this.loadFiles();
  }

  async loadFiles() {
    const fileSnapshots = await this.firestore.collection('files').get().toPromise();
    if (fileSnapshots) {
      this.files = fileSnapshots.docs.map(doc => {
        const data = doc.data() as Record<string, any>; // Ensures data is treated as an object
        return { ...data, key: doc.id };
      });
    }
  }

  async downloadFile(file: { name: string, fileData: string }) {
    const blob = this.base64ToBlob(file.fileData);
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  copyLink(file: { name: string, fileData: string }) {
    const blob = this.base64ToBlob(file.fileData);
    const url = window.URL.createObjectURL(blob);
    const a=btoa(url);
    const b=btoa(file.name);
    const shareableLink = `${window.location.origin}/download/${a}/${b}`;
    navigator.clipboard.writeText(shareableLink).then(() => {
      alert('Shareable link copied!');
    });
  }

  private base64ToBlob(base64: string) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: 'application/octet-stream' });
  }
}
