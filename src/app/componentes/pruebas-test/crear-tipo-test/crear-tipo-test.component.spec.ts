import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearTipoTestComponent } from './crear-tipo-test.component';

describe('CrearTipoTestComponent', () => {
  let component: CrearTipoTestComponent;
  let fixture: ComponentFixture<CrearTipoTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearTipoTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearTipoTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
