export class Experience {
    constructor(
      public company: string,
      public position: string,
      public startDate: Date,
      public endDate: Date,
      public summary: string,
      public _id?: string // optional ID property
    ) {}
  }