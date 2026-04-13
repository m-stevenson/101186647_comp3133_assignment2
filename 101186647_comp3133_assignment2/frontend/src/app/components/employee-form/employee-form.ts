import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EmployeeService, EmployeeInput } from '../../services/employee.service';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './employee-form.html',
  styleUrl: './employee-form.css',
})
export class EmployeeFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private employeeService = inject(EmployeeService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEditMode = false;
  employeeId = '';
  selectedBase64 = '';
  errorMessage = '';
  loading = false;
  validationMessage = '';

  form = this.fb.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    gender: [''],
    designation: ['', Validators.required],
    salary: [0, [Validators.required, Validators.min(0)]],
    date_of_joining: ['', Validators.required],
    department: ['', Validators.required],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode = true;
      this.employeeId = id;
      this.loadEmployee(id);
    }
  }

  private formatDateForInput(value: string): string {
    const timestamp = Number(value);

    if (!isNaN(timestamp)) {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    if (value.includes('T')) {
      return value.split('T')[0];
    }

    return value;
  }

  loadEmployee(id: string): void {
    this.loading = true;
    this.errorMessage = '';

    this.employeeService.getEmployeeById(id).subscribe({
      next: (employee) => {
        this.form.patchValue({
          first_name: employee.first_name,
          last_name: employee.last_name,
          email: employee.email,
          gender: employee.gender || '',
          designation: employee.designation,
          salary: employee.salary,
          date_of_joining: this.formatDateForInput(employee.date_of_joining),
          department: employee.department,
        });

        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.message || 'Failed to load employee';
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.selectedBase64 = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    this.validationMessage = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.validationMessage = 'Please fill in all required fields correctly.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const values = this.form.getRawValue();

    const payload: EmployeeInput = {
      first_name: values.first_name!,
      last_name: values.last_name!,
      email: values.email!,
      gender: values.gender || undefined,
      designation: values.designation!,
      salary: Number(values.salary),
      date_of_joining: values.date_of_joining!,
      department: values.department!,
      employee_photo_base64: this.selectedBase64 || undefined,
    };

    if (this.isEditMode) {
      this.employeeService.updateEmployee(this.employeeId, payload).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/employees']);
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.message || 'Update failed';
        },
      });
    } else {
      this.employeeService.addEmployee(payload).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/employees']);
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.message || 'Add employee failed';
        },
      });
    }
  }
}