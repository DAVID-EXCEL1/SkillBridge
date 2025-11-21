import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class Admin implements OnInit {
  isSidebarCollapsed: boolean = false;
  
  // ===== Overview Stats =====
  adminStats = [
    { title: 'Total Artisans', value: 83, icon: 'bi bi-person-workspace', color: 'text-primary' },
    { title: 'Total Customers', value: 154, icon: 'bi bi-people-fill', color: 'text-success' },
    { title: 'Total Orders', value: 240, icon: 'bi bi-cart-fill', color: 'text-warning' },
    { title: 'Total Revenue', value: '₦725,000', icon: 'bi bi-cash-stack', color: 'text-danger' },
  ];

  // ===== Artisan List =====
  artisans = [
    { name: 'Samuel Bright', skill: 'Carpentry', email: 'samuel@example.com', phone: '08123456789', status: 'Active' },
    { name: 'Faith Adeola', skill: 'Tailoring', email: 'faith@example.com', phone: '08122233344', status: 'Active' },
    { name: 'Mike Smith', skill: 'Electrical', email: 'mike@example.com', phone: '08155566777', status: 'Suspended' },
  ];

  // ===== Top Services =====
  topServices = [
    { name: 'Plumbing', bookings: 45 },
    { name: 'Electrical Repairs', bookings: 37 },
    { name: 'Painting', bookings: 32 },
    { name: 'Home Cleaning', bookings: 28 },
  ];

  // ===== Recent Payments =====
  recentPayments = [
    { customer: 'John Doe', amount: 12000, status: 'Completed' },
    { customer: 'Jane Ade', amount: 8000, status: 'Pending' },
    { customer: 'Peter Obi', amount: 15000, status: 'Completed' },
  ];

  // ===== Recent Reviews =====
  reviews = [
    { customer: 'John Doe', comment: 'Excellent service!', rating: 5, date: new Date('2025-10-20') },
    { customer: 'Mary Johnson', comment: 'Very professional and timely.', rating: 4, date: new Date('2025-10-22') },
    { customer: 'Tayo Bello', comment: 'Good experience overall.', rating: 4, date: new Date('2025-10-25') },
  ];

  constructor() { }

  ngOnInit(): void {
    console.log('Admin dashboard loaded successfully ✅');
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  logout() {
    // Implement logout logic
    console.log('Logging out...');
  }
}
