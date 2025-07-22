import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedModule } from '../../../shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../services/common.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-form',
  imports: [SharedModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent {
  userForm: FormGroup;
  mode: 'A' | 'E'; 

  constructor(private dialogRef: MatDialogRef<UserFormComponent>, 
  private fb:FormBuilder,private cs: CommonService, 
    @Inject(MAT_DIALOG_DATA) public data: any, private snackBar: MatSnackBar,){
   this.mode = data.mode;
    this.userForm = this.fb.group({
      fullname: [data?.fullname || '', Validators.required],
      username: [data?.username || '', Validators.required],
      password: [data?.password || '', Validators.required],
    });

    if (this.mode === 'E' && data.user) {
      this.userForm.patchValue(data.user);
    }
  }
  onSubmit() {
  if (this.userForm.invalid) return;

  const formValue = this.userForm.value;

  if (this.mode === 'E') {
    this.cs
      .put('users', this.data.user.id, formValue)
      .subscribe({
        next: () => {
          this.snackBar.open('User updated successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          });
          this.dialogRef.close(true)
        },
        error: (err) => {
          console.error('Update error:', err);
          alert('Failed to update uesr. Check backend connection or data.');
        } 
      });
  } else {
    this.cs
      .post('users', formValue)
      .subscribe({
        next: () => {
          this.snackBar.open('Signup successful! Please log in.', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          });
          this.dialogRef.close(true)
        },
        error: (err) => {
          console.error('Add error:', err);
          alert('Failed to add user. Check backend or form data.');
        },
        
      });
  }
}
  onCancel() {
    this.dialogRef.close();
  }
}
