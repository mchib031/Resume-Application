import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Education } from '../../../Models/education.model';
import { NgForm } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { EducationFactory } from 'src/app/Factories/education.factory';


@Component({
  selector: 'app-add-education-dialog',
  templateUrl: './add-education-dialog.component.html',
  styleUrls: ['./add-education-dialog.component.scss'],
  animations: [
    // add the necessary configuration for the animation named `@transformPanel.start`
    trigger('transformPanel', [
      state('void', style({
        transform: 'scale(1)',
        opacity: 0
      })),
      state('*', style({
        transform: 'scale(1)',
        opacity: 1
      })),
      transition('void => *', animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)')),
      transition('* => void', animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)')),
    ]),
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ]
})

export class AddEducationDialogComponent implements OnInit {

  degree!: string;
  school!: string;
  startDate!: Date;
  endDate!: Date;
  summary!: string;
  id!: string;

  private educationFacade = this.educationFactory.create();

  constructor(
    public dialogRef: MatDialogRef<AddEducationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private educationFactory: EducationFactory)
  { }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm): void {
    const degree = form.value.degree;
    const school = form.value.school;
    const startDate = form.value.startDate;
    const endDate = form.value.endDate;
    const summary = form.value.summary;

    if (!degree || !school || !startDate || !endDate || !summary) {
      return;
    }

    const newEducation: Education = { degree, school, startDate, endDate, summary } as Education;

      this.educationFacade.addEducation(newEducation);
      this.dialogRef.close(newEducation);
  
  }


  onCancel(): void {
    this.dialogRef.close();
  }

}