import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { I18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { ProgressReportComponent } from './progress-report.component';

const routes: Routes = [{ path: '', component: ProgressReportComponent, resolve: { breadcrumb: I18nBreadcrumbResolver }, data: { breadcrumbKey: 'auditreport', title: 'auditreport' }  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProgressReportRoutingModule { }
