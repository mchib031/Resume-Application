import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './Components/app.component';
import { HomeComponent } from './Components/home/home.component';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { ResumeComponent } from './Components/resume/resume.component';
import { EducationComponent } from './Components/education/education.component';
import { ExperienceComponent } from './Components/experience/experience.component';
import { SkillsComponent } from './Components/skills/skills.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AddEducationDialogComponent } from './Components/education/add-education-dialog/add-education-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { DatePipe } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    ResumeComponent,
    EducationComponent,
    ExperienceComponent,
    SkillsComponent,
    AddEducationDialogComponent
  ],
  imports: [
    MatIconModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatDialogModule,
    BrowserAnimationsModule,
    AppRoutingModule
  ],
  exports: [RouterModule,
    MatIconModule
  ],
  providers: [
    DatePipe // Add DatePipe to providers
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
