import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { last } from 'rxjs';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup implements OnInit {
  ngOnInit(): void {
    this.users = localStorage['users'] ? JSON.parse(localStorage['users']) : [];
  }

  private http = inject(HttpClient)
  private builder = inject(FormBuilder)
  private router = inject(Router);
  users: any = []
  sameAs: boolean = false;

  signupForm = this.builder.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
    confirm_password: ['', Validators.required]
  });

    // ...existing code...
  message: string | null = null;
  messageType: 'success' | 'danger' | 'warning' | 'info' | null = null;
  messageTitle?: string | null = null;
  
  closeMessage() {
    this.message = null;
    this.messageType = null;
    this.messageTitle = null;
  }
  // ...existing code...
  register() {
    // send to the database
    this.http.post('http://localhost/SkillBridge/Auth.php', this.signupForm.value)
      .subscribe((response: any) => {
        if (response.status === 200) {
          // Direct to signin page
          this.router.navigate(['/signin']);
        } else {
          this.message = response.message;
        }
      });

  }

  confirmPassword() {
    if (this.signupForm.value.password === this.signupForm.value.confirm_password) {
      this.sameAs = true;
    }
  }
}
