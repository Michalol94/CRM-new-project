export interface LeadModel {
  readonly activityIds: string[];
  readonly linkedinLink: string;
  readonly industry: string;
  readonly companySize: { total: number; fe: number; dev: number };

  readonly annualRevenue: number;
  readonly location: string;
  readonly websiteLink: string;
  readonly name: string;
  readonly hiring: { active: boolean; junior: boolean; talentProgram: boolean };
}
