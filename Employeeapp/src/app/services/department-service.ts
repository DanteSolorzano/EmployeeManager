import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { GetDepartmentResponse } from '../interfaces/department-dtos';

@Service()
export class DepartmentService {

    private http = inject(HttpClient)
    private endPoint = `${environment.apiUrl}/department`

    getAll(): Observable<GetDepartmentResponse[]>{
        return this.http.get<GetDepartmentResponse[]>(`${this.endPoint}/getAll`)
    }        
}
