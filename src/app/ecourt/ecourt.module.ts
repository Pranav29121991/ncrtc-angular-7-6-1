import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EcourtRoutingModule } from './ecourt-routing.module';
import { EcourtComponent } from './ecourt.component';
import { ScrollableTabsComponent } from './scrollable-tabs/scrollable-tabs.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [ 
    EcourtComponent,
    ScrollableTabsComponent,
    
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgbModule,
    EcourtRoutingModule
  ],
  bootstrap: [EcourtComponent]
})
export class EcourtModule { }
