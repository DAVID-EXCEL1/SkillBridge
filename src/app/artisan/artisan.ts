import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { ApiService } from '../core/api.service';

import { API_BASE_URL } from '../core/api-base';
interface JwtPayload {
  user_id: Number,
  email: String,
  first_name: String,
  role: String,
  iat: Number,
  exp: Number

}

@Component({
  selector: 'app-artisan',
  imports: [CommonModule, RouterLink],
  templateUrl: './artisan.html',
  styleUrl: './artisan.css'
})
export class Artisan implements OnInit {
  user: String = "";
  payload: any;
  isSidebarCollapsed: boolean = false;

  // Real numbers from GET /stats/artisan, replacing the old hardcoded object.
  artisanStats: any = {
    totalJobs: 0,
    activeJobs: 0,
    completedJobs: 0,
    rating: null,
    totalEarnings: 0
  };

  recentJobs: any[] = [];
  pendingRequests: any[] = [];
  ongoingJobs: any[] = [];
  totalPendingCount = 0;
  totalOngoingCount = 0;
  recentReviews: any[] = [];
  reviewsSummary: { average_rating: number | null; total_reviews: number } = { average_rating: null, total_reviews: 0 };

  private _http = inject(HttpClient);
  private _router = inject(Router);
  private api = inject(ApiService);

  ngOnInit(): void {
    // Dashboard initialization logic can go here
    // Get the token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      this.payload = jwtDecode<JwtPayload>(token);
      
      // console.log(this.payload);
      this.user = this.payload.first_name;
    }

    this.api.getArtisanStats().subscribe((stats: any) => {
      this.artisanStats = {
        totalJobs: stats.total_jobs,
        activeJobs: stats.active_jobs,
        completedJobs: stats.completed_jobs,
        rating: stats.average_rating ?? '—',
        totalEarnings: stats.total_earnings?.toLocaleString?.() ?? stats.total_earnings
      };
    });

    this.api.listOrders().subscribe((response: any) => {
      const orders = response.orders ?? [];
      this.recentJobs = orders.slice(0, 4);
      const pending = orders.filter((o: any) => o.status === 'pending');
      const ongoing = orders.filter((o: any) => o.status === 'accepted');
      this.pendingRequests = pending.slice(0, 3);
      this.ongoingJobs = ongoing.slice(0, 3);
      this.totalPendingCount = pending.length;
      this.totalOngoingCount = ongoing.length;
    });

    if (this.payload?.user_id) {
      this.api.getReviews(this.payload.user_id).subscribe((response: any) => {
        this.recentReviews = (response.reviews ?? []).slice(0, 3);
        this.reviewsSummary = {
          average_rating: response.average_rating,
          total_reviews: response.total_reviews
        };
      });
    }
  }

  respondToRequest(orderId: number, status: 'accepted' | 'declined') {
    this.api.updateOrderStatus(orderId, status).subscribe(() => {
      this.pendingRequests = this.pendingRequests.filter(o => o.order_id !== orderId);
      this.totalPendingCount = Math.max(0, this.totalPendingCount - 1);
      if (status === 'accepted') {
        this.api.listOrders().subscribe((response: any) => {
          const orders = response.orders ?? [];
          const ongoing = orders.filter((o: any) => o.status === 'accepted');
          this.ongoingJobs = ongoing.slice(0, 3);
          this.totalOngoingCount = ongoing.length;
        });
      }
    });
  }


  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  logout() {
    // See dashboard.ts logout() for why this calls the backend before
    // clearing localStorage.
    this._http.post(`${API_BASE_URL}/artisanAuth/artisan-logout`, {})
      .subscribe({
        next: () => {
          localStorage.removeItem('token');
          this._router.navigate(['/artisan-signin']);
        },
        error: () => {
          localStorage.removeItem('token');
          this._router.navigate(['/artisan-signin']);
        }
      });
  }
}
