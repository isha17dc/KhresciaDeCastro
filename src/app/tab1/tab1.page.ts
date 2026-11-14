import { Component } from '@angular/core';
import { ToastController, LoadingController } from '@ionic/angular';
import { environment } from '../../environments/environment';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const app = initializeApp(environment.firebaseConfig);
const db = getFirestore(app);
const membersCol = collection(db, 'members');

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false
})
export class Tab1Page {
  newMember = { memberName: '', studentId: '', committee: 'Media', status: 'Active' };

  constructor(private toastCtrl: ToastController, private loadingCtrl: LoadingController) {}

  async addMember() {
    if (!this.newMember.memberName || !this.newMember.studentId) {
      this.showToast('Please fill in all fields');
      return;
    }
    const loading = await this.loadingCtrl.create({ message: 'Saving member...' });
    await loading.present();
    try {
      await addDoc(membersCol, this.newMember);
      await loading.dismiss();
      this.showToast('Member added successfully');
      this.newMember = { memberName: '', studentId: '', committee: 'Media', status: 'Active' };
    } catch (e) {
      await loading.dismiss();
      this.showToast('Error saving record');
    }
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000, position: 'bottom' });
    await toast.present();
  }
}
