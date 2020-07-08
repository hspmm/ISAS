import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule} from "@angular/platform-browser/animations"
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RolesModule } from './roles/roles.module';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

import { NgxSpinnerModule } from 'ngx-spinner';
import { AppConfig } from './app.config';
import { AuthInterceptor } from './interceptors/auth-interceptor';
import { PasswordDialogComponent } from './password-dialog/password-dialog.component';
import { DownloadDialogComponent } from './download-dialog/download-dialog.component';

/** Http interceptor providers in outside-in order */
export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
];

export function initializeApp(appConfig: AppConfig) {
  return () => appConfig.load();
}

@NgModule({
  declarations: [
    AppComponent,
    ConfirmDialogComponent,
    PasswordDialogComponent,
    DownloadDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RolesModule,
    NgxSpinnerModule
  ],
  providers: [
    AppConfig,
    { 
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppConfig], 
      multi: true 
    },
    httpInterceptorProviders
  ],
  entryComponents: [ConfirmDialogComponent,PasswordDialogComponent,DownloadDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
