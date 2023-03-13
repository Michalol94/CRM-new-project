import { Router } from '@angular/router';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { UserService } from '../../services/user/user.service';

const seperator = /\s+/gmu;

const minLength: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const value = control.value.bio;
  if (value) {
    const valueTrimmed = value.trim();
    const words = valueTrimmed.split(seperator);
    const actual = words.length;
    if (actual < 10) {
      return { minword: true };
    }
  }
  return null;
};

@Component({
  selector: 'app-complete-profile',
  styleUrls: ['./complete-profile.component.scss'],
  templateUrl: './complete-profile.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompleteProfileComponent {
  readonly completeProfile: FormGroup = new FormGroup(
    {
      bio: new FormControl('', [
        Validators.required,
        Validators.pattern('(?:[^.!?]+[.!?]){2,}'),
      ]),
    },
    minLength
  );

  constructor(private _userService: UserService, private _router: Router) {}

  onCompleteProfileSubmitted(completeProfile: FormGroup): void {
    if (completeProfile.invalid) {
      return;
    }
    this._userService
      .completeProfile(completeProfile.value.bio)
      .subscribe({ next: () => this._router.navigateByUrl('leads') });
  }

  getBioError(errors: ValidationErrors) {
    if (errors['required']) {
      return 'Bio is required';
    }
    if (errors['pattern']) {
      return 'Bio should contain at least 2 sentences. Sentence ends with dot "."';
    }
    return 'Bio is incorrect';
  }
}
