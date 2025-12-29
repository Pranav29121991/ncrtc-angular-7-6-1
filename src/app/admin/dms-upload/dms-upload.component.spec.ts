import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmsUploadComponent } from './dms-upload.component';

describe('DmsUploadComponent', () => {
  let component: DmsUploadComponent;
  let fixture: ComponentFixture<DmsUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DmsUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DmsUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
