import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../core/api.service';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-book-artisan',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, Sidebar],
  templateUrl: './book-artisan.html',
  styleUrl: './book-artisan.css'
})
export class BookArtisan implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(ApiService);

  artisan_id!: number;
  category_id?: number;

  order_description = '';
  price?: number;
  currency = 'NGN';
  notes = '';
  scheduled_for = '';

  submitting = false;
  message = '';

  ngOnInit(): void {
    this.artisan_id = Number(this.route.snapshot.paramMap.get('artisanId'));
    const cat = this.route.snapshot.queryParamMap.get('category_id');
    this.category_id = cat ? Number(cat) : undefined;
  }

  submit() {
    if (!this.order_description.trim()) {
      this.message = 'Please describe what you need done.';
      return;
    }

    this.submitting = true;
    this.api.createOrder({
      artisan_id: this.artisan_id,
      category_id: this.category_id,
      order_description: this.order_description,
      price: this.price,
      currency: this.currency,
      notes: this.notes,
      scheduled_for: this.scheduled_for || undefined
    }).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/my-orders']);
      },
      error: (err) => {
        this.submitting = false;
        this.message = err?.error?.message || 'Could not send this booking. Try again.';
      }
    });
  }
}
