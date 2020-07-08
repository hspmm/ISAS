import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { UsersService } from '../shared/users/users.service';

@Component({
  selector: 'app-password-dialog',
  templateUrl: './password-dialog.component.html',
  styleUrls: ['./password-dialog.component.scss']
})
export class PasswordDialogComponent implements OnInit {

  passwordResetForm:FormGroup;
  errorMessage:string;

  passwordMatchValidator = function(formControl:FormControl) {
    const password: string = formControl.get('NewPassword').value; // get password from our password form control
    const confirmPassword: string = formControl.get('ConfirmPassword').value; // get password from our confirmPassword form control
    // compare is the password math
    if ((password !== confirmPassword)&& password !=null && confirmPassword!=null) {
      // if they don't match, set an error in our confirmPassword form control

      formControl.get('ConfirmPassword').setErrors({ 'mismatch': true });
    }
}
  
  constructor(private fb: FormBuilder,public dialogRef: MatDialogRef<PasswordDialogComponent>,private usersService: UsersService) {
    dialogRef.disableClose = true;
    this.passwordResetForm = this.fb.group({
      CurrentPassword: new FormControl('',  Validators.compose([ Validators.required,Validators.minLength(8)])),
      NewPassword: new FormControl('', Validators.compose([ Validators.required,Validators.minLength(8)])),
      ConfirmPassword: new FormControl('', Validators.compose([Validators.required]))
    },{
      validator:this.passwordMatchValidator
    }); 
   }

  ngOnInit() {
  }

  OnCancelClick(): void {
    // Close the dialog, return false
    this.dialogRef.close(false);
  }
  OnResetPassword(){
    this.errorMessage="";
    let passwordDetails={
      currentPassword:this.passwordResetForm.controls.CurrentPassword.value,
      newPassword:this.passwordResetForm.controls.NewPassword.value     
    };
    this.usersService.resetUserPassword(passwordDetails,(response, err) => {
      if (err) {
        this.errorMessage=err.error.PasswordResetResponse.ErrorText;
        this.passwordResetForm.reset();
      } else {  
        this.dialogRef.close(true);
      }    
    });
  }

}
