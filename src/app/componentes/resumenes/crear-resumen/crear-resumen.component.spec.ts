import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearResumenComponent } from './crear-resumen.component';

describe('CrearResumenComponent', () => {
  let component: CrearResumenComponent;
  let fixture: ComponentFixture<CrearResumenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearResumenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearResumenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
