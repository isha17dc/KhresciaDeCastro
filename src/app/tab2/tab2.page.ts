import { Component } from '@angular/core';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';
import { environment } from '../../environments/environment';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, deleteDoc, updateDoc, doc } from 'firebase/firestore';

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
    this.loadMembers();
  }

  ionViewDidEnter() {
    this.loadMembers();
  }

  loadMembers() {
    let localData = JSON.parse(localStorage.getItem('club_members_data') || '[]');
    if (localData.length === 0) {
      localData = [
        { id: '1', memberName: 'Daniel S. Prudenciado', studentId: '2400703', committee: 'Media', status: 'Active' },
        { id: '2', memberName: 'Khrescia De Castro', studentId: '2400812', committee: 'Events', status: 'Active' }
      ];
      localStorage.setItem('club_members_data', JSON.stringify(localData));
    }
    this.members = localData;
    (window as any)['club_members_global'] = localData;
  }

  get filteredMembers() {
    return this.members.filter(m => {
      const matchesSearch =
        m.memberName?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        m.studentId?.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = this.selectedStatus === 'All' || m.status?.toLowerCase() === this.selectedStatus.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }

  doRefresh(event: any) {
    this.loadMembers();
    setTimeout(() => event.target.complete(), 400);
  }

  async deleteMember(memberId: string) {
    const loading = await this.loadingCtrl.create({ message: 'Deleting...', duration: 400 });
    await loading.present();
    
    this.members = this.members.filter(m => m.id !== memberId);
    localStorage.setItem('club_members_data', JSON.stringify(this.members));
    (window as any)['club_members_global'] = this.members;

    try {
      await deleteDoc(doc(db, 'members', memberId));
    } catch {}

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
            this.members = this.members.map(m =>
              m.id === member.id
                ? { ...m, memberName: data.memberName, studentId: data.studentId, committee: data.committee, status: data.status }
                : m
            );
            localStorage.setItem('club_members_data', JSON.stringify(this.members));
            (window as any)['club_members_global'] = this.members;

            try {
              const memberRef = doc(db, 'members', member.id);
              await updateDoc(memberRef, {
                memberName: data.memberName,
                studentId: data.studentId,
                committee: data.committee,
                status: data.status
              });
            } catch {}

            this.showToast('Member updated successfully');
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
