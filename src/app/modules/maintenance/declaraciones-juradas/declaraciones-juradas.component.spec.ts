import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclaracionesJuradasComponent } from './declaraciones-juradas.component';

describe('DeclaracionesJuradasComponent', () => {
  let component: DeclaracionesJuradasComponent;
  let fixture: ComponentFixture<DeclaracionesJuradasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeclaracionesJuradasComponent]
    });
    fixture = TestBed.createComponent(DeclaracionesJuradasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
