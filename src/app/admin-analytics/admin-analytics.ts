import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../core/api.service';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-admin-analytics',
  standalone: true,
  imports: [CommonModule, Sidebar],
  templateUrl: './admin-analytics.html',
  styleUrl: './admin-analytics.css'
})
export class AdminAnalytics implements OnInit {
  private api = inject(ApiService);

  bookings: { day: string; bookings: number }[] = [];
  revenue: { day: string; revenue: number }[] = [];
  loading = true;

  get maxBookings(): number {
    return Math.max(1, ...this.bookings.map(b => b.bookings));
  }

  get maxRevenue(): number {
    return Math.max(1, ...this.revenue.map(r => r.revenue));
  }

  ngOnInit(): void {
    this.api.getAdminTrend().subscribe({
      next: (response: any) => {
        this.bookings = (response.bookings ?? []).map((b: any) => ({ day: b.day, bookings: Number(b.bookings) }));
        this.revenue = (response.revenue ?? []).map((r: any) => ({ day: r.day, revenue: Number(r.revenue) }));
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
}
