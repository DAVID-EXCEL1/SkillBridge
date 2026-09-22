import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../core/api.service';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-admin-artisans',
  standalone: true,
  imports: [CommonModule, Sidebar],
  templateUrl: './admin-artisans.html',
  styleUrl: './admin-artisans.css'
})
export class AdminArtisans implements OnInit {
  private api = inject(ApiService);

  artisans: any[] = [];
  loading = true;
  message = '';

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this.api.getAdminArtisans().subscribe({
      next: (response: any) => {
        this.artisans = response.artisans ?? [];
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  toggleStatus(artisanId: number) {
    this.api.toggleArtisanStatus(artisanId).subscribe({
      next: (response: any) => {
        this.message = response.message;
        this.load();
      },
      error: (err) => this.message = err?.error?.message || 'Could not update status'
    });
  }
}
