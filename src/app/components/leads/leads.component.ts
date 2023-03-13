import { FormGroup, FormControl } from '@angular/forms';
import { ActivityModel } from './../../models/activity/activity.model';
import { LeadModel } from './../../models/lead/lead.model';
import { LeadService } from './../../services/lead/lead.service';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth/auth.service';
import { AuthUserModel } from './../../models/auth-me/auth-me.model';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { Observable, combineLatest, map, of, startWith, tap, take } from 'rxjs';
import { UserService } from '../../services/user/user.service';
import { LeadsQueryModel } from 'src/app/query-models/leads/leads.query-model';

interface displayForm {
  name: string;
  controlName: string;
}

interface companySize {
  position: string;
  min: number;
  max: number;
}

@Component({
  selector: 'app-leads',
  styleUrls: ['./leads.component.scss'],
  templateUrl: './leads.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeadsComponent {
  readonly me$: Observable<AuthUserModel | undefined | unknown> =
    this._userService.getMe().pipe(take(1));

  constructor(
    private _userService: UserService,
    private _authService: AuthService,
    private _router: Router,
    private _leadsService: LeadService
  ) {}

  logout(): void {
    this._authService.logout().subscribe({
      next: () => {
        this._router.navigateByUrl('logged-out');
      },
    });
  }

  filterOptions: FormGroup = new FormGroup({
    internalProject: new FormControl(false),
    externalProject: new FormControl(false),
    recruitmentAgency: new FormControl(false),
  });

  sizeOptions: FormGroup = new FormGroup({});

  readonly companySizes$: Observable<companySize[]> = of([
    { position: '1', min: 0, max: 50 },
    { position: '2', min: 51, max: 100 },
    { position: '3', min: 101, max: 500 },
    { position: '4', min: 501, max: 1000 },
    { position: '5', min: 1001, max: Number.MAX_SAFE_INTEGER },
  ]).pipe(tap((options) => this._addFormControl(options)));

  selectedOptions$: Observable<companySize[]> = combineLatest([
    this.sizeOptions.valueChanges,
    this.companySizes$,
  ]).pipe(
    map(([form, options]) => {
      return options
        .filter((option) => form[option.position] === true)

        .sort();
    })
  );

  leads$: Observable<LeadsQueryModel[]> = combineLatest([
    this._leadsService.getAllLeads().pipe(take(1)),
    this._leadsService.getAllLeadsActivities().pipe(take(1)),
    this.filterOptions.valueChanges.pipe(startWith(false)),
    this.selectedOptions$,
  ]).pipe(
    map(([leads, activities, form, selectedOptions]) =>
      this._mapToLeadsQueryModel(leads, activities)
        .filter((leads) =>
          form.internalProject
            ? leads.scope.includes('Internal Projects')
            : leads
        )
        .filter((leads) =>
          form.externalProject
            ? leads.scope.includes('External Projects')
            : leads
        )
        .filter((leads) =>
          form.recruitmentAgency
            ? leads.scope.includes('Recruitment Agency')
            : leads
        )
        .filter(
          (leads) =>
            !selectedOptions.length ||
            selectedOptions.filter(
              (option) =>
                leads.size.total >= option.min && leads.size.total <= option.max
            ).length
        )
    )
  );

  leadsOnly$: Observable<LeadModel[]> = this._leadsService.getAllLeads();

  activitiesOnly$: Observable<ActivityModel[]> =
    this._leadsService.getAllLeadsActivities();

  scopeOptions$: Observable<displayForm[]> = of([
    { name: 'Internal Project', controlName: 'internalProject' },
    { name: 'External Project', controlName: 'externalProject' },
    { name: 'Recruitment Agency', controlName: 'recruitmentAgency' },
  ]);

  isFormWorking$: Observable<any> = this.filterOptions.valueChanges.pipe(
    map((form) => form.internalProject)
  );

  private _mapToLeadsQueryModel(
    leads: LeadModel[],
    activities: ActivityModel[]
  ): LeadsQueryModel[] {
    const activityMap = activities.reduce(
      (a, c) => ({ ...a, [c.id]: c.name }),
      {} as Record<string, string>
    );

    return leads.map((lead) => ({
      name: lead.name,
      industry: lead.industry,
      size: lead.companySize,
      annualRevenue: lead.annualRevenue,
      location: lead.location,
      hiring: lead.hiring,
      scope: lead.activityIds.map((id) => activityMap[id]),
    }));
  }

  isAdmin$: Observable<boolean> = this._userService.isAdmin();

  resetFilter(): void {
    this.filterOptions.reset();
    this.sizeOptions.reset();
  }

  private _addFormControl(rangeSizes: companySize[]) {
    const group: FormGroup = this.sizeOptions;
    rangeSizes.forEach((range) =>
      group.addControl(range.position, new FormControl(false))
    );
  }
}
