import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../core/api.service';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-find-artisans',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, Sidebar],
  templateUrl: './find-artisans.html',
  styleUrl: './find-artisans.css'
})
export class FindArtisans implements OnInit {
  private api = inject(ApiService);
  private router = inject(Router);

  categories: any[] = [];
  category_id: number = 0;
  artisans: any[] = [];
  loading = false;
  searched = false;

  // artisan_id -> { average_rating, total_reviews, reviews, open }
  reviewsByArtisan: Record<number, any> = {};
  favoriteIds = new Set<number>();

  ngOnInit(): void {
    this.api.getCategories().subscribe((response: any) => {
      this.categories = response.categories ?? [];
    });

    this.api.listFavorites().subscribe({
      next: (response: any) => {
        this.favoriteIds = new Set((response.favorites ?? []).map((f: any) => f.artisan_id));
      },
      error: () => {}
    });
  }

  toggleFavorite(artisanId: number) {
    if (this.favoriteIds.has(artisanId)) {
      this.api.removeFavorite(artisanId).subscribe(() => this.favoriteIds.delete(artisanId));
    } else {
      this.api.addFavorite(artisanId).subscribe(() => this.favoriteIds.add(artisanId));
    }
  }

  browse() {
    if (!this.category_id) return;
    this.loading = true;
    this.searched = true;
    this.artisans = [];
    this.api.getArtisansByCategory(this.category_id).subscribe({
      next: (response: any) => {
        this.artisans = response.artisans ?? [];
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  toggleReviews(artisanId: number) {
    const existing = this.reviewsByArtisan[artisanId];
    if (existing) {
      existing.open = !existing.open;
      return;
    }
    this.api.getReviews(artisanId).subscribe((response: any) => {
      this.reviewsByArtisan[artisanId] = {
        average_rating: response.average_rating,
        total_reviews: response.total_reviews,
        reviews: response.reviews ?? [],
        open: true
      };
    });
  }

  book(artisanId: number) {
    this.router.navigate(['/book-artisan', artisanId], { queryParams: { category_id: this.category_id } });
  }
}
