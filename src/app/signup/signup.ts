import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: 'app-signup',
  imports: [FormsModule, ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup{


  private http = inject(HttpClient)
  private builder = inject(FormBuilder)
  private router = inject(Router);
  users: any = []
  sameAs: boolean = false;
  showPassword: boolean = false;
  loading: boolean = false;

  signupForm = this.builder.group({
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
    const pw = this.signupForm.get('password')?.value;
    const cpw = this.signupForm.get('confirm_password')?.value;
    this.sameAs = !!(pw && cpw && pw === cpw);
  }

  register() {
    if (this.signupForm.invalid || !this.sameAs) {
      this.message = 'Please complete all fields correctly.';
      this.messageType = 'warning';
      this.messageTitle = 'Validation Error';
      return;
    }

    this.loading = true;
    this.http.post('http://localhost/SkillBridge/auth/signup', this.signupForm.value)
      .subscribe((response: any) => {
        this.loading = false;
        if (response.status === 200) {
          this.message = 'Account created successfully! Redirecting...';
          this.messageType = 'success';
          this.messageTitle = 'Success';
          setTimeout(() => {
            this.router.navigate(['/signin']);
          }, 1500);
        } else {
          this.message = response.message || 'Registration failed';
          this.messageType = 'danger';
          this.messageTitle = 'Registration Error';
          console.log(this.message);
        }
      }, (error) => {
        this.loading = false;
        this.message = error?.error?.message || "Server Error. Please try again.";
        this.messageType = 'danger';
        this.messageTitle = 'Error';
        console.log(error);
      });
  }
}
