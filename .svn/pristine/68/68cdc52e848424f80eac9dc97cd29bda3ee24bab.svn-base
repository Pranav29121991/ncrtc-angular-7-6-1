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
import { AppConfig, APP_CONFIG } from '../../config/app-config.interface';
@Component({
  selector: 'ds-home-page',
  styleUrls: ['./home-page.component.scss'],
  templateUrl: './home-page.component.html'
})
export class HomePageComponent implements OnInit {

  site$: Observable<Site>;
  public casetypesearch: any;
  public casenosearch: any;
  public yearsearch: any;
  items: any = [];
  casetype = [];

  constructor(
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
    private route: ActivatedRoute, private cdRef: ChangeDetectorRef, private searchService: SearchService,
    private paginationService: PaginationService,
    public searchConfigurationService: SearchConfigurationService,
    private notificationsService: NotificationsService
  ) {
    this.casetype = this.appConfig.casetype;
  }

  ngOnInit(): void {
    this.site$ = this.route.data.pipe(
      map((data) => data.site as Site),
    );
  }
  findcrnByCaseTypenoyear(): void {
    if (this.casetypesearch != undefined && this.casenosearch != undefined && this.yearsearch != undefined) {
      const queryParams = { 'f.CaseYear': this.yearsearch + ",equals", 'f.CaseType': this.casetypesearch + ",equals", query: "dc.title:" + this.casenosearch };
      console.log(queryParams)
      this.paginationService.updateRouteWithUrl(this.searchConfigurationService.paginationID, ['search'], {
      }, queryParams);
    } else {
      this.notificationsService.info("Enter full Case no!", { name: "Templet" });
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
