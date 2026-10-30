import { Component, inject, OnInit, signal } from '@angular/core';
import {
  MatDialogRef,
  MatDialogModule
} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { form, required, FormField } from '@angular/forms/signals';
import { GetDepartmentResponse } from '../../interfaces/department-dtos';
import { DepartmentService } from '../../services/department-service';
import { EmployeeService } from '../../services/employee-service';
import { CreateEmployeeRequest } from '../../interfaces/employee-dtos';

@Component({
  imports: [MatDialogModule, MatSelectModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatIconModule, FormField],
  selector: 'app-employee-add-edit',
  styleUrl: './employee-add-edit.scss',
  templateUrl: './employee-add-edit.html',
})
export class EmployeeAddEdit implements OnInit {
  private initialData = { 
    name : '',
    lastname1: '',
    lastname2: '',
    email: '',
    salary: '',
    departmentId: ''
  };

  protected employeeModel = signal(this.initialData);

  protected employeeForm = form(this.employeeModel, (field) => {
    required(field.name);
    required(field.lastname1);
    required(field.lastname2);
    required(field.email);
    required(field.salary);
    required(field.departmentId);
  })

  protected selectedFile = signal<File | null>(null)
  protected departments = signal<GetDepartmentResponse[]>([])

  protected departmentService = inject(DepartmentService)
  protected employeeService = inject(EmployeeService)

  protected dialogRef = inject(MatDialogRef<EmployeeAddEdit>)

  ngOnInit(): void {
    this.departmentService.getAll().subscribe({
      next: resp => this.departments.set(resp),
      error: (e) => console.log(e.error)
    })
  }

  onFileSelected(event:Event):void{
    const input = event.target as HTMLInputElement;
    if(input.files && input.files.length > 0){
      this.selectedFile.set(input.files[0])
    }
  }

  save():void {
    const {name, lastname1, lastname2, email, salary, departmentId} =  this.employeeForm().value()

    const request :CreateEmployeeRequest = {
      name,
      lastname1,
      lastname2,
      email,
      salary: Number(salary),
      departmentId: Number(departmentId)
    }
    if(this.selectedFile()) request.image = this.selectedFile()!;

    this.employeeService.create(request).subscribe({
      next: resp => this.dialogRef.close(true),
      error: (e) => console.log(e.error)
    })
  }

  close():void {
    this.dialogRef.close(false)
  }
}
