import { switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { CredentialsRequest } from './../../models/credentials/credentials/credentials.request';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';

const repeatPasswordValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.value.password;
  const confirmPassword = control.value.confirmPassword;
  if (!password || !confirmPassword) {
    return null;
  }
  if (password !== confirmPassword) {
    return { crossValidator: true };
  }
  return null;
};

@Component({
  selector: 'app-register',
  styleUrls: ['./register.component.scss'],
  templateUrl: './register.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  readonly register: FormGroup = new FormGroup(
    {
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(
          '^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[!@#$%^&*(),.?":{}|<>]).*'
        ),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
      isChecked: new FormControl(false, Validators.requiredTrue),
    },
    repeatPasswordValidator
  );

  constructor(
    private _authService: AuthService,
    private _router: Router,
    private _cdr: ChangeDetectorRef
  ) {}

  onRegisterSubmitted(register: FormGroup): void {
    if (register.invalid) {
      this.register.markAllAsTouched();
      return;
    }
    const credentials: CredentialsRequest = {
      email: register.value.email,
      password: register.value.password,
    };
    this._authService
      .register(credentials)
      .pipe(switchMap((_) => this._authService.login(credentials)))
      .subscribe({
        next: () => {
          this._router.navigateByUrl('leads');
        },
        error: (e) => {
          this.register.setErrors({ backenderror: e.error.message }),
            this._cdr.detectChanges();
        },
      });
  }

  getPasswordError(errors: ValidationErrors) {
    if (errors['required']) {
      return 'Password is required';
    }
    if (errors['minlength']) {
      return 'Password must containt at least 8 characters';
    }
    if (errors['pattern']) {
      return 'Password must contain 1 small letter, 1 capital letter, minimum 8 characters, 1 special sign and 1 number';
    }
    return 'Password is incorrect';
  }
}
