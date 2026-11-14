import { Component } from '@angular/core';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';
import { environment } from '../../environments/environment';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot, deleteDoc, updateDoc, doc } from 'firebase/firestore';

const app = initializeApp(environment.firebaseConfig);
const db = getFirestore(app);
const membersCol = collection(db, 'members');

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false
})
export class Tab2Page {
  members: any[] = [];
  searchTerm: string = '';
  selectedStatus: string = 'All';

  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {}

  ionViewWillEnter() {
    this.subscribeToMembers();
  }

  subscribeToMembers() {
    onSnapshot(membersCol, snapshot => {
      this.members = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    });
  }

  get filteredMembers() {
    return this.members.filter(m => {
      const matchesSearch =
        m.memberName?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        m.studentId?.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = this.selectedStatus === 'All' || m.status === this.selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }

  doRefresh(event: any) {
    this.subscribeToMembers();
    setTimeout(() => event.target.complete(), 600);
  }

  async deleteMember(memberId: string) {
    const loading = await this.loadingCtrl.create({ message: 'Deleting...' });
    await loading.present();
    await deleteDoc(doc(db, 'members', memberId));
    await loading.dismiss();
    this.showToast('Member deleted');
  }

  async updateMember(member: any) {
    const alert = await this.alertCtrl.create({
      header: 'Update Member',
      inputs: [
        { name: 'memberName', type: 'text', value: member.memberName, placeholder: 'Full Name' },
        { name: 'studentId', type: 'text', value: member.studentId, placeholder: 'Student ID' },
        { name: 'committee', type: 'text', value: member.committee, placeholder: 'Committee' },
        { name: 'status', type: 'text', value: member.status, placeholder: 'Active or Pending' }
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Update',
          handler: async (data) => {
            const memberRef = doc(db, 'members', member.id);
            await updateDoc(memberRef, {
              memberName: data.memberName,
              studentId: data.studentId,
              committee: data.committee,
              status: data.status
            });
            this.showToast('Member updated');
          }
        }
      ]
    });
    await alert.present();
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000, position: 'bottom' });
    await toast.present();
  }
}
