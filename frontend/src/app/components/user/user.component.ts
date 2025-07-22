import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { UserFormComponent } from './user-form/user-form.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-user',
  imports: [SharedModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  users : any[] = [];
  constructor(private dialog : MatDialog, private cs: CommonService){

  }
  displayedColumns: string[] = ['fullname', 'username', 'actions'];

  getAllUsers() {
    this.cs.getAll('users').subscribe((res: any) => {
      this.users = res;
    });
  }
    ngOnInit() {
    this.getAllUsers();
  }

  openForm(data: any = null): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '400px',
      data: {
      mode: data ? 'E' : 'A',   // 'E' for Edit, 'A' for Add
      user: data || null
    }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.getAllUsers();
    });
  }

  deleteUser(id: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.cs.delete('users', id).subscribe(() => {
        this.getAllUsers();
      });
    }
  }

}
