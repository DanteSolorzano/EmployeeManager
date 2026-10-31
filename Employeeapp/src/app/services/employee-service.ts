import { inject, Service } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateEmployeeRequest, GetEmployeeResponse, UpdateEmployeeRequest } from '../interfaces/employee-dtos';

@Service()
export class EmployeeService {
    private http = inject(HttpClient)
    private endPoint = `${environment.apiUrl}/employee`

    getAll(): Observable<GetEmployeeResponse[]>{
        return this.http.get<GetEmployeeResponse[]>(`${this.endPoint}/getAll`)
    } 

    getbyId(id:number): Observable<GetEmployeeResponse>{
        return this.http.get<GetEmployeeResponse>(`${this.endPoint}/getById?id=${id}`)
    } 

    create(request: CreateEmployeeRequest): Observable<void>{
        const formData = new FormData();
        formData.append("Name", request.name);
        formData.append("LastName1", request.lastname1);
        formData.append("LastName2", request.lastname2);
        formData.append("Email", request.email);
        formData.append("Salary", request.salary.toString());
        formData.append("DepartmentId", request.departmentId.toString());
        if (request.image) formData.append("image", request.image);
        
        return this.http.post<void>(`${this.endPoint}/create`, formData)
    } 

    update(request: UpdateEmployeeRequest): Observable<void>{
        const formData = new FormData();

        formData.append("EmployeeId", request.employeeId.toString());
        formData.append("Name", request.name);
        formData.append("LastName1", request.lastname1);
        formData.append("LastName2", request.lastname2);
        formData.append("Email", request.email);
        formData.append("Salary", request.salary.toString());
        formData.append("DepartmentId", request.departmentId.toString());
        if (request.image) formData.append("image", request.image);
        
        return this.http.put<void>(`${this.endPoint}/update`, formData)
    }
    
    delete(employeId:number): Observable<void>{
        return this.http.delete<void>(`${this.endPoint}/delete/${employeId}`)
    } 
}
