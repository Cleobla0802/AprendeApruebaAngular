import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenesComponent } from './resumenes.component';

describe('ResumenesComponent', () => {
  let component: ResumenesComponent;
  let fixture: ComponentFixture<ResumenesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumenesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumenesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
