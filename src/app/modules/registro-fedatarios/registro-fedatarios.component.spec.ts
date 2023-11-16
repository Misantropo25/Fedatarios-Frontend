import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroFedatariosComponent } from './registro-fedatarios.component';

describe('RegistroFedatariosComponent', () => {
  let component: RegistroFedatariosComponent;
  let fixture: ComponentFixture<RegistroFedatariosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistroFedatariosComponent]
    });
    fixture = TestBed.createComponent(RegistroFedatariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
