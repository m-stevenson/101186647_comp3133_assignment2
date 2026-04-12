import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map, Observable } from 'rxjs';

export interface Employee {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  gender?: string;
  designation: string;
  salary: number;
  date_of_joining: string;
  department: string;
  employee_photo?: string;
}

export interface EmployeeInput {
  first_name: string;
  last_name: string;
  email: string;
  gender?: string;
  designation: string;
  salary: number;
  date_of_joining: string;
  department: string;
  employee_photo_base64?: string;
}

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  
  private apollo = inject(Apollo);


  // Queries
  private GET_ALL_EMPLOYEES = gql`
    query {
      getAllEmployees {
        _id
        first_name
        last_name
        email
        gender
        designation
        salary
        date_of_joining
        department
        employee_photo
      }
    }
  `;

  private GET_EMPLOYEE_BY_ID = gql`
    query GetEmployeeById($eid: ID!) {
      getEmployeeById(eid: $eid) {
        _id
        first_name
        last_name
        email
        gender
        designation
        salary
        date_of_joining
        department
        employee_photo
      }
    }
  `;

  private SEARCH_EMPLOYEES = gql`
    query SearchEmployees($designation: String, $department: String) {
      searchEmployees(designation: $designation, department: $department) {
        _id
        first_name
        last_name
        email
        gender
        designation
        salary
        date_of_joining
        department
        employee_photo
      }
    }
  `;

  private ADD_EMPLOYEE = gql`
    mutation AddEmployee(
      $first_name: String!
      $last_name: String!
      $email: String!
      $gender: String
      $designation: String!
      $salary: Float!
      $date_of_joining: String!
      $department: String!
      $employee_photo_base64: String
    ) {
      addEmployee(
        first_name: $first_name
        last_name: $last_name
        email: $email
        gender: $gender
        designation: $designation
        salary: $salary
        date_of_joining: $date_of_joining
        department: $department
        employee_photo_base64: $employee_photo_base64
      ) {
        _id
      }
    }
  `;

  private UPDATE_EMPLOYEE = gql`
    mutation UpdateEmployee(
      $eid: ID!
      $first_name: String
      $last_name: String
      $email: String
      $gender: String
      $designation: String
      $salary: Float
      $date_of_joining: String
      $department: String
      $employee_photo_base64: String
    ) {
      updateEmployee(
        eid: $eid
        first_name: $first_name
        last_name: $last_name
        email: $email
        gender: $gender
        designation: $designation
        salary: $salary
        date_of_joining: $date_of_joining
        department: $department
        employee_photo_base64: $employee_photo_base64
      ) {
        _id
      }
    }
  `;

  private DELETE_EMPLOYEE = gql`
    mutation DeleteEmployeeById($eid: ID!) {
      deleteEmployeeById(eid: $eid)
    }
  `;


  // Service methods
  getAllEmployees(): Observable<Employee[]> {
    return this.apollo
      .query<{ getAllEmployees: Employee[] }>({
        query: this.GET_ALL_EMPLOYEES,
        fetchPolicy: 'no-cache',
      })
      .pipe(
        map((result) => {
          const data = result.data?.getAllEmployees;
          if (!data) throw new Error('Failed to fetch employees');
          return data;
        })
      );
  }

  getEmployeeById(eid: string): Observable<Employee> {
    return this.apollo
      .query<{ getEmployeeById: Employee | null }>({
        query: this.GET_EMPLOYEE_BY_ID,
        variables: { eid },
        fetchPolicy: 'no-cache',
      })
      .pipe(
        map((result) => {
          const data = result.data?.getEmployeeById;
          if (!data) throw new Error('Employee not found');
          return data;
        })
      );
  }

  searchEmployees(designation?: string, department?: string): Observable<Employee[]> {
    return this.apollo
      .query<{ searchEmployees: Employee[] }>({
        query: this.SEARCH_EMPLOYEES,
        variables: {
          designation: designation || null,
          department: department || null,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(
        map((result) => {
          const data = result.data?.searchEmployees;
          if (!data) return [];
          return data;
        })
      );
  }

  addEmployee(input: EmployeeInput): Observable<string> {
    return this.apollo
      .mutate<{ addEmployee: { _id: string } }>({
        mutation: this.ADD_EMPLOYEE,
        variables: input,
      })
      .pipe(
        map((result) => {
          const id = result.data?.addEmployee?._id;
          if (!id) throw new Error('Failed to add employee');
          return id;
        })
      );
  }

  updateEmployee(eid: string, input: Partial<EmployeeInput>): Observable<string> {
    return this.apollo
      .mutate<{ updateEmployee: { _id: string } }>({
        mutation: this.UPDATE_EMPLOYEE,
        variables: { eid, ...input },
      })
      .pipe(
        map((result) => {
          const id = result.data?.updateEmployee?._id;
          if (!id) throw new Error('Update failed');
          return id;
        })
      );
  }

  deleteEmployeeById(eid: string): Observable<boolean> {
    return this.apollo
      .mutate<{ deleteEmployeeById: boolean }>({
        mutation: this.DELETE_EMPLOYEE,
        variables: { eid },
      })
      .pipe(
        map((result) => {
          return !!result.data?.deleteEmployeeById;
        })
      );
  }
}