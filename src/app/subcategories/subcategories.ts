import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { API_BASE_URL } from '../core/api-base';
@Component({
  selector: 'app-subcategories',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './subcategories.html',
  styleUrl: './subcategories.css'
})
export class Subcategories implements OnInit {
  private _http = inject(HttpClient);
  categories: any;
  isSidebarCollapsed = false;

  toggleSidebar() { this.isSidebarCollapsed = !this.isSidebarCollapsed; }

  ngOnInit(): void {
    this._http.get(`${API_BASE_URL}/categories`).subscribe((response: any) => {
      if (response.status === 200) {

        this.categories = response.categories;
        console.log(this.categories);

      } else {
        console.log(response);
      }
    })
  }

  category_id: number = 0;
  added_items: any = [];
  add(event: any) {
    this.added_items.push(event.target.value);

  }

  message = '';
  addSubCategories() {
    if (this.category_id && this.added_items.length > 0) {
      // Send data to the backend
      const data = { category_id: this.category_id, subcategories: this.added_items };

      this._http.post(`${API_BASE_URL}/subcategories`, data).subscribe({
        next: (response: any) => {
          this.message = response.message || 'Subcategories saved';
          this.added_items = [];
        },
        error: (err) => {
          this.message = err?.error?.message || 'Could not save subcategories. Try again.';
        }
      })
    } else {
      this.message = 'Please select a category and add at least one sub-category.';
    }
  }
}
