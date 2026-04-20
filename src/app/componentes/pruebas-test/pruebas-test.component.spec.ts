import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PruebasTestComponent } from './pruebas-test.component';

describe('PruebasTestComponent', () => {
  let component: PruebasTestComponent;
  let fixture: ComponentFixture<PruebasTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PruebasTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PruebasTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
