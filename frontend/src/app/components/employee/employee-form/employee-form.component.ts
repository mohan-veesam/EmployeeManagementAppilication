import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedModule } from '../../../shared/shared.module';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../services/common.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-employee-form',
  imports: [SharedModule],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css'
})
export class EmployeeFormComponent {
  employeeForm: FormGroup;
  mode: 'A' | 'E'; 
  
  titles: string[] = ['Mr.', 'Ms.', 'Dr.'];
  levels = ['Basic', 'Intermediate', 'Advanced'];

  constructor(private dialogRef: MatDialogRef<EmployeeFormComponent>, 
    private fb:FormBuilder,private cs: CommonService, 
    @Inject(MAT_DIALOG_DATA) public data: any, private snackBar: MatSnackBar,){
   this.mode = data.mode;
    this.employeeForm = this.fb.group({
      saturation: ['Mr.'],
      fullname: [data?.fullname || '', Validators.required],
      phone: [data?.phone || '', Validators.required],
      email: [data?.email || '', Validators.required],
      skills: this.fb.array([this.createSkillGroup()])
    });

    if (this.mode === 'E' && data.employee) {
      this.employeeForm.patchValue(data.employee);
    }
  }
  createSkillGroup(): FormGroup {
    return this.fb.group({
      technology: ['', Validators.required],
      level: ['', Validators.required]
    });
  }
  get skills(): FormArray {
    return this.employeeForm.get('skills') as FormArray;
  }

  addSkill() {
    this.skills.push(this.createSkillGroup());
  }

  removeSkill(index: number) {
    this.skills.removeAt(index);
  }
  onSubmit() {
  if (this.employeeForm.invalid) return;

  const formValue = this.employeeForm.value;

  if (this.mode === 'E') {
    this.cs
      .put('employees', this.data.employee.id, formValue)
      .subscribe({
        next: () => {
          this.snackBar.open('Employee updated successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          });
          this.dialogRef.close(true)
        },
        error: (err) => {
          console.error('Update error:', err);
          alert('Failed to update employee. Check backend connection or data.');
        }
      });
  } else {
    this.cs
      .post('employees', formValue)
      .subscribe({
        next: () => {
          this.snackBar.open('Employee added successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          });
          this.dialogRef.close(true)
        },
        error: (err) => {
          console.error('Add error:', err);
          alert('Failed to add employee. Check backend or form data.');
        },
        
      });
  }
  }

  onCancel() {
    this.dialogRef.close();
  }



}
