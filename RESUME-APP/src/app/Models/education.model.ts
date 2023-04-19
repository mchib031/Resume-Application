export class Education {
      degree: string;
      school: string;
      startDate: Date;
      endDate: Date;
      summary: string;
      _id?: string; // optional ID property
    constructor(data: any = {}) {
      this.degree = data.degree || '';
      this.school = data.school || '';
      this.startDate = data.startDate || '';
      this.endDate = data.endDate || '';
      this.summary = data.summary || '';
      this._id = data._id || null;
    }
  }
  