import { AuthService } from './../../services/auth/auth.service';
import { Observable, tap } from 'rxjs';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { LeadService } from 'src/app/services/lead/lead.service';
import { ActivityModel } from 'src/app/models/activity/activity.model';
import { Router } from '@angular/router';

const atLeastOneActivity: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const checkedValue = Object.keys(control.value).reduce(
    (prev: string[], curr: string) => {
      if (control.value[curr]) {
        return [...prev, curr];
      } else {
        return prev;
      }
    },
    []
  ).length;
  if (checkedValue > 0) {
    return null;
  }
  return { atLeastOne: true };
};

@Component({
  selector: 'app-create-lead',
  styleUrls: ['./create-lead.component.scss'],
  templateUrl: './create-lead.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateLeadComponent {
  constructor(
    private _leadService: LeadService,
    private _cdr: ChangeDetectorRef,
    private _router: Router,
    private _authService: AuthService
  ) {}

  logout(): void {
    this._authService.logout().subscribe({
      next: () => {
        {
          this._router.navigateByUrl('logged-out'), window.location.reload();
        }
      },
    });
  }

  activities$: Observable<ActivityModel[]> = this._leadService
    .getAllLeadsActivities()
    .pipe(tap((activities) => this._createActivitiesControls(activities)));

  actiactivitiesForm: FormGroup = new FormGroup({}, [atLeastOneActivity]);

  leadForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    websiteLink: new FormControl('', [
      Validators.required,
      Validators.pattern(
        '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?'
      ),
    ]),
    linkedinLink: new FormControl('', [
      Validators.required,
      Validators.pattern(
        '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?'
      ),
    ]),
    location: new FormControl('', [Validators.required]),
    industry: new FormControl('', [Validators.required]),
    annualRevenue: new FormControl('', [Validators.required]),
    activityIds: this.actiactivitiesForm,
    companySize: new FormGroup({
      total: new FormControl('', [Validators.required, Validators.min(1)]),
      dev: new FormControl('', [Validators.required, Validators.min(1)]),
      fe: new FormControl('', [Validators.required, Validators.min(1)]),
    }),
    hiring: new FormGroup({
      active: new FormControl(false),
      junior: new FormControl(false),
      talentProgram: new FormControl(false),
    }),
  });

  onLeadFormSubmitted(leadForm: FormGroup): void {
    if (leadForm.invalid) {
      this.leadForm.markAllAsTouched();
      return;
    }
    this._leadService
      .createLead({
        name: leadForm.value.name,
        websiteLink: leadForm.value.websiteLink,
        linkedinLink: leadForm.value.linkedinLink,
        location: leadForm.value.location,
        annualRevenue: leadForm.value.annualRevenue,
        industry: leadForm.value.industry,
        activityIds: this._mapChosenFields(leadForm.value.activityIds),
        companySize: {
          total: leadForm.value.total,
          fe: leadForm.value.fe,
          dev: leadForm.value.dev,
        },
        hiring: {
          active: leadForm.value.active,
          junior: leadForm.value.junior,
          talentProgram: leadForm.value.talentProgram,
        },
      })
      .subscribe({
        next: () => this._router.navigateByUrl('leads'),
        error: (e) => {
          this.leadForm.setErrors({ reponseError: e.error.message }),
            this._cdr.detectChanges();
        },
      });
  }

  private _createActivitiesControls(activities: ActivityModel[]): void {
    activities.forEach((activity) =>
      this.actiactivitiesForm.addControl(activity.id, new FormControl(false))
    );
  }
  private _mapChosenFields(
    formControlValue: Record<string, boolean> = {}
  ): string[] {
    return Object.keys(formControlValue).filter(
      (k) => formControlValue[k] === true
    );
  }
}
