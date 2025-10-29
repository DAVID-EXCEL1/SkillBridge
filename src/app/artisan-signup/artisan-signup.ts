import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from "@angular/router";

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
  artisans: any = [];
  sameAs: boolean = false;

  ArtisanSignupForm = this.builder.group({
    first_name: ['', [Validators.required, Validators.minLength(3)]],
    last_name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    ]],
    confirm_password: ['', Validators.required]
  });

  register() {
    if (this.ArtisanSignupForm.invalid) return;

    this.http.post('http://localhost/SkillBridge/ArtisanAuth.php', this.ArtisanSignupForm.value)
      .subscribe({
        next: (res) => {
          console.log('Signup successful:', res);
          this.ArtisanSignupForm.reset();
        },
        error: (err) => {
          console.error('Error during signup:', err);
          alert('An error occurred while signing up.');
        }
      });
  }

  confirmPassword() {
    this.sameAs = this.ArtisanSignupForm.value.password === this.ArtisanSignupForm.value.confirm_password;
  }
}
