import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../core/api.service';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-artisan-schedule',
  standalone: true,
  imports: [CommonModule, Sidebar],
  templateUrl: './artisan-schedule.html',
  styleUrl: './artisan-schedule.css'
})
export class ArtisanSchedule implements OnInit {
  private api = inject(ApiService);

  upcoming: any[] = [];
  loading = true;

  ngOnInit(): void {
    this.api.listOrders().subscribe({
      next: (response: any) => {
        const orders = response.orders ?? [];
        this.upcoming = orders
          .filter((o: any) => o.status === 'accepted')
          .sort((a: any, b: any) => {
            if (!a.scheduled_for) return 1;
            if (!b.scheduled_for) return -1;
            return new Date(a.scheduled_for).getTime() - new Date(b.scheduled_for).getTime();
          });
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
}
