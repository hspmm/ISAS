import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { SettingsService } from '../shared/settings/settings.service';

import { saveAs } from 'file-saver';
import * as JSZip from 'jszip';

@Component({
  selector: 'app-download-dialog',
  templateUrl: './download-dialog.component.html',
  styleUrls: ['./download-dialog.component.scss']
})
export class DownloadDialogComponent implements OnInit {

  downloadForm:FormGroup;
  errorMessage:string;
  
  passwordMatchValidator = function(formControl:FormControl) {
    const password: string = formControl.get('Password').value; // get password from our password form control
    const confirmPassword: string = formControl.get('ConfirmPassword').value; // get password from our confirmPassword form control
    // compare is the password math
    if ((password !== confirmPassword)&& password !=null && confirmPassword!=null) {
      // if they don't match, set an error in our confirmPassword form control

      formControl.get('ConfirmPassword').setErrors({ 'mismatch': true });
    }
  }

  constructor(private fb: FormBuilder,public dialogRef: MatDialogRef<DownloadDialogComponent>,private settingsService: SettingsService) { 
    dialogRef.disableClose = true;
    this.downloadForm = this.fb.group({
      Password: new FormControl('',  Validators.compose([ Validators.required,Validators.minLength(8)])),
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
  OnDownloadClick(){
    this.errorMessage="";
    let passwordDetails=this.downloadForm.controls.Password.value;
    this.settingsService.getKeyInfo(passwordDetails,(response, err) => {
      if (err) {
        this.errorMessage=(err.error.KeyInformationResponse)?err.error.KeyInformationResponse.ErrorText:err.error.Error.Message;
        this.downloadForm.reset();
      } else { 
        this.saveFileAs(response);
        this.dialogRef.close(true);
      }    
    });
  }

  saveFileAs(keyInfo) {
    // var contentDisposition = response.headers("content-disposition");
    // //Retrieve file name from content-disposition 
    // var fileName = contentDisposition.substr(contentDisposition.indexOf("filename=") + 9);
    // fileName = fileName.replace(/\"/g, "");
    // var contentType = response.headers("content-type");
    
    // var blob = new Blob([response], { type: "zip" });
    // saveAs(blob, "test.zip");

    const jszip = new JSZip();
    jszip.file('key.txt', keyInfo);
  
    jszip.generateAsync({ type: 'blob' }).then(function(content) {
      // see FileSaver.js
      saveAs(content, 'ISAS_key.zip');
    });

  }

}
