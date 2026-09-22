import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../core/api.service';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink, Sidebar],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css'
})
export class Favorites implements OnInit {
  private api = inject(ApiService);
  private router = inject(Router);

  favorites: any[] = [];
  loading = true;

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this.api.listFavorites().subscribe({
      next: (response: any) => {
        this.favorites = response.favorites ?? [];
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  remove(artisanId: number) {
    this.api.removeFavorite(artisanId).subscribe(() => this.load());
  }

  book(artisanId: number) {
    this.router.navigate(['/book-artisan', artisanId]);
  }
}
