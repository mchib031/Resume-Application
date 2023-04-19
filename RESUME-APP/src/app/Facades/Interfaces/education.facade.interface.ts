import { Observable } from 'rxjs';
import { Education } from '../../Models/education.model';

export interface EducationFacadeInterface {
    readonly educations: Observable<Education[]>;
  
    loadEducation(): void;
    addEducation(education: Education): void;
    updateEducation(education: Education): void;
    deleteEducation(id: number): void;
  }
  