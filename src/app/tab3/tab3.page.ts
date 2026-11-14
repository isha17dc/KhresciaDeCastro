import { Component } from '@angular/core';

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

  ionViewDidEnter() {
    this.loadStats();
  }

  loadStats() {
    let localData = JSON.parse(localStorage.getItem('club_members_data') || '[]');
    if (localData.length === 0) {
      localData = [
        { id: '1', memberName: 'Daniel S. Prudenciado', studentId: '2400703', committee: 'Media', status: 'Active' },
        { id: '2', memberName: 'Daniel Prudenciado', studentId: '2400703', committee: 'Media', status: 'Active' },
        { id: '3', memberName: 'Khrescia De Castro', studentId: '2400812', committee: 'Events', status: 'Active' }
      ];
      localStorage.setItem('club_members_data', JSON.stringify(localData));
    }
    this.members = localData;
  }

  get totalMembers() {
    return this.members.length;
  }

  get activeMembers() {
    return this.members.filter(m => m.status?.toLowerCase() === 'active' || m.status === 'Active').length;
  }

  get pendingMembers() {
    return this.members.filter(m => m.status?.toLowerCase() === 'pending' || m.status === 'Pending').length;
  }

  countByCommittee(committeeName: string) {
    return this.members.filter(m => m.committee?.trim().toLowerCase() === committeeName.trim().toLowerCase()).length;
  }
}
