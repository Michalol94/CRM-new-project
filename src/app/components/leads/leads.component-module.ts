import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { LeadsComponent } from './leads.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  declarations: [LeadsComponent],
  providers: [],
  exports: [LeadsComponent],
})
export class LeadsComponentModule {}
