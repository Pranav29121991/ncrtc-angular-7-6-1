import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumenttypetreetempletComponent } from './documenttypetreetemplet.component';

describe('DocumenttypetreetempletComponent', () => {
  let component: DocumenttypetreetempletComponent;
  let fixture: ComponentFixture<DocumenttypetreetempletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumenttypetreetempletComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumenttypetreetempletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
