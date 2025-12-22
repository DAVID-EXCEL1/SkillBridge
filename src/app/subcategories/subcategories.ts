import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-subcategories',
  imports: [CommonModule, FormsModule],
  templateUrl: './subcategories.html',
  styleUrl: './subcategories.css'
})
export class Subcategories implements OnInit {
  private _http = inject(HttpClient);
  categories: any;

  ngOnInit(): void {
    this._http.get('http://localhost/SkillBridge/categories').subscribe((response: any) => {
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

      this._http.post('http://localhost/SkillBridge/subcategories', data).subscribe((response: any) => {
        if (response.status === 200) {
          console.log(response.message);

        } else {
          console.log(response);

        }
      })
    } else {
      this.message = 'Please select a category and add at least one sub-category.';
    }
  }
}
