import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Education } from '../Models/education.model';

@Injectable({
  providedIn: 'root'
})
export class EducationService {
  private apiUrl = 'http://localhost:3000/resume/education';

  constructor(private http: HttpClient) { }

  getAllEducations(): Observable<Education[]> {
    return this.http.get<Education[]>(this.apiUrl);
  }

  addEducation(education: Education): Observable<Education> {
    return this.http.post<Education>(this.apiUrl, education);
  }
}
