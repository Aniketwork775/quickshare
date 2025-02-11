import { Component, OnInit } from '@angular/core';
import { openDB } from 'idb';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss']
})
export class FileListComponent implements OnInit {
  files: any[] = [];
  selectedFile: { name: string, size: number, key: string } | null = null;

  async ngOnInit() {
    await this.loadFiles();
  }

  // Load files from IndexedDB
  async loadFiles() {
    const db = await openDB('quickshare-db', 1);
    const keys = await db.getAllKeys('files'); // Get all file names

    if (keys.length > 0) {
      this.files = await Promise.all(keys.map(async (key) => {
        const fileData = await db.get('files', key);
        return { name: key, size: fileData.byteLength, key: key };
      }));
    }
  }

  // Select a file to share
  selectFile(file: { name: string, size: number, key: string }) {
    this.selectedFile = file;
  }

  // Download the selected file
  async downloadFile(file: { name: string, size: number, key: string }) {
    const db = await openDB('quickshare-db', 1);
    const fileData = await db.get('files', file.key);

    // Create a Blob from the file data
    const blob = new Blob([fileData], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);

    // Create a temporary link element to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name; // Set the download file name
    a.click();

    // Clean up the URL object
    URL.revokeObjectURL(url);
  }
}
