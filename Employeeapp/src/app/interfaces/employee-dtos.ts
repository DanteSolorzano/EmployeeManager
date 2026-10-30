export interface CreateEmployeeRequest {
  name: string;
  lastname1: string;
  lastname2: string;
  email: string;
  salary: number;
  image?: File;
  departmentId: number;
}

export interface UpdateEmployeeRequest {
  employeeId: number;
  name: string;
  lastname1: string;
  lastname2: string;
  email: string;
  salary: number;
  image?: File;
  departmentId: number;
}

export interface GetEmployeeResponse {
  employeeId: number;
  name: string;
  lastname1: string;
  lastname2: string;
  email: string;
  salary: number;
  imageUrl: string;
  departmentName: string;
  departmentId: number;
}