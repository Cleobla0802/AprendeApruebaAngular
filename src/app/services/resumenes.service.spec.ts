import { TestBed } from '@angular/core/testing';

import { ResumenesService } from './resumenes.service';

describe('ResumenesService', () => {
  let service: ResumenesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResumenesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
