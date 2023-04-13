import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Experience } from '../Models/experience.model';

@Injectable({
  providedIn: 'root'
})
export class ExperienceService {
  private apiUrl = 'http://localhost:3000/resume/experience';

  constructor(private http: HttpClient) { }

  getAllExperiences(): Observable<Experience[]> {
    return this.http.get<Experience[]>(this.apiUrl);
  }

  addExperience(experience: Experience): Observable<Experience> {
    return this.http.post<Experience>(this.apiUrl, experience);
  }
}
