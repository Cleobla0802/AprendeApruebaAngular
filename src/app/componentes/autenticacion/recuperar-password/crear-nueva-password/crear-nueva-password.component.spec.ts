import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearNuevaPasswordComponent } from './crear-nueva-password.component';

describe('CrearNuevaPasswordComponent', () => {
  let component: CrearNuevaPasswordComponent;
  let fixture: ComponentFixture<CrearNuevaPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearNuevaPasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearNuevaPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
