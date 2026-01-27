import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearApuntesComponent } from './crear-apuntes.component';

describe('CrearApuntesComponent', () => {
  let component: CrearApuntesComponent;
  let fixture: ComponentFixture<CrearApuntesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearApuntesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearApuntesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
