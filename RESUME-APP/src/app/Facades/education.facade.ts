import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Education } from '../Models/education.model';
import { EducationRepository } from '../Repositories/education.repository';
import { EducationFacadeInterface } from './Interfaces/education.facade.interface';

@Injectable({
  providedIn: 'root'
})
export class EducationFacade implements EducationFacadeInterface {
    
    private _educations: BehaviorSubject<Education[]> = new BehaviorSubject<Education[]>([]);

  constructor(private educationRepository: EducationRepository) {
    this.loadEducation();
  }

  get educations(): BehaviorSubject<Education[]> {
    return this._educations;
  }

  loadEducation(): void {
    this.educationRepository.getEducations().subscribe(educations => {
      this._educations.next(educations);
    });
  }

  addEducation(education: Education): void {
    this.educationRepository.addEducation(education).subscribe(() => {
      this.loadEducation();
    });
  }

  updateEducation(education: Education): void {
    this.educationRepository.updateEducation(education).subscribe(() => {
      this.loadEducation();
    });
  }

  deleteEducation(id: number): void {
    this.educationRepository.deleteEducation(id).subscribe(() => {
      this.loadEducation();
    });
  }
}
