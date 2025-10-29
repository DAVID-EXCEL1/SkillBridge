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
export class ArtisanSignup implements OnInit {
  ngOnInit(): void {
    this.artisans = localStorage['artisans'] ? JSON.parse(localStorage['artisans']) : [];
  }

  private http = inject(HttpClient);
  private builder = inject(FormBuilder);
  private router = inject(Router);
  artisans: any = [];
  sameAs: boolean = false;

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
  register() {
    this.http.post('http://localhost/SkillBridge/ArtisanAuth.php', this.ArtisanSignupForm.value)
      .subscribe((response: any) => {
        if (response.status === 200) {
          // Direct to signin page
          this.router.navigate(['/artisan-signin']);
        } else {
          this.message = response.message;
        }
      });
  }

  confirmPassword() {
    if (this.ArtisanSignupForm.value.password === this.ArtisanSignupForm.value.confirm_password) {
      this.sameAs = true;
    }
  }
}
