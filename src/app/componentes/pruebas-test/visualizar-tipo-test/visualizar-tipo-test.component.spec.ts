import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarTipoTestComponent } from './visualizar-tipo-test.component';

describe('VisualizarTipoTestComponent', () => {
  let component: VisualizarTipoTestComponent;
  let fixture: ComponentFixture<VisualizarTipoTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualizarTipoTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizarTipoTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
