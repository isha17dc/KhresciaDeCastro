import { Component } from '@angular/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false
})
export class Tab3Page {
  total: number = 0;
  activeCount: number = 0;
  pendingCount: number = 0;
  mediaCount: number = 0;
  logisticsCount: number = 0;
  financeCount: number = 0;
  eventsCount: number = 0;

  ionViewWillEnter() {
    this.loadStats();
  }

  ionViewDidEnter() {
    this.loadStats();
  }

  loadStats() {
    let localData = (window as any)['club_members_global'] || JSON.parse(localStorage.getItem('club_members_data') || '[]');
    if (localData.length === 0) {
      localData = [
        { id: '1', memberName: 'Daniel S. Prudenciado', studentId: '2400703', committee: 'Media', status: 'Active' },
        { id: '2', memberName: 'Khrescia De Castro', studentId: '2400812', committee: 'Events', status: 'Active' }
      ];
      localStorage.setItem('club_members_data', JSON.stringify(localData));
    }

    this.total = localData.length;
    this.activeCount = localData.filter((m: any) => m.status?.toLowerCase() === 'active').length;
    this.pendingCount = localData.filter((m: any) => m.status?.toLowerCase() === 'pending').length;
    this.mediaCount = localData.filter((m: any) => m.committee?.trim().toLowerCase() === 'media').length;
    this.logisticsCount = localData.filter((m: any) => m.committee?.trim().toLowerCase() === 'logistics').length;
    this.financeCount = localData.filter((m: any) => m.committee?.trim().toLowerCase() === 'finance').length;
    this.eventsCount = localData.filter((m: any) => m.committee?.trim().toLowerCase() === 'events').length;
  }
}
