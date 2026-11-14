import { Component } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';

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

  constructor(private cdr: ChangeDetectorRef) {}

  ionViewWillEnter() {
    this.refreshStats();
  }

  ionViewDidEnter() {
    this.refreshStats();
  }

  refreshStats() {
    try {
      const rawData = localStorage.getItem('club_members_data');
      let members = rawData ? JSON.parse(rawData) : [];
      
      if (!Array.isArray(members) || members.length === 0) {
        members = [
          { id: '1', memberName: 'Daniel S. Prudenciado', studentId: '2400703', committee: 'Media', status: 'Active' },
          { id: '2', memberName: 'Khrescia De Castro', studentId: '2400812', committee: 'Events', status: 'Active' }
        ];
        localStorage.setItem('club_members_data', JSON.stringify(members));
      }

      this.total = members.length;
      this.activeCount = members.filter((m: any) => m?.status?.toLowerCase() === 'active').length;
      this.pendingCount = members.filter((m: any) => m?.status?.toLowerCase() === 'pending').length;
      this.mediaCount = members.filter((m: any) => m?.committee?.trim().toLowerCase() === 'media').length;
      this.logisticsCount = members.filter((m: any) => m?.committee?.trim().toLowerCase() === 'logistics').length;
      this.financeCount = members.filter((m: any) => m?.committee?.trim().toLowerCase() === 'finance').length;
      this.eventsCount = members.filter((m: any) => m?.committee?.trim().toLowerCase() === 'events').length;

      // Force UI refresh
      this.cdr.detectChanges();
    } catch (e) {
      this.total = 0;
      this.activeCount = 0;
      this.pendingCount = 0;
      this.mediaCount = 0;
      this.logisticsCount = 0;
      this.financeCount = 0;
      this.eventsCount = 0;
      this.cdr.detectChanges();
    }
  }
}
