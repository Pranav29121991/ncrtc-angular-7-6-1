import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { GstReportComponent } from './gst-report.component';
import { NavbarModule } from '../navbar/navbar.module';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from '../app-routing.module';
import { AppComponent } from '../app.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AppModule } from '../app.module';

@NgModule({
  declarations: [
    AppComponent,
    GstReportComponent
  ],
  imports: [
    CommonModule,
    SharedModule.withEntryComponents(),
    NavbarModule,
    HttpClientModule,
    AppRoutingModule,
    NgxChartsModule,
    AppModule
  ]
})
export class GstReportModule { }
