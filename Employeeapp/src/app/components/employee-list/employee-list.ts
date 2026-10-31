import { Component, inject, OnInit, signal, viewChild, AfterViewInit } from '@angular/core';
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

import Swal from 'sweetalert2'


@Component({
  imports: [ MatButtonModule, MatIconModule, MatPaginatorModule, MatSortModule, MatTableModule, MatInputModule, MatFormFieldModule, CurrencyPipe],
  selector: 'app-employee-list',
  styleUrl: './employee-list.scss',
  templateUrl: './employee-list.html',
})
export class EmployeeList implements OnInit, AfterViewInit {

  readonly dialog = inject(MatDialog);
  protected displayedColumns: string[] = ['image', 'name', 'email', 'salary' , 'department', 'actions'];
  protected dataSource = new MatTableDataSource<GetEmployeeResponse>([]);
  protected paginator = viewChild(MatPaginator);
  protected employees = signal<GetEmployeeResponse[]>([]);
  protected employeeService = inject(EmployeeService);

  ngOnInit(): void {
    this.loadEmployees();
  }

  // Se asigna el paginador una vez que la vista del HTML ya cargó por completo
  ngAfterViewInit(): void {
    const pag = this.paginator();
    if (pag) {
      this.dataSource.paginator = pag;
    }
  }

  private loadEmployees(): void {
    this.employeeService.getAll().subscribe({
      next: (data) => {
        this.employees.set(data);
        // Actualiza el DataSource directamente para forzar el renderizado en la tabla
        this.dataSource.data = data; 
      },
      error: (e) => {
        console.log(e.error);
        this.employees.set([]);
        this.dataSource.data = [];
      }
    });
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
      if(result) this.loadEmployees();
    });
  }

  openEditModal(id:number):void {
    const dialogRef = this.dialog.open(EmployeeAddEdit, {
      width:'450px',
      height:'auto',
      disableClose: true,
      data: { employeeId: id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if(result) this.loadEmployees();
    });
  }

  deleteEmployee(id: number): void {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {

          this.employeeService.delete(id).subscribe({
            next:() => {
              this.loadEmployees();
               Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success"
          });
            },
            error:(e) => console.error(e.error)
          })
        }
        
        
        
      });
  }

}