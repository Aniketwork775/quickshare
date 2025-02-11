import { Component, OnInit } from '@angular/core';
import { openDB } from 'idb';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss']
})
export class FileListComponent implements OnInit {
  files: any = [];

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
        return { name: key, size: fileData.byteLength };
      }));
    }
  }
}
