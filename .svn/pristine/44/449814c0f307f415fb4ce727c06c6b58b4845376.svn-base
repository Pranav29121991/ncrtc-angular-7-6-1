import { ChangeDetectorRef,Component, OnInit,ViewChild,Input } from '@angular/core';
import { NgbPanelChangeEvent, NgbAccordion,NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap'; 
import { Item } from './../../core/shared/item.model';
import { hasValue, isEmpty } from './../../shared/empty.util';
import { FindListOptions } from 'src/app/core/data/find-list-options.model';
import { RelationshipDataService } from 'src/app/core/data/relationship-data.service';

@Component({
  selector: 'ds-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.scss'],
  providers: [NgbAccordionConfig]
})
export class TreeViewComponent implements OnInit {
  @ViewChild('myaccordion', {static : true}) accordion: NgbAccordion;
// @Input() public causeListTree:any=[];
 @Input() public itemTab:Item;
  @Input() pageRoute: string;
  private _caseStatus: string;
  IACase: any = [];
  options = new FindListOptions()
  constructor(config: NgbAccordionConfig, private cdRef: ChangeDetectorRef, public relationshipService: RelationshipDataService) {
    config.closeOthers = true;
    config.type = 'light';
   }

  ngOnInit(): void {
    

    if (!isEmpty(this.itemTab.allMetadataValues('casefile.case.status').toString())) {
      this._caseStatus = this.itemTab.allMetadataValues('casefile.case.status').toString();
    } else if (!isEmpty(this.itemTab.allMetadataValues('causelist.type').toString())) {
      this._caseStatus = this.itemTab.allMetadataValues('causelist.type').toString();
    } else {
      this._caseStatus = null;
    }
    this.IACase = [];
    this.relationshipService.getRelatedItemsByLabel(this.itemTab, 'IACaseOfCaseFile', Object.assign(this.options, { elementsPerPage: 500, currentPage: 1 })).subscribe((rd22) => {
      this.IACase = rd22.payload.page;
      this.IACase.sort((a, b) => (parseInt(b.firstMetadataValue('casefile.case.registrationyear')) - parseInt(a.firstMetadataValue('casefile.case.registrationyear')) || parseInt(b.firstMetadataValue('dc.title')) - parseInt(a.firstMetadataValue('dc.title'))));
      this.cdRef.detectChanges();
    });
  }
  get caseStatus(): string {

    return this._caseStatus;
  }
  beforeChange($event: NgbPanelChangeEvent) {
    console.log($event.panelId);
    // if ($event.panelId === 'panelOne') {
    //   $event.preventDefault();
    // }

    // if ($event.panelId === 'panelTwo' && $event.nextState === false) {
    //   $event.preventDefault();
    // }
  }

  togglePanel(id){
    this.accordion.toggle(id);
  }
  classbager(name: string): string {
    if (name == "Disposed") {
      return "badge-danger";
    } else if (name == "Pending") {
      return "badge-success";
    } else {
      return "badge-info";
    }

  }
}
