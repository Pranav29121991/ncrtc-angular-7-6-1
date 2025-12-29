import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MigratedataComponent } from './migratedata.component';


const routes: Routes = [{ path: '', component: MigratedataComponent, data: { title: 'CaseFile Migrate', showBreadcrumbs: true } }];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MigratedataRoutingModule { }
