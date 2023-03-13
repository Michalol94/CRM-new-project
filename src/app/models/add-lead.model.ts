export interface AddLeadModel {
  readonly name: string;
  readonly websiteLink: string;
  readonly location: string;
  readonly linkedinLink: string;
  readonly industry: string;
  readonly annualRevenue: number;
  readonly activityIds: string[];
  readonly companySize: { total: number; dev: number; fe: number };
  readonly hiring: { active: boolean; junior: boolean; talentProgram: boolean };
}
