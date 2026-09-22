import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../core/api.service';
import { Sidebar } from '../sidebar/sidebar';
import { getCurrentUser } from '../core/current-user';

@Component({
  selector: 'app-artisan-reviews',
  standalone: true,
  imports: [CommonModule, Sidebar],
  templateUrl: './artisan-reviews.html',
  styleUrl: './artisan-reviews.css'
})
export class ArtisanReviews implements OnInit {
  private api = inject(ApiService);

  reviews: any[] = [];
  averageRating: number | null = null;
  totalReviews = 0;
  loading = true;

  ngOnInit(): void {
    const user = getCurrentUser();
    if (!user) return;

    this.api.getReviews(user.user_id).subscribe({
      next: (response: any) => {
        this.reviews = response.reviews ?? [];
        this.averageRating = response.average_rating;
        this.totalReviews = response.total_reviews;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
}
