import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterLink } from '@angular/router';

function passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirm = group.get('confirm_password')?.value;
  if (!password || !confirm) return null;
  return password === confirm ? null : { mismatch: true };
}

@Component({
  selector: 'app-admin-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './admin-signup.html',
  styleUrl: './admin-signup.css'
})
export class AdminSignup {
  adminSignupForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  loading = false;
  message?: string;
  messageType?: 'success' | 'danger' | 'warning' | 'info';
  messageTitle?: string;

  constructor(private fb: FormBuilder) {
    this.adminSignupForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', [Validators.required]]
    }, { validators: passwordMatchValidator });
  }

  hasError(controlName: string): boolean {
    const control = this.adminSignupForm.get(controlName);
    if (!control) return false;
    if (controlName === 'confirm_password' && control.touched) {
      return !!control.errors || this.adminSignupForm.hasError('mismatch');
    }
    return !!(control.errors && control.touched);
  }

  isValid(controlName: string): boolean {
    const control = this.adminSignupForm.get(controlName);
    if (!control) return false;
    if (controlName === 'confirm_password' && control.touched) {
      return !control.errors && !this.adminSignupForm.hasError('mismatch');
    }
    return control.touched && !control.errors;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  closeMessage(): void {
    this.message = undefined;
    this.messageType = undefined;
    this.messageTitle = undefined;
  }

  submit(): void {
    if (this.adminSignupForm.invalid) {
      this.adminSignupForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this.messageType = 'success';
      this.messageTitle = 'Account Created';
      this.message = 'Administrator account successfully registered.';
      this.adminSignupForm.reset();
    }, 1000);
  }

}
