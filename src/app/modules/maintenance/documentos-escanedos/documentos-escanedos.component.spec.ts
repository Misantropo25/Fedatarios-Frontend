import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentosEscanedosComponent } from './documentos-escanedos.component';

describe('DocumentosEscanedosComponent', () => {
  let component: DocumentosEscanedosComponent;
  let fixture: ComponentFixture<DocumentosEscanedosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentosEscanedosComponent]
    });
    fixture = TestBed.createComponent(DocumentosEscanedosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
