import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../core/api.service';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-admin-payments',
  standalone: true,
  imports: [CommonModule, Sidebar],
  templateUrl: './admin-payments.html',
  styleUrl: './admin-payments.css'
})
export class AdminPayments implements OnInit {
  private api = inject(ApiService);

  payments: any[] = [];
  loading = true;

  ngOnInit(): void {
    this.api.listPayments().subscribe({
      next: (response: any) => {
        this.payments = response.payments ?? [];
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
}
