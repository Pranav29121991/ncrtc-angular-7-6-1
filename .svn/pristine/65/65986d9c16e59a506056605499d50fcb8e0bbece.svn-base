import { ChangeDetectorRef, Component, OnInit, Inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { NotificationsService } from '../shared/notifications/notifications.service';
import { Site } from '../core/shared/site.model';
import { OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SearchService } from '../core/shared/search/search.service';
import { PaginationService } from '../core/pagination/pagination.service';
import { PaginationComponentOptions } from '../shared/pagination/pagination-component-options.model';
import { SearchConfigurationService } from '../core/shared/search/search-configuration.service';
import { PaginatedSearchOptions } from '../shared/search/models/paginated-search-options.model';
import { SearchFilter } from '../shared/search/models/search-filter.model';
import {
  getFirstCompletedRemoteData, getFirstSucceededRemoteData, getRemoteDataPayload, 
  toDSpaceObjectListRD
} from '../core/shared/operators';
import { AppConfig, APP_CONFIG } from '../../config/app-config.interface';
@Component({
  selector: 'ds-migratedata',
  templateUrl: './migratedata.component.html',
  styleUrls: ['./migratedata.component.scss']
})
export class MigratedataComponent implements OnInit {
  public casetypesearch: any;
  public casenosearch: any;
  public yearsearch: any;
  public data = [];
  config1: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'f',
    pageSize: 8000,
    currentPage: 1
  });
  casetype=[];
  constructor(private route: ActivatedRoute, private cdRef: ChangeDetectorRef, private searchService: SearchService,
    private paginationService: PaginationService,
    public searchConfigurationService: SearchConfigurationService,
    private notificationsService: NotificationsService,
    @Inject(APP_CONFIG) protected appConfig: AppConfig,) {
    this.casetype = this.appConfig.casetype;
     }

  ngOnInit(): void {
  }
  GotoMigrate(item) {
    item.lodder = true;
    this.searchService.searchCauseList_UPDATE_CaseFile(
      new PaginatedSearchOptions({
        pagination: this.config1,
        //  filters: [new SearchFilter('f.entityType', ['Causelist'], 'equals'), new SearchFilter('f.Causelistdate', [this.date1], 'equals')]
        filters: [new SearchFilter('cino', [item.cino], ''), new SearchFilter('type', [''+item.type], '')]
      }), 1000, false).pipe(getFirstCompletedRemoteData()).subscribe((rd) => {
      //  this.casenosearch = "";
       // this.yearsearch = "";
       // this.casetypesearch = "";
        var json = JSON.parse(rd.payload.jsonStr);
        item.lodder = false;
        if (json.status == "success") {
          this.data = [];
          this.notificationsService.success("Data migrated successfully", { name: "Templet" });
        } else {
          this.notificationsService.error("Problem in migrated Casefile!", { name: "Templet" });
        }
        this.cdRef.detectChanges();
      })
  }
  findcrnByCaseTypenoyear(): void {
    if (this.casetypesearch != "" && this.casenosearch != "" && this.yearsearch != "") {
      
      this.data = [];
      this.searchService.searchCauseListCaseFile(
        new PaginatedSearchOptions({
           pagination: this.config1,
          //  filters: [new SearchFilter('f.entityType', ['Causelist'], 'equals'), new SearchFilter('f.Causelistdate', [this.date1], 'equals')]
          filters: [new SearchFilter('caseType', [this.casetypesearch], ''), new SearchFilter('caseNumber', [this.casenosearch], ''), new SearchFilter('caseYear', [this.yearsearch], '')]
        }), 1000, false).pipe(getFirstCompletedRemoteData()).subscribe((rd) => {
         // this.casenosearch = "";
         // this.yearsearch = "";
         // this.casetypesearch = "";
          var json = JSON.parse(rd.payload.jsonStr);
          console.log(json)
          this.data = json.data;
          if (this.data.length == 0) {
            this.notificationsService.warning("Case file not found!", { name: "Templet" });
          }
          this.cdRef.detectChanges();
        })

    } else {
      this.notificationsService.warning("Enter full Case no!", { name: "Templet" });
    }
  }
  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length <= 0 ? []
        : this.casetype.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );
}
