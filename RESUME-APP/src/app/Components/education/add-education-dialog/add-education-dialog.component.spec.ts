import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEducationDialogComponent } from './add-education-dialog.component';

describe('AddEducationDialogComponent', () => {
  let component: AddEducationDialogComponent;
  let fixture: ComponentFixture<AddEducationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEducationDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEducationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
