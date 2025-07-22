import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { SharedModule } from '../../shared/shared.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [SharedModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  message = '';
  error = '';
  success: any;
  constructor(private fb: FormBuilder, private cs: CommonService, private router: Router) {
    this.forgotForm = this.fb.group({
      username: ['', Validators.required],
       newPassword: ['', Validators.required],
       confirmPassword: ['', Validators.required]
    });
  }

  // submit() {
  // if (this.forgotForm.valid) {
  //   this.cs.forgotPassword(this.forgotForm.value).subscribe({
  //     next: (res: any) => {
  //       this.message = res.message;
  //       this.error = '';
  //     },
  //     error: (err) => {
  //       this.message = '';
  //       this.error = err.error?.error || 'Failed to send reset link';
  //     }
  //   });
  //   }
  // }

   submit() {
    if (this.forgotForm.invalid) {
      this.error = 'All fields are required';
      return;
    }

    const { username, newPassword, confirmPassword } = this.forgotForm.value;

    if (newPassword !== confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    this.cs.resetPassword({ username, newPassword }).subscribe({
      next: (res: any) => {
        this.success = res.message;
        this.error = '';
        setTimeout(() => this.router.navigate(['/components/employee']), 2000);
      },
      error: (err) => {
        this.error = err.error?.error || 'Reset failed';
        this.success = '';
      }
    });
  }

}
