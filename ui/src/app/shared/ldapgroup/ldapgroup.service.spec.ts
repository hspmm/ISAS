import { TestBed } from '@angular/core/testing';

import { LdapGroupService } from './ldapgroup.service';

describe('LdapGroupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LdapGroupService = TestBed.get(LdapGroupService);
    expect(service).toBeTruthy();
  });
});
