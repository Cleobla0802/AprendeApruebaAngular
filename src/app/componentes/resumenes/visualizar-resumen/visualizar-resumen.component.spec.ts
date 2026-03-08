import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarResumenComponent } from './visualizar-resumen.component';

describe('VisualizarResumenComponent', () => {
  let component: VisualizarResumenComponent;
  let fixture: ComponentFixture<VisualizarResumenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualizarResumenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizarResumenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
