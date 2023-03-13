import { isAdminGuard } from './guards/is-admin/is-admin.guard';
import { CreateLeadComponentModule } from './components/create-lead/create-lead.component-module';
import { CreateLeadComponent } from './components/create-lead/create-lead.component';
import { LoggedOutComponentModule } from './components/logged-out/logged-out.component-module';
import { LoggedOutComponent } from './components/logged-out/logged-out.component';
import { AutoLoginGuard } from './guards/auto-login/auto-login.guard';
import { IsVerifiedGuard } from './guards/is-verified/is-verified.guard';
import { HasBioGuard } from './guards/has-bio/has-bio.guard';
import { AuthRoutesModule } from './auth-routes.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LeadsComponent } from './components/leads/leads.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { CompleteProfileComponent } from './components/complete-profile/complete-profile.component';
import { LeadsComponentModule } from './components/leads/leads.component-module';
import { VerifyEmailComponentModule } from './components/verify-email/verify-email.component-module';
import { CompleteProfileComponentModule } from './components/complete-profile/complete-profile.component-module';
import { IsLoggedInGuard } from './guards/is-logged-in/is-logged-in.guard';

@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: 'auth',
        loadChildren: () => AuthRoutesModule,
        canActivate: [AutoLoginGuard],
        data: { leads: 'leads' },
      },
      {
        path: 'leads',
        component: LeadsComponent,
        canActivate: [IsLoggedInGuard, IsVerifiedGuard, HasBioGuard],
        data: {
          login: 'auth/login',
          completeProfile: 'complete-profile',
          verify: 'verify',
        },
      },
      { path: 'verify', component: VerifyEmailComponent },
      { path: 'complete-profile', component: CompleteProfileComponent },
      { path: 'logged-out', component: LoggedOutComponent },
      {
        path: 'create-lead',
        component: CreateLeadComponent,
        canActivate: [isAdminGuard],
        data: { leads: 'leads' },
      },
    ]),
    LeadsComponentModule,
    VerifyEmailComponentModule,
    CompleteProfileComponentModule,
    LoggedOutComponentModule,
    CreateLeadComponentModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
