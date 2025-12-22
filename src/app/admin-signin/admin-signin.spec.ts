import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminSignin } from './admin-signin';

describe('AdminSignin', () => {
  let component: AdminSignin;
  let fixture: ComponentFixture<AdminSignin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSignin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSignin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with invalid form', () => {
    expect(component.loginForm.valid).toBeFalse();
  });

  it('should validate email required', () => {
    const email = component.loginForm.get('email');
    email?.markAsTouched();
    expect(email?.hasError('required')).toBeTrue();
  });

  it('should validate password minlength', () => {
    component.loginForm.patchValue({ email: 'admin@example.com', password: '123' });
    const password = component.loginForm.get('password');
    password?.markAsTouched();
    expect(password?.hasError('minlength')).toBeTrue();
  });

  it('should be valid with correct credentials', () => {
    component.loginForm.patchValue({ email: 'admin@example.com', password: 'secret12' });
    expect(component.loginForm.valid).toBeTrue();
  });
});
