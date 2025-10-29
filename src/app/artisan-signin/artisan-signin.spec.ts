import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtisanSignin } from './artisan-signin';

describe('ArtisanSignin', () => {
  let component: ArtisanSignin;
  let fixture: ComponentFixture<ArtisanSignin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtisanSignin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArtisanSignin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
