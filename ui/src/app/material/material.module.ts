import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* Dependent Modules */
import * as Material from '@angular/material';
import { MatRadioModule } from '@angular/material';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    Material.MatToolbarModule,
    Material.MatGridListModule,
    Material.MatFormFieldModule,
    Material.MatInputModule,
    Material.MatCardModule,
    Material.MatSelectModule,
    Material.MatButtonModule,
    Material.MatIconModule,
    Material.MatMenuModule,    
    Material.MatTabsModule,
    Material.MatTableModule,
    Material.MatPaginatorModule,
    Material.MatStepperModule,
    Material.MatSidenavModule,
    Material.MatDividerModule,
    Material.MatCheckboxModule,
    Material.MatTreeModule,
    Material.MatProgressSpinnerModule,
    Material.MatDialogModule,
    Material.MatTooltipModule,
    Material.MatBadgeModule, 
    Material.MatRadioModule,
    Material.MatSortModule
  ],
  exports:[
    Material.MatToolbarModule,
    Material.MatGridListModule,
    Material.MatFormFieldModule,
    Material.MatInputModule,
    Material.MatCardModule,
    Material.MatSelectModule,
    Material.MatButtonModule,
    Material.MatIconModule,
    Material.MatMenuModule,    
    Material.MatTabsModule,
    Material.MatTableModule,
    Material.MatPaginatorModule,
    Material.MatStepperModule,
    Material.MatSidenavModule,
    Material.MatDividerModule,
    Material.MatCheckboxModule,
    Material.MatTreeModule,
    Material.MatProgressSpinnerModule,
    Material.MatDialogModule,
    Material.MatTooltipModule,
    Material.MatBadgeModule,
    Material.MatRadioModule,
    Material.MatSortModule
  ]
})
export class MaterialModule { }
