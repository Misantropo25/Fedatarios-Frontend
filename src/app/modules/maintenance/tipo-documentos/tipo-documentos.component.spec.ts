import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoDocumentosComponent } from './tipo-documentos.component';

describe('TipoDocumentosComponent', () => {
  let component: TipoDocumentosComponent;
  let fixture: ComponentFixture<TipoDocumentosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TipoDocumentosComponent]
    });
    fixture = TestBed.createComponent(TipoDocumentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
