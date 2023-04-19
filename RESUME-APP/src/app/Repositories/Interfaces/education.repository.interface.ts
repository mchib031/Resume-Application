import { Observable } from 'rxjs';
import { Education } from '../../Models/education.model';

export interface EducationRepositoryInterface {
  getEducations(): Observable<Education[]>;
  getEducationById(id: number): Observable<Education>;
  addEducation(education: Education): Observable<Education>;
  updateEducation(education: Education): Observable<Education>;
  deleteEducation(id: number): Observable<any>;
}
