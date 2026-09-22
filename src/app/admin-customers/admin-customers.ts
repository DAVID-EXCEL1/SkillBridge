import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../core/api.service';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-admin-customers',
  standalone: true,
  imports: [CommonModule, Sidebar],
  templateUrl: './admin-customers.html',
  styleUrl: './admin-customers.css'
})
export class AdminCustomers implements OnInit {
  private api = inject(ApiService);

  customers: any[] = [];
  loading = true;
  message = '';

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this.api.getAdminCustomers().subscribe({
      next: (response: any) => {
        this.customers = response.customers ?? [];
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  toggleStatus(customerId: number) {
    this.api.toggleCustomerStatus(customerId).subscribe({
      next: (response: any) => {
        this.message = response.message;
        this.load();
      },
      error: (err) => this.message = err?.error?.message || 'Could not update status'
    });
  }
}
