import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../core/api.service';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-artisan-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './artisan-profile.html',
  styleUrl: './artisan-profile.css'
})
export class ArtisanProfile implements OnInit {
  private api = inject(ApiService);

  profile: any = {};
  loading = true;
  saving = false;
  message = '';

  ngOnInit(): void {
    this.api.getArtisanProfile().subscribe({
      next: (response: any) => {
        this.profile = response.profile ?? {};
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  save() {
    this.saving = true;
    this.api.updateArtisanProfile(this.profile).subscribe({
      next: (response: any) => {
        this.saving = false;
        this.message = response.message || 'Profile updated';
      },
      error: (err) => {
        this.saving = false;
        this.message = err?.error?.message || 'Could not update profile.';
      }
    });
  }
}
