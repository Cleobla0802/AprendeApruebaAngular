import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarApuntesComponent } from './visualizar-apuntes.component';

describe('VisualizarApuntesComponent', () => {
  let component: VisualizarApuntesComponent;
  let fixture: ComponentFixture<VisualizarApuntesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualizarApuntesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizarApuntesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
