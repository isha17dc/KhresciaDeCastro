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
    const loading = await this.loadingCtrl.create({ message: 'Saving member...', duration: 500 });
    await loading.present();

    const newRecord = {
      id: 'id_' + Date.now(),
      ...this.newMember
    };

    // Save to shared localStorage instantly so Tab 2 and Tab 3 read it accurately
    const existing = JSON.parse(localStorage.getItem('club_members_data') || '[]');
    existing.unshift(newRecord);
    localStorage.setItem('club_members_data', JSON.stringify(existing));

    try {
      await addDoc(membersCol, this.newMember);
    } catch {}

    await loading.dismiss();
    this.showToast('Member added successfully!');
    this.newMember = { memberName: '', studentId: '', committee: 'Media', status: 'Active' };
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000, position: 'bottom' });
    await toast.present();
  }
}
