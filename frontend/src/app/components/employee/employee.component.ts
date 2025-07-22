import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { EmployeeFormComponent } from './employee-form/employee-form.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from '../../services/common.service';
import { EmployeeDetailsComponent } from "./employee-details/employee-details.component";

@Component({
  selector: 'app-employee',
  imports: [SharedModule, EmployeeDetailsComponent],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent {
  employees: any[] = [];
  skills: any[] = [];
  selectedEmployee: any = null;
  isShow : any =null;

  constructor (private dialog: MatDialog, private cs: CommonService){

  }

  getFullNameWithTitle(employee: any): string {
  return `${employee.saturation} ${employee.fullname}`;
  }
  

  selectEmployee(emp: any) {
    this.selectedEmployee = emp;
   this.isShow =1
  }

  getAllEmployees() {
    this.cs.getAll('employee').subscribe({
      next: (res) => {
        this.employees = res; // ✅ each has 'skills' array
      },
      error: (err) => {
        console.error('Error fetching employees', err);
      }
    });
  }
  
  
  ngOnInit() {
    this.getAllEmployees();
    //this.getAllEmployeesSkills();
  }
  // getAllEmployeesSkills() {
  //   this.cs.getAll('employee_skills').subscribe((res: any) => {
  //     this.skills = res;
  //   });
  // }
  openForm(data: any = null): void {
    const dialogRef = this.dialog.open(EmployeeFormComponent, {
      width: '1000px',
      data: {
      mode: data ? 'E' : 'A',   // 'E' for Edit, 'A' for Add
      employee: data || null
    }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.getAllEmployees();
    });
  }

  deleteEmployee(id: string) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.cs.delete('employees', id).subscribe(() => {
        this.getAllEmployees();
      });
    }
  }

}
