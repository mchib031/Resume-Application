import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddEducationDialogComponent } from './add-education-dialog/add-education-dialog.component';
import { Education } from '../../Models/education.model';
import { DatePipe } from '@angular/common';
import { EducationFactory } from 'src/app/Factories/education.factory';



@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss']
})

export class EducationComponent implements OnInit {
  educations: Education[];
  degree!: string;
  school!: string;
  startDate!: Date;
  endDate!: Date;
  summary!: string;
  id!: string;
  
  private educationFacade = this.educationFactory.create();

  constructor(private educationFactory: EducationFactory, public dialog: MatDialog, private datePipe: DatePipe) {
    this.educations = [];
   }

  ngOnInit() {
    this.getEducation();
  }

  getEducation(): void {
    this.educationFacade.educations.subscribe(educations => this.educations = educations);
  }


  addEducationDialog(): void {
    let dialogRef = this.dialog.open(
      AddEducationDialogComponent,
      {
        width: '500px'
      }
    );
    

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.educationFacade.loadEducation();
        console.log('The dialog was closed');
      }
    });
  }
  

}
