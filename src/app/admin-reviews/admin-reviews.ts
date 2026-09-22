import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../core/api.service';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-admin-reviews',
  standalone: true,
  imports: [CommonModule, Sidebar],
  templateUrl: './admin-reviews.html',
  styleUrl: './admin-reviews.css'
})
export class AdminReviews implements OnInit {
  private api = inject(ApiService);

  reviews: any[] = [];
  loading = true;

  ngOnInit(): void {
    this.api.getAllReviews().subscribe({
      next: (response: any) => {
        this.reviews = response.reviews ?? [];
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
}
