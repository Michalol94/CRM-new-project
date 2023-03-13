export interface LeadsQueryModel {
  readonly scope: string[];
  readonly industry: string;
  readonly size: { total: number; fe: number; dev: number };
  readonly annualRevenue: number;
  readonly location: string;
  readonly name: string;
  readonly hiring: { active: boolean; junior: boolean; talentProgram: boolean };
}
