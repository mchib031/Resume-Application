import { Injectable } from '@angular/core';
import { EducationFacade } from '../Facades/education.facade';
import { EducationRepository } from '../Repositories/education.repository';

@Injectable({
  providedIn: 'root'
})
export class EducationFactory {
  constructor(private educationRepository: EducationRepository) {}

  create(): EducationFacade {
    return new EducationFacade(this.educationRepository);
  }
}
