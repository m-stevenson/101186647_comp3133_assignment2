import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Employee, EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css',
})
export class EmployeeListComponent implements OnInit {
  private employeeService = inject(EmployeeService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef)

  employees: Employee[] = [];
  designation = '';
  department = '';
  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.loading = true;
    this.errorMessage = '';

    this.employeeService.getAllEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.message || 'Failed to load employees';
        this.cdr.detectChanges();
      },
    });
  }

  onSearch(): void {
    this.loading = true;
    this.errorMessage = '';

    this.employeeService.searchEmployees(this.designation, this.department).subscribe({
      next: (employees) => {
        this.employees = employees;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.message || 'Search failed';
        this.cdr.detectChanges();
      },
    });
  }

  clearSearch(): void {
    this.designation = '';
    this.department = '';
    this.loadEmployees();
  }

  onDelete(id: string): void {
    const confirmed = window.confirm('Are you sure you want to delete this employee?');
    if (!confirmed) return;

    this.employeeService.deleteEmployeeById(id).subscribe({
      next: () => this.loadEmployees(),
      error: (err) => {
        this.errorMessage = err.message || 'Delete failed';
      },
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}