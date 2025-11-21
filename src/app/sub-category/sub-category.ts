import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

interface Category {
  id?: number;
  name: string;
  subCategories: string[];
  expanded?: boolean;
  createdAt?: Date;
}

@Component({
  selector: 'app-sub-category',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './sub-category.html',
  styleUrl: './sub-category.css'
})
export class SubCategory implements OnInit {
  private _http = inject(HttpClient);
  private _router = inject(Router);
  
  isSidebarCollapsed: boolean = false;

  // Initial categories
  categories: Category[] = [
    { name: 'Tailoring', subCategories: [], expanded: false },
    { name: 'Plumbing', subCategories: [], expanded: false },
    { name: 'Event Planning', subCategories: [], expanded: false },
    { name: 'Catering Services', subCategories: [], expanded: false },
    { name: 'Hairdressing', subCategories: [], expanded: false },
    { name: 'Electronic Repairs', subCategories: [], expanded: false },
    { name: 'Painting', subCategories: [], expanded: false },
    { name: 'Makeup', subCategories: [], expanded: false },
    { name: 'Barbing', subCategories: [], expanded: false },
    { name: 'Carpentry', subCategories: [], expanded: false },
    { name: 'Welding', subCategories: [], expanded: false },
    { name: 'Bricklaying / Masonry', subCategories: [], expanded: false },
    { name: 'Auto Mechanic', subCategories: [], expanded: false },
    { name: 'Electrical Works', subCategories: [], expanded: false },
    { name: 'Tiling', subCategories: [], expanded: false },
    { name: 'POP Ceiling Design', subCategories: [], expanded: false },
    { name: 'Interior Decoration', subCategories: [], expanded: false },
    { name: 'Laundry & Dry Cleaning', subCategories: [], expanded: false },
    { name: 'Shoe Making', subCategories: [], expanded: false },
    { name: 'Fashion Designing', subCategories: [], expanded: false },
    { name: 'Photography', subCategories: [], expanded: false },
    { name: 'Videography', subCategories: [], expanded: false },
    { name: 'Driving School', subCategories: [], expanded: false },
    { name: 'Generator Repairs', subCategories: [], expanded: false },
    { name: 'AC and Refrigerator Repairs', subCategories: [], expanded: false },
    { name: 'Bead Making', subCategories: [], expanded: false },
    { name: 'Furniture Making', subCategories: [], expanded: false },
    { name: 'House Cleaning Services', subCategories: [], expanded: false },
    { name: 'Landscaping / Gardening', subCategories: [], expanded: false },
    { name: 'Printing & Branding', subCategories: [], expanded: false },
    { name: 'Solar Installation', subCategories: [], expanded: false },
    { name: 'Barbing Salon', subCategories: [], expanded: false },
    { name: 'Car Wash Services', subCategories: [], expanded: false },
    { name: 'Event Decoration', subCategories: [], expanded: false },
    { name: 'Cobbler / Leather Works', subCategories: [], expanded: false },
    { name: 'Metal Fabrication', subCategories: [], expanded: false },
    { name: 'Baking & Pastry', subCategories: [], expanded: false },
    { name: 'Painting & Wall Design', subCategories: [], expanded: false },
    { name: 'CCTV / Security Installation', subCategories: [], expanded: false }
  ];

  filteredCategories: Category[] = [];
  newSubCategory: { [key: number]: string } = {};
  
  // Search and filter
  searchTerm: string = '';
  sortBy: string = 'name';
  viewMode: 'grid' | 'list' = 'grid';
  
  // Modal
  showModal: boolean = false;
  isEditing: boolean = false;
  modalCategoryName: string = '';
  modalSubCategories: string = '';
  editingIndex: number = -1;
  
  // Stats
  totalArtisans: number = 0;

