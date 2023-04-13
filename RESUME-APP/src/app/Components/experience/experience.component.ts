import { Component, OnInit } from '@angular/core';
import { Experience } from '../../Models/experience.model';
import { ExperienceService } from '../../Services/experience.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss']
})
export class ExperienceComponent implements OnInit {
  experiences: Experience[];
  company!: string;
  position!: string;
  startDate!: Date;
  endDate!: Date;
  summary!: string;
  id!: string;
  
  

  constructor(private experienceService: ExperienceService) {
    this.experiences = [];
   }

  ngOnInit() {
    this.getExperience();
  }

  onSubmit(form: NgForm) {
    const experience = new Experience(
      this.company,
      this.position,
      this.startDate,
      this.endDate,
      this.summary
    );
    this.experienceService.addExperience(experience)
      .subscribe(
        (response) => {
          console.log(response);
          this.experiences.push(response);
          form.resetForm();
        },
        (error) => console.log(error)
      );
  }

  getExperience(): void {
    this.experienceService.getAllExperiences()
      .subscribe(experiences => this.experiences = experiences);
  }

  addExperience(company: string, position: string, startDate: string, endDate: string, summary:string): void {
    company = company.trim();
    position = position.trim();
    startDate = startDate.trim();
    endDate = endDate.trim();
    summary = summary.trim();
    if (!company || !position || !startDate || !endDate || !summary) {
      return;
    }
    const newExperience: Experience = { company, position, startDate, endDate, summary } as unknown as Experience;
    this.experienceService.addExperience(newExperience)
      .subscribe(experience => {
        this.experiences.push(experience);
      });
  }
}
