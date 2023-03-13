import { RegisterComponentModule } from './components/register/register.component-module';
import { LoginComponentModule } from './components/login/login.component-module';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
    ]),
    LoginComponentModule,
    RegisterComponentModule,
  ],
})
export class AuthRoutesModule {}
