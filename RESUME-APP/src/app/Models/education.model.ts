export class Education {
    constructor(
      public degree: string,
      public school: string,
      public startDate: Date,
      public endDate: Date,
      public summary: string,
      public _id?: string // optional ID property
    ) {}
  }
  