import { AddLeadModel } from './../../models/add-lead.model';
import { LeadModel } from './../../models/lead/lead.model';
import { FormGroup } from '@angular/forms';
import { ResponseModel } from './../../models/response.model';
import { Observable, map, tap, catchError, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivityModel } from 'src/app/models/activity/activity.model';

@Injectable({ providedIn: 'root' })
export class LeadService {
  constructor(private _httpClient: HttpClient) {}
  getAllLeads(): Observable<LeadModel[]> {
    return this._httpClient
      .get<ResponseModel<LeadModel[]>>(
        'https://us-central1-courses-auth.cloudfunctions.net/leads'
      )
      .pipe(map((resp) => resp.data));
  }
  getAllLeadsActivities(): Observable<ActivityModel[]> {
    return this._httpClient
      .get<ResponseModel<ActivityModel[]>>(
        'https://us-central1-courses-auth.cloudfunctions.net/leads/activities'
      )
      .pipe(map((resp) => resp.data));
  }

  createLead(leadForm: AddLeadModel): Observable<void> {
    return this._httpClient.post<void>(
      'https://us-central1-courses-auth.cloudfunctions.net/leads',
      {
        data: leadForm,
      }
    );
  }
}
