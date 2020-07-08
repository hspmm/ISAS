import { TestBed } from '@angular/core/testing';

import { ImprivataService } from './imprivata.service';

describe('ImprivataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ImprivataService = TestBed.get(ImprivataService);
    expect(service).toBeTruthy();
  });
});
