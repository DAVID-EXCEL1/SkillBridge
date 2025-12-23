import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-services',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './services.html',
  styleUrl: './services.css'
})
export class Services implements OnInit {
  private _http = inject(HttpClient);

  categories: any = [];
  subcategories: any = [];
  category_id: number = 0;
  selectedSubCategories: any = []
  isSidebarCollapsed = false;

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  ngOnInit(): void {
    this._http.get('http://localhost/SkillBridge/categories').subscribe((response: any) => {
      this.categories = response.categories;
      console.log(this.categories);


    })

  }
  getid() {
    console.log(this.category_id);
    this._http.post('http://localhost/SkillBridge/subcategoriess', { 'category_id': this.category_id })
      .subscribe((response: any) => {
        console.log(response);
        if (response.status === 200) {
          console.log(response);

          this.subcategories = response.subcategories
          console.log(this.subcategories);

        } else {

        }

      })
  }
  select(event: any) {
    this.selectedSubCategories.push(event.target.value);
    console.log(this.selectedSubCategories);
  }

  
}
