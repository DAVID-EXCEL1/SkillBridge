import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-add-admin',
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

  signupForm = this.builder.group({
    first_name: ['', [Validators.required, Validators.minLength(2)]],
    last_name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required,
    Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    ]],
    confirm_password: ['', [Validators.required]],
  })

  register() {
    // console.log(this.signupForm.valid);
    //this.users.push(this.signupForm.value);
    //localStorage.setItem('users', JSON.stringify(this.users))
    //send to Database
    this.showError = false;
    this.errorMessage = '';

    this.users.push(this.signupForm.value)
    // this.users.find(user=>{user.email === this.signUpForm.value.email})
    // localStorage['users'] = JSON.stringify(this.users);
    this.http.post('http://localhost/SkillBridge/adminAuth/signup', this.signupForm.value)
      .subscribe({
        next: (response: any) => {
          console.log(response)
          if (response.status === 200) {
            console.log('I will go to Sign in');
            this.router.navigate(['/admin_signin'])
          } else {
            this.errorMessage = response.message || 'Registration failed. Please try again.';
            this.showError = true;
          }
        },
        error: (error) => {
          this.errorMessage = 'An error occurred. Please check your connection and try again.';
          this.showError = true;
          console.error('Error:', error);

        }
      })

  }


  confirmPassword() {
    // console.log(this.signupForm.value.password);
    if (this.signupForm.value.confirm_password === this.signupForm.value.password) {
      this.sameAs = true
    }


  }
}
