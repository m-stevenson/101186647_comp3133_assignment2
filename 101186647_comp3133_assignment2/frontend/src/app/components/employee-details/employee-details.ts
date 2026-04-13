import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Employee, EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './employee-details.html',
  styleUrl: './employee-details.css',
})
export class EmployeeDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private employeeService = inject(EmployeeService);
  private cdr = inject(ChangeDetectorRef);

  employee?: Employee;
  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.errorMessage = 'Employee ID not found';
      this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.employeeService.getEmployeeById(id).subscribe({
      next: (employee) => {
        console.log('next fired');
        console.log('employee:', employee);
        this.employee = employee;
        this.loading = false;
        console.log('loading after set:', this.loading);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to load employee details';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
}