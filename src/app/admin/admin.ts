import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink} from '@angular/router';
import { jwtDecode, } from 'jwt-decode';
import { ApiService } from '../core/api.service';

import { API_BASE_URL } from '../core/api-base';
interface JwtPayload {
  user_id: Number,
  email: String,
  first_name: String,
  role: String,
  iat: Number,
  exp: Number,
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterLink,],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class Admin implements OnInit {
  isSidebarCollapsed: boolean = false;

  // ===== Overview Stats ===== (populated from GET /stats/admin in ngOnInit)
  adminStats = [
    { title: 'Total Artisans', value: 0, icon: 'bi bi-person-workspace', color: 'text-primary', change: '', changePositive: true },
    { title: 'Total Customers', value: 0, icon: 'bi bi-people-fill', color: 'text-success', change: '', changePositive: true },
    { title: 'Total Orders', value: 0, icon: 'bi bi-cart-fill', color: 'text-warning', change: '', changePositive: true },
    { title: 'Total Revenue', value: '…0', icon: 'bi bi-cash-stack', color: 'text-danger', change: '', changePositive: true },
  ];

  // ===== Artisans (most recent 5, from GET /admin/artisans) =====
  artisans: any[] = [];

  // ===== Top Services ===== (populated from GET /stats/admin)
  topServices: { name: string; bookings: number }[] = [];

  // ===== Recent Payments ===== (populated from GET /stats/admin)
  recentPayments: { customer: string; amount: number; status: string }[] = [];

  // ===== Recent Reviews ===== (populated from GET /stats/admin)
  reviews: { customer: string; comment: string; rating: number; date: Date }[] = [];

  // ===== Platform metrics ===== (all real, populated from GET /stats/admin)
  platformMetrics = {
    bookingGrowthPct: 0,
    bookingsThisWeek: 0,
    newUsersThisWeek: 0,
    avgOrderValue: 0,
    averageRating: null as number | null,
    totalReviews: 0
  };

  constructor() { }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

user: any = "";
  payload: any = '';
  private _http = inject(HttpClient);
  private _router = inject(Router);
  private api = inject(ApiService);

  ngOnInit(): void {
    const token = localStorage['token'];
    if (token) {
      this.payload = jwtDecode<JwtPayload>(token);
      this.user = this.payload.first_name;
      console.log(this.payload.user_id);

    }

    this.api.getAdminStats().subscribe((stats: any) => {
      const newArtisans = Number(stats.new_artisans_this_week ?? 0);
      const newCustomers = Number(stats.new_customers_this_week ?? 0);
      const bookingsThisWeek = Number(stats.bookings_this_week ?? 0);
      const revenueThisWeek = Number(stats.revenue_this_week ?? 0);

      this.adminStats = [
        { title: 'Total Artisans', value: stats.total_artisans, icon: 'bi bi-person-workspace', color: 'text-primary', change: newArtisans > 0 ? `+${newArtisans} this week` : 'No new signups this week', changePositive: newArtisans > 0 },
        { title: 'Total Customers', value: stats.total_customers, icon: 'bi bi-people-fill', color: 'text-success', change: newCustomers > 0 ? `+${newCustomers} this week` : 'No new signups this week', changePositive: newCustomers > 0 },
        { title: 'Total Orders', value: stats.total_orders, icon: 'bi bi-cart-fill', color: 'text-warning', change: bookingsThisWeek > 0 ? `+${bookingsThisWeek} this week` : 'No bookings this week', changePositive: bookingsThisWeek > 0 },
        { title: 'Total Revenue', value: '₦' + (stats.total_revenue?.toLocaleString?.() ?? stats.total_revenue), icon: 'bi bi-cash-stack', color: 'text-danger', change: revenueThisWeek > 0 ? `+₦${revenueThisWeek.toLocaleString()} this week` : 'No revenue this week', changePositive: revenueThisWeek > 0 },
      ];

      this.topServices = (stats.top_services ?? []).map((s: any) => ({
        name: s.category_name,
        bookings: Number(s.bookings)
      }));

      this.recentPayments = (stats.recent_payments ?? []).map((p: any) => ({
        customer: `${p.first_name} ${p.last_name}`,
        amount: Number(p.amount),
        status: p.status === 'paid' ? 'Completed' : 'Pending'
      }));

      this.reviews = (stats.recent_reviews ?? []).map((r: any) => ({
        customer: `${r.first_name} ${r.last_name}`,
        comment: r.comment,
        rating: Number(r.rating),
        date: new Date(r.created_on)
      }));

      this.platformMetrics = {
        bookingGrowthPct: Number(stats.booking_growth_pct ?? 0),
        bookingsThisWeek: Number(stats.bookings_this_week ?? 0),
        newUsersThisWeek: Number(stats.new_users_this_week ?? 0),
        avgOrderValue: Number(stats.avg_order_value ?? 0),
        averageRating: stats.average_rating ?? null,
        totalReviews: Number(stats.total_reviews ?? 0)
      };
    });

    this.api.getAdminArtisans().subscribe((response: any) => {
      this.artisans = (response.artisans ?? []).slice(0, 5);
    });
  }

  logout() {
    // See dashboard.ts logout() for why this calls the backend before
    // clearing localStorage.
    this._http.post(`${API_BASE_URL}/adminAuth/logout`, {})
      .subscribe({
        next: () => {
          localStorage.removeItem('token');
          this._router.navigate(['/'])
        },
        error: () => {
          localStorage.removeItem('token');
          this._router.navigate(['/'])
        }
      })
  }
}
