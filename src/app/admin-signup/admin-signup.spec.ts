import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminSignup } from './admin-signup';

describe('AdminSignup', () => {
  let component: AdminSignup;
  let fixture: ComponentFixture<AdminSignup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSignup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSignup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form initially', () => {
    expect(component.adminSignupForm.valid).toBeFalse();
  });

  it('should validate password mismatch', () => {
    component.adminSignupForm.patchValue({
      first_name: 'Jane',
      last_name: 'Doe',
      email: 'jane@example.com',
      role: 'manager',
      password: 'secret1',
      confirm_password: 'secret2'
    });
    expect(component.adminSignupForm.hasError('mismatch')).toBeTrue();
  });

  it('should validate matching passwords', () => {
    component.adminSignupForm.patchValue({
      first_name: 'Jane',
      last_name: 'Doe',
      email: 'jane@example.com',
      role: 'manager',
      password: 'secret1',
      confirm_password: 'secret1'
    });
    expect(component.adminSignupForm.hasError('mismatch')).toBeFalse();
  });
});
