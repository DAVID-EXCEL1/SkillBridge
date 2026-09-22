import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../core/api.service';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, Sidebar],
  templateUrl: './my-orders.html',
  styleUrl: './my-orders.css'
})
export class MyOrders implements OnInit {
  private api = inject(ApiService);

  orders: any[] = [];
  loading = true;
  actionMessage = '';

  // order_id currently open for "leave a review"
  reviewingOrderId: number | null = null;
  reviewRating = 5;
  reviewComment = '';

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

  cancel(orderId: number) {
    this.api.updateOrderStatus(orderId, 'cancelled').subscribe({
      next: () => this.load(),
      error: (err) => this.actionMessage = err?.error?.message || 'Could not cancel order'
    });
  }

  pay(orderId: number, amount: number) {
    this.api.recordPayment(orderId, amount, 'manual').subscribe({
      next: () => {
        this.actionMessage = 'Payment recorded';
        this.load();
      },
      error: (err) => this.actionMessage = err?.error?.message || 'Could not record payment'
    });
  }

  openReview(orderId: number) {
    this.reviewingOrderId = orderId;
    this.reviewRating = 5;
    this.reviewComment = '';
  }

  submitReview() {
    if (!this.reviewingOrderId) return;
    this.api.createReview(this.reviewingOrderId, this.reviewRating, this.reviewComment).subscribe({
      next: (response: any) => {
        this.actionMessage = response.message || 'Review submitted';
        this.reviewingOrderId = null;
      },
      error: (err) => this.actionMessage = err?.error?.message || 'Could not submit review'
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
