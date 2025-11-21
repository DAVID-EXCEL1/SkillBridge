import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {Router, RouterLink } from "@angular/router";

@Component({
  selector: 'app-artisan-signup',
  imports: [FormsModule, ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './artisan-signup.html',
  styleUrl: './artisan-signup.css'
})
export class ArtisanSignup {


  private http = inject(HttpClient);
  private builder = inject(FormBuilder);
  private router = inject(Router);
  artisans: any = [];
  sameAs: boolean = false;
  showPassword: boolean = false;
  loading: boolean = false;

  ArtisanSignupForm = this.builder.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    ]],
    confirm_password: ['', Validators.required]
  });


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

    confirmPassword() {
    this.sameAs = this.ArtisanSignupForm.value.password === this.ArtisanSignupForm.value.confirm_password;
  }
  
  register() {
    if (!this.sameAs || !this.ArtisanSignupForm.valid) {
      this.message = 'Please fill all fields correctly and ensure passwords match';
      this.messageType = 'danger';
      this.messageTitle = 'Validation Error';
      return;
    }

    this.loading = true;
    this.http.post('http://localhost/SkillBridge/artisanAuth/artisan-signup', this.ArtisanSignupForm.value)
      .subscribe({
        next: (response: any) => {
          this.loading = false;
          if (response.status === 200) {
            this.message = response.message || 'Account created successfully!';
            this.messageType = 'success';
            this.messageTitle = 'Success';
            
            setTimeout(() => {
              this.router.navigate(['/artisan-signin']);
            }, 2000);
          } else {
            this.message = response.message || 'Registration failed';
            this.messageType = 'danger';
            this.messageTitle = 'Error';
            console.log(this.message);
            
          }
        },
        error: (error) => {
          this.loading = false;
          this.message = 'An error occurred. Please try again.';
          this.messageType = 'danger';
          this.messageTitle = 'Error';
          console.log(error);
          
        }
      });
  }


}
