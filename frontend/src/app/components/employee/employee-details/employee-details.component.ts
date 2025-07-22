import { Component, Input } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { CommonService } from '../../../services/common.service';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-employee-details',
  imports: [SharedModule],
  templateUrl: './employee-details.component.html',
  styleUrl: './employee-details.component.css'
})
export class EmployeeDetailsComponent {
  @Input() employee: any;

  constructor(private cs:CommonService, private dialog: MatDialog,){

  }

    openForm(data: any = null): void {
      const dialogRef = this.dialog.open(EmployeeFormComponent, {
        width: '1000px',
        data: {
        mode: data ? 'E' : 'A',   // 'E' for Edit, 'A' for Add
        employee: data || null
      }
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result) this.getEmployeeDetails();
      });
    }

    getEmployeeDetails() {
  this.cs.getAll(`/employee/${this.employee.id}`).subscribe({
    next: (res: any) => {
      this.employee = res;
    },
    error: (err) => {
      console.error('Failed to fetch employee details:', err);
    }
  });
}
}
