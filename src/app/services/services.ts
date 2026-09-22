import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router";
import { ApiService } from '../core/api.service';

@Component({
  selector: 'app-services',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './services.html',
  styleUrl: './services.css'
})
export class Services implements OnInit {
  private api = inject(ApiService);

  categories: any[] = [];
  subcategories: any[] = [];
  category_id: number = 0;
  selectedSubCategoryIds: number[] = [];
  myServices: any[] = [];
  isSidebarCollapsed = false;
  message = '';
  saving = false;

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  ngOnInit(): void {
    this.api.getCategories().subscribe((response: any) => {
      this.categories = response.categories ?? [];
    });

    this.refreshMyServices();
  }

  private refreshMyServices() {
    this.api.getMyServices().subscribe({
      next: (response: any) => this.myServices = response.services ?? [],
      error: () => {}
    });
  }

  // Fired when the category dropdown changes — loads that category's sub-categories
  getid() {
    this.selectedSubCategoryIds = [];
    this.subcategories = [];
    if (!this.category_id) {
      return;
    }
    this.api.getSubCategories(this.category_id).subscribe((response: any) => {
      this.subcategories = response.subcategories ?? [];
    });
  }

  // Checkbox toggle — adds/removes the sub-category id (not name) since
  // that's what the backend needs to store the artisan_services_tb row.
  select(event: any, subCategoryId: number) {
    const checked = event.target.checked;
    if (checked) {
      if (!this.selectedSubCategoryIds.includes(subCategoryId)) {
        this.selectedSubCategoryIds.push(subCategoryId);
      }
    } else {
      this.selectedSubCategoryIds = this.selectedSubCategoryIds.filter(id => id !== subCategoryId);
    }
  }

  saveServices() {
    if (!this.category_id || this.selectedSubCategoryIds.length === 0) {
      this.message = 'Please select a category and at least one sub-category.';
      return;
    }

    this.saving = true;
    this.api.saveArtisanServices(this.category_id, this.selectedSubCategoryIds).subscribe({
      next: (response: any) => {
        this.saving = false;
        this.message = response.message || 'Services saved';
        this.refreshMyServices();
        this.selectedSubCategoryIds = [];
      },
      error: (err) => {
        this.saving = false;
        this.message = err?.error?.message || 'Could not save services. Try again.';
      }
    });
  }
}
