import { Component } from '@angular/core';
import { environment } from '../../environments/environment';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';

const app = initializeApp(environment.firebaseConfig);
const db = getFirestore(app);
const membersCol = collection(db, 'members');

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false
})
export class Tab3Page {
  members: any[] = [];

  ionViewWillEnter() {
    this.loadStats();
  }

  loadStats() {
    const localData = JSON.parse(localStorage.getItem('club_members') || '[]');
    this.members = localData;
    try {
      onSnapshot(membersCol, snapshot => {
        if (!snapshot.empty) {
          this.members = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        }
      });
    } catch {}
  }

  get totalMembers() {
    return this.members.length;
  }

  get activeMembers() {
    return this.members.filter(m => m.status === 'Active').length;
  }

  get pendingMembers() {
    return this.members.filter(m => m.status === 'Pending').length;
  }

  countByCommittee(committee: string) {
    return this.members.filter(m => m.committee === committee).length;
  }
}
