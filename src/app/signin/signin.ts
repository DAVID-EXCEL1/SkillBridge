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
  login() {
    this.http.post('http://localhost/SkillBridge/Auth.php', this.signinForm.value)
      .subscribe((response: any) => {
        if (response.status === 200) {
          // Direct to dashboard page
          this.router.navigate(['/dashboard']);
        } else {
          this.message = response.message;
        }
      });
  }
}
