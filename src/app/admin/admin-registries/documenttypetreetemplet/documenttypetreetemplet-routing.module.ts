import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumenttypetreetempletComponent } from './documenttypetreetemplet.component';

const routes: Routes = [{ path: '', component: DocumenttypetreetempletComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumenttypetreetempletRoutingModule { }
