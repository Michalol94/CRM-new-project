import { Router } from '@angular/router';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'app-logged-out',
  styleUrls: ['./logged-out.component.scss'],
  templateUrl: './logged-out.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoggedOutComponent {
  constructor(private _router: Router) {}

  navigateToLogin(): void {
    this._router.navigateByUrl('auth/login');
  }
}
