import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegajosComponent } from './legajos.component';

describe('LegajosComponent', () => {
  let component: LegajosComponent;
  let fixture: ComponentFixture<LegajosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LegajosComponent]
    });
    fixture = TestBed.createComponent(LegajosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
