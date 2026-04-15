import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealizarTipoTestComponent } from './realizar-tipo-test.component';

describe('RealizarTipoTestComponent', () => {
  let component: RealizarTipoTestComponent;
  let fixture: ComponentFixture<RealizarTipoTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RealizarTipoTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RealizarTipoTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
