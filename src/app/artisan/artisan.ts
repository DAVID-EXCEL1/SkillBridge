import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { jwtDecode } from 'jwt-decode';


interface JwtPayload {
  user_id: Number,
  email: String,
  first_name: String,
  role: String,
  iat: Number,
  exp: Number

}

@Component({
  selector: 'app-artisan',
  imports: [CommonModule, RouterLink],
  templateUrl: './artisan.html',
  styleUrl: './artisan.css'
})
export class Artisan implements OnInit {
  user: String = "";
  payload: any;
  isSidebarCollapsed: boolean = false;
  dashboardStats: any = {
    totalProjects: 12,
    ongoingProjects: 4,
    completedProjects: 8,
    totalSpent: '560,000'
  };
  artisanStats: any = {
    totalJobs: 47,
    activeJobs: 4,
    rating: '4.9',
    totalEarnings: '1,240,000'
  };

  private _http = inject(HttpClient);
  private _router = inject(Router);

  ngOnInit(): void {
    // Dashboard initialization logic can go here
    // Get the token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      this.payload = jwtDecode<JwtPayload>(token);
      
      // console.log(this.payload);
      this.user = this.payload.first_name;
    }
  }


  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  logout() {
    // Clear the token from localStorage
    localStorage.removeItem('token');
    this._http.post('http://localhost/SkillBridge/artisanAuth/artisan-logout', { artisan_id: this.payload.user_id })
      .subscribe((response) => {
        // route to signin page after logout
        this._router.navigate(['/artisan-signin']);
        console.log(response);
        
      });
  }
}
