import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { ApiService } from '../core/api.service';

import { API_BASE_URL } from '../core/api-base';
export interface JwtPayload {
  user_id: Number,
  email:String,
  first_name:String,
  role:String,
  iat: Number,
  exp: Number
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  user:String = "";
  payload: any;
  isSidebarCollapsed: boolean = false;

  // Real numbers from GET /stats/customer, replacing the old hardcoded object.
  dashboardStats: any = {
    totalProjects: 0,
    ongoingProjects: 0,
    completedProjects: 0,
    totalSpent: 0
  };

  recentOrders: any[] = [];
  topArtisans: any[] = [];

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

    this.api.getCustomerStats().subscribe((stats: any) => {
      this.dashboardStats = {
        totalProjects: stats.total_orders,
        ongoingProjects: stats.ongoing_orders,
        completedProjects: stats.completed_orders,
        totalSpent: stats.total_spent?.toLocaleString?.() ?? stats.total_spent
      };
    });

    this.api.listOrders().subscribe((response: any) => {
      this.recentOrders = (response.orders ?? []).slice(0, 4);
    });

    this.api.getTopArtisans().subscribe((response: any) => {
      this.topArtisans = response.artisans ?? [];
    });
  }

  messageArtisan(artisanId: number) {
    this._router.navigate(['/messages'], { queryParams: { with: artisanId } });
  }
  
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  logout() {
    // Call the backend BEFORE clearing localStorage — the interceptor
    // reads the token from localStorage to attach the Authorization
    // header, and logoutCustomer() now requires that header. Clearing
    // the token first (as this used to) would send an unauthenticated
    // request that gets rejected.
    this._http.post(`${API_BASE_URL}/auth/logout`, {})
    .subscribe({
      next: () => {
        localStorage.removeItem('token');
        this._router.navigate(['/signin']);
      },
      error: () => {
        // Even if the backend call fails, still clear the local session
        // so the user isn't stuck unable to log out.
        localStorage.removeItem('token');
        this._router.navigate(['/signin']);
      }
    });
  }
}
