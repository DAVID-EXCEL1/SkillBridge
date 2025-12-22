import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-signin',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './admin-signin.html',
  styleUrl: './admin-signin.css'
})
export class AdminSignin {
  private http = inject(HttpClient)
  private builder = inject(FormBuilder)
  private router = inject(Router)

  loginForm: FormGroup = this.builder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  showPassword = false;
  loading = false;
  message?: string;
  messageType?: 'success' | 'danger' | 'warning' | 'info';
  messageTitle?: string;

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  hasError(controlName: string): boolean {
    const control = this.loginForm.get(controlName);
    return !!(control && control.errors && control.touched);
  }

  isValid(controlName: string): boolean {
    const control = this.loginForm.get(controlName);
    return !!(control && control.touched && !control.errors);
  }

  closeMessage(): void {
    this.message = undefined;
    this.messageType = undefined;
    this.messageTitle = undefined;
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.http.post('http://localhost/SkillBridge/adminAuth/admin-signin', this.loginForm.value)
      .subscribe({
        next: (response: any) => {
          this.loading = false;
          if (response.status === 200) {
            localStorage.setItem('token', response.token);
            this.messageType = 'success';
            this.messageTitle = 'Login Successful';
            this.message = 'Redirecting to dashboard...';
            setTimeout(() => this.router.navigate(['/admin-dashboard']), 800);
          } else {
            this.messageType = 'danger';
            this.messageTitle = 'Login Failed';
            this.message = response.message || 'Invalid credentials';
          }
        },
        error: (err) => {
          this.loading = false;
          this.messageType = 'danger';
          this.messageTitle = 'Network Error';
          this.message = 'Unable to reach server';
          console.error(err);
        }
      });
  }
}
