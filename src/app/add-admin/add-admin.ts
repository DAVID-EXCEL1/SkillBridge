import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-add-admin',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './add-admin.html',
  styleUrl: './add-admin.css'
})
export class AddAdmin {
  private http = inject(HttpClient)
  private builder = inject(FormBuilder)
  private router = inject(Router)
  users: any = [];
  sameAs: boolean = false;
  errorMessage: string = '';
  showError: boolean = false;

  signupForm: FormGroup = this.builder.group({
    first_name: ['', [Validators.required, Validators.minLength(2)]],
    last_name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
    confirm_password: ['', [Validators.required]],
  });

  showPassword = false;
  showConfirmPassword = false;
  loading = false;
  message?: string;
  messageType?: 'success' | 'danger' | 'warning' | 'info';
  messageTitle?: string;

  register(): void {
    if (this.signupForm.invalid || !this.sameAs) {
      this.signupForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.http.post('http://localhost/SkillBridge/adminAuth/signup', this.signupForm.value)
      .subscribe({
        next: (response: any) => {
          this.loading = false;
          if (response.status === 200) {
            this.messageType = 'success';
            this.messageTitle = 'Admin Created';
            this.message = 'Redirecting to sign in...';
            setTimeout(() => this.router.navigate(['/admin-signin']), 1000);
          } else {
            this.messageType = 'danger';
            this.messageTitle = 'Registration Failed';
            this.message = response.message || 'Please try again.';
          }
        },
        error: (error) => {
          this.loading = false;
          this.messageType = 'danger';
          this.messageTitle = 'Network Error';
          this.message = 'Unable to connect to server.';
          console.error('Error:', error);
        }
      });
  }


  confirmPassword(): void {
    this.sameAs = this.signupForm.value.confirm_password === this.signupForm.value.password;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  hasError(controlName: string): boolean {
    const control = this.signupForm.get(controlName);
    return !!(control && control.errors && control.touched);
  }

  isValid(controlName: string): boolean {
    const control = this.signupForm.get(controlName);
    return !!(control && control.touched && !control.errors);
  }

  hasConfirmPasswordError(): boolean {
    const control = this.signupForm.get('confirm_password');
    return !!(control && control.touched && (control.errors || !this.sameAs));
  }

  isConfirmPasswordValid(): boolean {
    const control = this.signupForm.get('confirm_password');
    return !!(control && control.touched && !control.errors && this.sameAs);
  }

  closeMessage(): void {
    this.message = undefined;
    this.messageType = undefined;
    this.messageTitle = undefined;
  }
}
