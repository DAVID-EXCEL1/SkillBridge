import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../core/api.service';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-artisan-orders',
  standalone: true,
  imports: [CommonModule, RouterLink, Sidebar],
  templateUrl: './artisan-orders.html',
  styleUrl: './artisan-orders.css'
})
export class ArtisanOrders implements OnInit {
  private api = inject(ApiService);

  orders: any[] = [];
  loading = true;
  actionMessage = '';

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this.api.listOrders().subscribe({
      next: (response: any) => {
        this.orders = response.orders ?? [];
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  respond(orderId: number, status: 'accepted' | 'declined' | 'completed') {
    this.api.updateOrderStatus(orderId, status).subscribe({
      next: () => this.load(),
      error: (err) => this.actionMessage = err?.error?.message || 'Could not update order'
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
