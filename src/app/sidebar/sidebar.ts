import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { API_BASE_URL } from '../core/api-base';
import { getCurrentUser } from '../core/current-user';

/**
 * Shared persistent sidebar used by every "simple" page (find-artisans,
 * my-orders, settings, admin sub-pages, etc.) so users can jump between
 * sections directly instead of bouncing back to /dashboard, /artisan or
 * /admin each time. Nav links are picked based on the role in the JWT.
 * The big role dashboards (Dashboard/Admin/Artisan) keep their own
 * hand-built sidebar markup and aren't affected by this component.
 */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar implements OnInit {
  role: 'customer' | 'artisan' | 'admin' = 'customer';
  userName = '';
  isCollapsed = false;

  private http = inject(HttpClient);
  private router = inject(Router);

  ngOnInit(): void {
    const user = getCurrentUser();
    if (user) {
      this.role = user.role;
      this.userName = user.first_name;
    }
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  logout(): void {
    const endpoint = this.role === 'admin'
      ? '/adminAuth/logout'
      : this.role === 'artisan'
        ? '/artisanAuth/artisan-logout'
        : '/auth/logout';
    const redirect = this.role === 'admin'
      ? '/'
      : this.role === 'artisan'
        ? '/artisan-signin'
        : '/signin';

    this.http.post(`${API_BASE_URL}${endpoint}`, {}).subscribe({
      next: () => this.finishLogout(redirect),
      error: () => this.finishLogout(redirect)
    });
  }

  private finishLogout(redirect: string): void {
    localStorage.removeItem('token');
    this.router.navigate([redirect]);
  }
}
