import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumenttypeComponent } from './documenttype.component';

describe('DocumenttypeComponent', () => {
  let component: DocumenttypeComponent;
  let fixture: ComponentFixture<DocumenttypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumenttypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumenttypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
