import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EcourtComponent } from './ecourt.component';

const routes: Routes = [{ path: '', component: EcourtComponent , data: { title: 'E Court', showBreadcrumbs: true }}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EcourtRoutingModule { }
