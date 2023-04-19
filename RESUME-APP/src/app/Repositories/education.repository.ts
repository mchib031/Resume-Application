import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Education } from '../Models/education.model';
import { EducationRepositoryInterface } from './Interfaces/education.repository.interface';

@Injectable({
  providedIn: 'root'
})
export class EducationRepository implements EducationRepositoryInterface {
  private apiUrl = 'http://localhost:3000/resume/education';

  constructor(private http: HttpClient) { }

  getEducations(): Observable<Education[]> {
    return this.http.get<Education[]>(this.apiUrl);
  }

  getEducationById(id: number): Observable<Education> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Education>(url);
  }

  addEducation(education: Education): Observable<Education> {
    return this.http.post<Education>(this.apiUrl, education);
  }

  deleteEducation(id: number): Observable<any>{
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }

  updateEducation(education: Education): Observable<Education>{
    return this.http.put<Education>(this.apiUrl, education);
  }

}
