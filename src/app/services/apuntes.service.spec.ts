import { TestBed } from '@angular/core/testing';

import { ApuntesService } from './apuntes.service';

describe('ApuntesService', () => {
  let service: ApuntesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApuntesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
