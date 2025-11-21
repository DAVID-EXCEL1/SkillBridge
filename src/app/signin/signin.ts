import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
@Component({
  selector: 'app-signin',
  imports: [FormsModule, ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './signin.html',
  styleUrl: './signin.css'
})
export class Signin {
  private builder = inject(FormBuilder)
  private http = inject(HttpClient)
  private router = inject(Router);
  
  showPassword: boolean = false;
  loading: boolean = false;

  signinForm = this.builder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
  })
  message: string | null = null;
  messageType: 'success' | 'danger' | 'warning' | 'info' | null = null;
  messageTitle?: string | null = null;

  closeMessage() {
    this.message = null;
    this.messageType = null;
    this.messageTitle = null;
  }
  
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  
  login() {
    if (!this.signinForm.valid) {
      this.message = 'Please fill all fields correctly';
      this.messageType = 'danger';
      this.messageTitle = 'Validation Error';
      return;
    }

    this.loading = true;
    this.http.post('http://localhost/SkillBridge/auth/signin', this.signinForm.value)
      .subscribe({
        next: (response: any) => {
          this.loading = false;
          if (response.status === 200) {
            localStorage.setItem('token', response.token);
            this.message = 'Login successful!';
            this.messageType = 'success';
            this.messageTitle = 'Success';
            
            setTimeout(() => {
              this.router.navigate(['/dashboard']);
            }, 1500);
          } else {
            this.message = response.message || 'Login failed';
            this.messageType = 'danger';
            this.messageTitle = 'Error';
          }
        },
        error: (error) => {
          this.loading = false;
          this.message = 'An error occurred. Please try again.';
          this.messageType = 'danger';
          this.messageTitle = 'Error';
        }
      });
  }
}
