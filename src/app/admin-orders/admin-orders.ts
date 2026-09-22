import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../core/api.service';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, Sidebar],
  templateUrl: './admin-orders.html',
  styleUrl: './admin-orders.css'
})
export class AdminOrders implements OnInit {
  private api = inject(ApiService);

  orders: any[] = [];
  loading = true;

  ngOnInit(): void {
    this.api.listOrders().subscribe({
      next: (response: any) => {
        this.orders = response.orders ?? [];
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  statusBadgeClass(status: string) {
    switch (status) {
      case 'pending': return 'bg-warning text-dark';
      case 'accepted': return 'bg-info text-dark';
      case 'completed': return 'bg-success';
      case 'declined': return 'bg-danger';
      case 'cancelled': return 'bg-secondary';
      default: return 'bg-secondary';
    }
  }
}
