import { ChangeDetectorRef, Component, EventEmitter, Injectable, Output } from '@angular/core';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, map, Subscription, switchMap, take,combineLatest as observableCombineLatest, } from 'rxjs';
import { buildPaginatedList, PaginatedList } from '../core/data/paginated-list.model';
import { Item } from '../core/shared/item.model';
import { PageInfo } from '../core/shared/page-info.model';
import { PaginationComponentOptions } from '../shared/pagination/pagination-component-options.model';
import { SortDirection, SortOptions } from '../core/cache/models/sort-options.model';
import { EPerson } from '../core/eperson/models/eperson.model';
import { ItemDataService } from '../core/data/item-data.service';
import { NotificationsService } from '../shared/notifications/notifications.service';
import { CollectionDataService } from '../core/data/collection-data.service';
import { PaginationService } from '../core/pagination/pagination.service';
import { AuthService } from '../core/auth/auth.service';
import { hasValue } from '../shared/empty.util';
import { URLCombiner } from '../core/url-combiner/url-combiner';
import { getAllSucceededRemoteData } from '../core/shared/operators';
import { ReportService } from '../core/data/report.service';
import { Workflowprocesse } from '../core/shared/workflowprocesse-format.model';
import { Bitstream } from '../core/shared/bitstream.model';
import { fadeIn, fadeInOut } from '../shared/animations/fade';

@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {

  readonly DELIMITER = '/';


  parse(value: string): NgbDateStruct | null {
    if (value) {
      const date = value.split(this.DELIMITER);
      return {
        day: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[2], 10)
      };
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    if (date != null) {
      const month = date.month <= 9 ? "0" + date.month : date.month;
      const day = date.day <= 9 ? "0" + date.day : date.day;
      return date ? day + this.DELIMITER + month + this.DELIMITER + date.year : '';
    }


  }
}

@Component({
  selector: 'ds-gst-report',
  templateUrl: './gst-report.component.html',
  styleUrls: ['./gst-report.component.scss'],
  animations: [
    fadeIn,
    fadeInOut
  ],
  providers: [

    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class GstReportComponent  {
  hoveredDate: NgbDate | null = null;
  items$: BehaviorSubject<PaginatedList<Bitstream>> = new BehaviorSubject(buildPaginatedList<Bitstream>(new PageInfo(), []));
  pageInfoState$: BehaviorSubject<PageInfo> = new BehaviorSubject<PageInfo>(undefined);
  config: PaginationComponentOptions;
  sortConfig: SortOptions;
  searching$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  currentSearchQuery: string;
  currentSearchScope: string;
  // The search form
  showdocument: Boolean = false;
  /**
   * The pagination id
   */
  items: any = [];
  finduser: any;
  pageId = 'tl';

  currentPageSubscription: Subscription;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  loder: boolean = false;
  
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
  treename: string = "";
  actiontype: string = "";
  public states: Array<EPerson> = [];
  /**
   * An event fired when the page wsize is changed.
   * Event's payload equals to the newly selected page size.
   */
  @Output() pageSizeChange: EventEmitter<number> = new EventEmitter<number>();

  view: any[] = [700, 400];

  // Options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Document Type';
  showYAxisLabel = true;
  yAxisLabel = 'Page Count';

  // Sample Data
  documentData = [
    {
      "name": "DocumentType1",
      "value": 10
    },
    {
      "name": "DocumentType2",
      "value": 23
    },
    {
      "name": "DocumentType3",
      "value": 45
    },
    {
      "name": "DocumentType4",
      "value": 32
    },
    {
      "name": "DocumentType5",
      "value": 67
    },
    {
      "name": "DocumentType6",
      "value": 89
    },
    {
      "name": "DocumentType7",
      "value": 15
    }
  ];
  constructor(private calendar: NgbCalendar, public formatter: NgbDateParserFormatter,
    private itemDataService: ReportService,
    private notificationsService: NotificationsService,
    private cdRef: ChangeDetectorRef,
    private cds: CollectionDataService,
    private paginationService: PaginationService,
    private authService: AuthService,
  ) {
    this.config = new PaginationComponentOptions();
    this.config.id = this.pageId;
    this.config.pageSize = 20;
    this.config.currentPage = 1;
    this.sortConfig = new SortOptions('dc.title', SortDirection.ASC);
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 30);
    
  }

  onDateSelection(date: NgbDate, datepicker: any) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
      datepicker.close()
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }
  opennewtab(url, itemid) {
    window.open(url + itemid, '_blank');
    
  }
  isHovered(date: NgbDate) {
    return (
      this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }


  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }
  ngOnInit(): void {
  }

  getresult(): void {
    this.loder = true;
    if (hasValue(this.currentPageSubscription)) {
      this.currentPageSubscription.unsubscribe();
      this.paginationService.resetPage(this.config.id);
    }

    const pagination$ = this.paginationService.getCurrentPagination(this.config.id, this.config);
    const sort$ = this.paginationService.getCurrentSort(this.config.id, this.sortConfig);
    let frommonth = this.fromDate.month <= 9 ? "0" + this.fromDate.month : this.fromDate.month;
    let fromday = this.fromDate.day <= 9 ? "0" + this.fromDate.day : this.fromDate.day;
    let tomonth = this.toDate.month <= 9 ? "0" + this.toDate.month : this.toDate.month;
    let today = this.toDate.day <= 9 ? "0" + this.toDate.day : this.toDate.day;
    let startdate: string = this.fromDate.year + "-" + frommonth + "-" + fromday;
    let enddate: string = this.toDate.year + "-" + tomonth + "-" + today;

    this.currentPageSubscription = observableCombineLatest([pagination$, sort$]).pipe(
      switchMap(([currentPagination, currentSort]) => {
        return this.itemDataService._getprogressReportByDate(startdate, enddate, {
          currentPage: currentPagination.currentPage,
          elementsPerPage: currentPagination.pageSize,

        });
      }),
      getAllSucceededRemoteData(),
    ).subscribe((results) => {
      this.loder = false;
      this.items$.next(results.payload);
        //this.items = results.payload.page;
      // console.log(this.items[0].submitter.firstMetadataValue('eperson.firstname'))
      this.pageInfoState$.next(results.payload.pageInfo);
    });



  }

  onPageChange(event) {
    this.loder = true;
    this.pageChange.emit(event);
  }

  /**
   * Emits the current page size when it changes
   * @param event The new page size
   */
  onPageSizeChange(event) {
    this.pageSizeChange.emit(event);
  }
}
