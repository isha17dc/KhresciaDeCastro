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
    const localData = JSON.parse(localStorage.getItem('club_members_data') || '[]');
    this.members = localData;
  }

  get totalMembers() {
    return this.members.length;
  }

  get activeMembers() {
    return this.members.filter(m => m.status?.toLowerCase() === 'active').length;
  }

  get pendingMembers() {
    return this.members.filter(m => m.status?.toLowerCase() === 'pending').length;
  }

  countByCommittee(committee: string) {
    return this.members.filter(m => m.committee?.toLowerCase() === committee.toLowerCase()).length;
  }
}
