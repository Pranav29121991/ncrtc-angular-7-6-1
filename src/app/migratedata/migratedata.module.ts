import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { MigratedataRoutingModule } from './migratedata-routing.module';
import { MigratedataComponent } from './migratedata.component';


@NgModule({
  declarations: [
    MigratedataComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MigratedataRoutingModule
  ]
})
export class MigratedataModule { }
