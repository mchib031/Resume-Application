import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddEducationDialogComponent } from './add-education-dialog/add-education-dialog.component';
import { EducationService } from '../../Services/education.service';
import { Education } from '../../Models/education.model';
import { DatePipe } from '@angular/common';



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
  
  

  constructor(private educationService: EducationService, public dialog: MatDialog, private datePipe: DatePipe) {
    this.educations = [];
   }

  ngOnInit() {
    this.getEducation();
  }

  getEducation(): void {
    this.educationService.getAllEducations()
      .subscribe(educations => this.educations = educations);
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
        this.educations.push(result);
        console.log('The dialog was closed');
      }
    });
  }
  

}
