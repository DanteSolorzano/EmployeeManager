import { Component, effect, inject, OnInit, signal, viewChild } from '@angular/core';
import { MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

import {
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { EmployeeAddEdit } from '../employee-add-edit/employee-add-edit';
import { GetEmployeeResponse } from '../../interfaces/employee-dtos';
import { EmployeeService } from '../../services/employee-service';
import { CurrencyPipe } from '@angular/common';


@Component({
  imports: [ MatButtonModule, MatIconModule, MatPaginatorModule, MatSortModule, MatTableModule, MatInputModule, MatFormFieldModule, CurrencyPipe],
  selector: 'app-employee-list',
  styleUrl: './employee-list.scss',
  templateUrl: './employee-list.html',
})
export class EmployeeList implements OnInit {

  readonly dialog = inject(MatDialog);
  protected displayedColumns: string[] = ['image', 'name', 'email', 'salary' , 'department', 'actions'];
  protected dataSource = new MatTableDataSource<GetEmployeeResponse>([]);
  protected paginator = viewChild(MatPaginator);
  protected employees = signal<GetEmployeeResponse[]>([]);
  protected employeeService = inject(EmployeeService);

  protected data = inject<{employeeId?: number}>(MAT_DIALOG_DATA{optional: true});
  protected isEditMode = signal<boolean>(false)


  private loadEmployees(): void {
    this.employeeService.getAll().subscribe({
      next: (data) => this.employees.set(data),
      //next: (data) => console.log(data),
      error: (e) => {
        console.log(e.error)
        this.employees.set([])
      }
    })
  }

  constructor() {
    effect(() => {
      this.dataSource.data = this.employees();

      if(this.paginator())
        this.dataSource.paginator = this.paginator()

    })
  }

  ngOnInit(): void {
    this.loadEmployees()
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openCreateModal():void {
    const dialogRef = this.dialog.open(EmployeeAddEdit, {
      width:'450px',
      height:'auto',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result) => {
        if(result) this.loadEmployees()
    })

  }

  openEditModal(id:number):void {
    const dialogRef = this.dialog.open(EmployeeAddEdit, {
      width:'450px',
      height:'auto',
      disableClose: true,
      data: { employeeId: id },

    });

    dialogRef.afterClosed().subscribe((result) => {
        if(result) this.loadEmployees()
    })

  }


}
