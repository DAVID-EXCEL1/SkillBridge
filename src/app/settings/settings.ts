import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../core/api.service';
import { Sidebar } from '../sidebar/sidebar';
import { getCurrentUser } from '../core/current-user';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class Settings {
  private api = inject(ApiService);

  myRole = getCurrentUser()?.role;

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  saving = false;
  message = '';
  success = false;

  changePassword() {
    this.message = '';
    if (this.newPassword.length < 6) {
      this.message = 'New password must be at least 6 characters.';
      this.success = false;
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.message = 'New password and confirmation do not match.';
      this.success = false;
      return;
    }

    this.saving = true;
    const call = this.myRole === 'artisan'
      ? this.api.changeArtisanPassword(this.currentPassword, this.newPassword)
      : this.myRole === 'admin'
        ? this.api.changeAdminPassword(this.currentPassword, this.newPassword)
        : this.api.changeCustomerPassword(this.currentPassword, this.newPassword);

    call.subscribe({
      next: (response: any) => {
        this.saving = false;
        this.success = true;
        this.message = response.message || 'Password changed';
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
      },
      error: (err) => {
        this.saving = false;
        this.success = false;
        this.message = err?.error?.message || 'Could not change password.';
      }
    });
  }
}
