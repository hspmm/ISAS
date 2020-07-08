import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LdapgroupComponent } from './ldapgroup.component';

describe('LdapgroupComponent', () => {
  let component: LdapgroupComponent;
  let fixture: ComponentFixture<LdapgroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LdapgroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LdapgroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