  // Color palette for category icons
  private colors = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)',
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)'
  ];

  ngOnInit(): void {
    this.filteredCategories = [...this.categories];
    this.loadCategoriesFromBackend();
    this.loadStats();
  }

  // Load categories from backend
  loadCategoriesFromBackend() {
    this._http.get<any[]>('http://localhost/SkillBridge/categories.php')
      .subscribe({
        next: (data) => {
          if (data && data.length > 0) {
            this.categories = data.map((cat: any) => ({
              id: cat.id,
              name: cat.name,
              subCategories: cat.sub_categories || [],
              expanded: false,
              createdAt: cat.created_at
            }));
            this.filteredCategories = [...this.categories];
          }
        },
        error: (err) => console.error('Error loading categories:', err)
      });
  }

  // Load statistics
  loadStats() {
    this._http.get<any>('http://localhost/SkillBridge/stats.php')
      .subscribe({
        next: (data) => {
          this.totalArtisans = data.total_artisans || 0;
        },
        error: (err) => console.error('Error loading stats:', err)
      });
  }

  // Filter categories based on search
  filterCategories() {
    const term = this.searchTerm.toLowerCase();
    this.filteredCategories = this.categories.filter(cat =>
      cat.name.toLowerCase().includes(term) ||
      cat.subCategories.some(sub => sub.toLowerCase().includes(term))
    );
  }

  // Sort categories
  sortCategories() {
    switch (this.sortBy) {
      case 'name':
        this.filteredCategories.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'subcategories':
        this.filteredCategories.sort((a, b) => b.subCategories.length - a.subCategories.length);
        break;
      case 'recent':
        this.filteredCategories.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        break;
    }
  }

  // Toggle category expansion
  toggleCategory(index: number) {
    const actualIndex = this.categories.findIndex(
      cat => cat.name === this.filteredCategories[index].name
    );
    this.categories[actualIndex].expanded = !this.categories[actualIndex].expanded;
    this.filteredCategories[index].expanded = this.categories[actualIndex].expanded;
  }

  // Add sub-category
  addSubCategory(index: number) {
    const subCat = this.newSubCategory[index]?.trim();
    if (!subCat) return;

    const actualIndex = this.categories.findIndex(
      cat => cat.name === this.filteredCategories[index].name
    );

    this.categories[actualIndex].subCategories.push(subCat);
    this.filteredCategories[index].subCategories.push(subCat);
    this.newSubCategory[index] = '';

    // Save to backend
    this.saveSubCategoryToBackend(this.categories[actualIndex]);
  }

  // Edit sub-category
  editSubCategory(catIndex: number, subIndex: number) {
    const currentSub = this.filteredCategories[catIndex].subCategories[subIndex];
    const newName = prompt('Edit sub-category:', currentSub);
    
    if (newName && newName.trim() !== '') {
      const actualIndex = this.categories.findIndex(
        cat => cat.name === this.filteredCategories[catIndex].name
      );
      
      this.categories[actualIndex].subCategories[subIndex] = newName.trim();
      this.filteredCategories[catIndex].subCategories[subIndex] = newName.trim();
      
      this.saveSubCategoryToBackend(this.categories[actualIndex]);
    }
  }

  // Delete sub-category
  deleteSubCategory(catIndex: number, subIndex: number) {
    if (confirm('Are you sure you want to delete this sub-category?')) {
      const actualIndex = this.categories.findIndex(
        cat => cat.name === this.filteredCategories[catIndex].name
      );
      
      this.categories[actualIndex].subCategories.splice(subIndex, 1);
      this.filteredCategories[catIndex].subCategories.splice(subIndex, 1);
      
      this.saveSubCategoryToBackend(this.categories[actualIndex]);
    }
  }

  // Save sub-category to backend
  saveSubCategoryToBackend(category: Category) {
    this._http.post('http://localhost/SkillBridge/update-category.php', category)
      .subscribe({
        next: (response) => console.log('Category updated successfully'),
        error: (err) => console.error('Error updating category:', err)
      });
  }

  // Modal operations
  openAddCategoryModal() {
    this.showModal = true;
    this.isEditing = false;
    this.modalCategoryName = '';
    this.modalSubCategories = '';
  }

  editCategory(category: Category) {
    this.showModal = true;
    this.isEditing = true;
    this.modalCategoryName = category.name;
    this.modalSubCategories = category.subCategories.join('\n');
    this.editingIndex = this.categories.findIndex(cat => cat.name === category.name);
  }

  closeModal() {
    this.showModal = false;
    this.modalCategoryName = '';
    this.modalSubCategories = '';
    this.editingIndex = -1;
  }

  saveCategory() {
    if (!this.modalCategoryName.trim()) {
      alert('Please enter a category name');
      return;
    }

    const subCats = this.modalSubCategories
      .split('\n')
      .map(s => s.trim())
      .filter(s => s !== '');

    if (this.isEditing && this.editingIndex !== -1) {
      // Update existing category
      this.categories[this.editingIndex].name = this.modalCategoryName.trim();
      this.categories[this.editingIndex].subCategories = subCats;
      
      this._http.post('http://localhost/SkillBridge/update-category.php', this.categories[this.editingIndex])
        .subscribe({
          next: () => {
            this.filterCategories();
            this.closeModal();
          },
          error: (err) => console.error('Error updating category:', err)
        });
    } else {
      // Add new category
      const newCategory: Category = {
        name: this.modalCategoryName.trim(),
        subCategories: subCats,
        expanded: false,
        createdAt: new Date()
      };

      this._http.post('http://localhost/SkillBridge/add-category.php', newCategory)
        .subscribe({
          next: (response: any) => {
            newCategory.id = response.id;
            this.categories.push(newCategory);
            this.filterCategories();
            this.closeModal();
          },
          error: (err) => console.error('Error adding category:', err)
        });
    }
  }

  deleteCategory(category: Category) {
    if (confirm(`Are you sure you want to delete "${category.name}" and all its sub-categories?`)) {
      const index = this.categories.findIndex(cat => cat.name === category.name);
      
      if (category.id) {
        this._http.delete(`http://localhost/SkillBridge/delete-category.php?id=${category.id}`)
          .subscribe({
            next: () => {
              this.categories.splice(index, 1);
              this.filterCategories();
            },
            error: (err) => console.error('Error deleting category:', err)
          });
      } else {
        this.categories.splice(index, 1);
        this.filterCategories();
      }
    }
  }

  // Helper functions
  getTotalSubCategories(): number {
    return this.categories.reduce((total, cat) => total + cat.subCategories.length, 0);
  }

  getRandomColor(index: number): string {
    return this.colors[index % this.colors.length];
  }

  getCategoryIcon(categoryName: string): string {
    const iconMap: { [key: string]: string } = {
      'Tailoring': 'bi bi-scissors',
      'Plumbing': 'bi bi-wrench',
      'Event Planning': 'bi bi-calendar-event',
      'Catering Services': 'bi bi-cup-hot',
      'Hairdressing': 'bi bi-person-bounding-box',
      'Electronic Repairs': 'bi bi-laptop',
      'Painting': 'bi bi-palette',
      'Makeup': 'bi bi-emoji-smile',
      'Barbing': 'bi bi-scissors',
      'Carpentry': 'bi bi-hammer',
      'Welding': 'bi bi-fire',
      'Bricklaying / Masonry': 'bi bi-house',
      'Auto Mechanic': 'bi bi-car-front',
      'Electrical Works': 'bi bi-lightning-charge',
      'Tiling': 'bi bi-grid-3x3',
      'POP Ceiling Design': 'bi bi-house-door',
      'Interior Decoration': 'bi bi-brush',
      'Laundry & Dry Cleaning': 'bi bi-droplet',
      'Shoe Making': 'bi bi-boot',
      'Fashion Designing': 'bi bi-bag',
      'Photography': 'bi bi-camera',
      'Videography': 'bi bi-camera-video',
      'Driving School': 'bi bi-speedometer',
      'Generator Repairs': 'bi bi-gear',
      'AC and Refrigerator Repairs': 'bi bi-snow',
      'Bead Making': 'bi bi-gem',
      'Furniture Making': 'bi bi-house-door',
      'House Cleaning Services': 'bi bi-house-check',
      'Landscaping / Gardening': 'bi bi-tree',
      'Printing & Branding': 'bi bi-printer',
      'Solar Installation': 'bi bi-sun',
      'Barbing Salon': 'bi bi-scissors',
      'Car Wash Services': 'bi bi-car-front',
      'Event Decoration': 'bi bi-balloon',
      'Cobbler / Leather Works': 'bi bi-bag',
      'Metal Fabrication': 'bi bi-tools',
      'Baking & Pastry': 'bi bi-cake',
      'Painting & Wall Design': 'bi bi-paint-bucket',
      'CCTV / Security Installation': 'bi bi-camera-video'
    };

    return iconMap[categoryName] || 'bi bi-gear-fill';
  }
  
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  
  logout() {
    localStorage.removeItem('token');
    this._router.navigate(['/signin']);
  }
  
  getRandomGradient(index: number): string {
    const gradients = [
      'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
      'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
      'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
      'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    ];
    return gradients[index % gradients.length];
  }
  
  getPopularCount(): number {
    // Return categories with more than 3 subcategories
    return this.categories.filter(cat => cat.subCategories.length > 3).length;
  }
}
