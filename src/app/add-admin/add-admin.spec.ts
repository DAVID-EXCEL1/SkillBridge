import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddAdmin } from './add-admin';

describe('AddAdmin', () => {
  let component: AddAdmin;
  let fixture: ComponentFixture<AddAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with invalid form', () => {
    expect(component.signupForm.valid).toBeFalse();
  });

  it('should detect password mismatch', () => {
    component.signupForm.patchValue({
      first_name: 'Jane',
      last_name: 'Doe',
      email: 'jane@example.com',
      password: 'Strong@123',
      confirm_password: 'Wrong@123'
    });
    component.confirmPassword();
    expect(component.sameAs).toBeFalse();
  });

  it('should accept matching passwords', () => {
    component.signupForm.patchValue({
      first_name: 'Jane',
      last_name: 'Doe',
      email: 'jane@example.com',
      password: 'Strong@123',
      confirm_password: 'Strong@123'
    });
    component.confirmPassword();
    expect(component.sameAs).toBeTrue();
  });
});
