import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../core/api.service';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-artisan-earnings',
  standalone: true,
  imports: [CommonModule, Sidebar],
  templateUrl: './artisan-earnings.html',
  styleUrl: './artisan-earnings.css'
})
export class ArtisanEarnings implements OnInit {
  private api = inject(ApiService);

  payments: any[] = [];
  loading = true;

  get total(): number {
    return this.payments.reduce((sum, p) => sum + Number(p.amount), 0);
  }

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
