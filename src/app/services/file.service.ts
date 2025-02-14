import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  constructor(private firestore: AngularFirestore) {}

  async cleanupExpiredFiles() {
    const now = Date.now();
    const snapshot = await this.firestore.collection('files', ref => ref.where('expiresAt', '<', now)).get().toPromise();

    snapshot?.forEach(doc => {
      this.firestore.collection('files').doc(doc.id).delete();
    });

    // console.log('Expired files deleted successfully.');
  }

  async cleanupondestroy(){
    const Token=sessionStorage.getItem('Token');
    const snapshot = await this.firestore.collection('files', ref => ref.where('Token', '==', Token)).get().toPromise();

    snapshot?.forEach(doc => {
      this.firestore.collection('files').doc(doc.id).delete();
    });

    sessionStorage.removeItem('Token');
    // console.log('Expired files deleted successfully.');
  }
}
