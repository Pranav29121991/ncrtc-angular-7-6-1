import { OnDestroy, ChangeDetectorRef, Inject, Component, OnInit, ViewChild, Input, Output, EventEmitter, Injectable, HostListener } from '@angular/core';
import { NgbDateStruct, NgbCalendar, NgbDateAdapter, NgbDatepicker, NgbDatepickerConfig, NgbDateParserFormatter, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SearchService } from '../core/shared/search/search.service';
import { DSpaceObjectType } from '../core/shared/dspace-object-type.model';
import { fadeIn, fadeInOut } from '../shared/animations/fade';
import { PaginatedSearchOptions } from '../shared/search/models/paginated-search-options.model';
import { SearchFilter } from '../shared/search/models/search-filter.model';
import { DOCUMENT } from '@angular/common';

import { EPerson } from '../core/eperson/models/eperson.model';
import { AuthService } from '../core/auth/auth.service';
import { PaginationComponentOptions } from '../shared/pagination/pagination-component-options.model';
import myData from '../../assets/ecourt.json'
import { DocumenttypeTreeService } from '../core/data/documenttypetree.service';
import { DocumentTypeTree } from '../core/shared/documenttypetree.model';
import { NotificationsService } from '../shared/notifications/notifications.service';
import { RemoteData } from '../core/data/remote-data';
import {
  getFirstCompletedRemoteData, getFirstSucceededRemoteData, getRemoteDataPayload,
  toDSpaceObjectListRD
} from '../core/shared/operators';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import {
  Observable,
  Subject,
  
} from 'rxjs';
import { ActivatedRoute, Router, Data } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Bitstream } from '../core/shared/bitstream.model';
import { BitstreamDataService } from '../core/data/bitstream-data.service';
import { ItemDataService } from '../core/data/item-data.service';
import { Item } from '../core/shared/item.model';
import { FindListOptions } from '../core/data/find-list-options.model';
import { RelationshipDataService } from '../core/data/relationship-data.service';
import { FormControl } from '@angular/forms';
/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
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
  selector: 'ds-ecourt',
  templateUrl: './ecourt.component.html',
  styleUrls: ['./ecourt.component.scss'],
  animations: [
    fadeIn,
    fadeInOut
  ],
  providers: [

    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})


export class EcourtComponent implements OnInit,OnDestroy {
  public batchid: any;
  public datajson: any = [];
  public user$: Observable<EPerson>;
  @Input() public tabs: any = [];
  options = new FindListOptions()
  public tab;
  model: NgbDateStruct;
  selectedIndex = -1;
  abc: string;
  leftTabIdx = 0;
  atStart = true;
  atEnd = false;
  items: any = [];
  items1: any = [];
  @Input() causeList: any = [];
  @Input() date1: string;
  @Input() causeItem: any = null;
  @Input() caseFiles: any = {};
  @Input() loder: boolean = true;
  subject = new Subject();
  userList: any = [];
  @Output() emitSelectedTab = new EventEmitter()
  userjocode: string = "";
  causelisttype:string="";
  causelistcode: string = "";
  lockbutton = false;
  @Input() loder2: boolean = false;
  PDFStaticPath: string = "/assets/pdfjs/web/viewer.html?file=";
  public judgeName: any = [];
  urlSafe: SafeResourceUrl;
  public firstimegenratecuselist: boolean = false
  public causelisttypename: string = "";
  public list_purpose_code = [237, 90, 250, 255, 257, 23, 24, 22, 112, 265];
  config1: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'f',
    pageSize: 8000,
    currentPage: 1
  });
  selectedIndexactive: number = null;
  public counter:number=0;
  public noteText= new FormControl();
  isSkatchpad :boolean = false;
  isEraser : boolean = false;
  usePen:boolean = true;
  private modalRef: NgbModalRef;

  constructor(
    @Inject(DOCUMENT) private _document: HTMLDocument,
    private route: ActivatedRoute,
    private itemDataService: ItemDataService,
    protected router: Router,
    public sanitizer: DomSanitizer,
    protected bitstreamDataService: BitstreamDataService,
    protected notificationsService: NotificationsService,
    private documenttypeTreeService: DocumenttypeTreeService,
    private authService: AuthService,
    private dateAdapter: NgbDateAdapter<string>,
    private cdRef: ChangeDetectorRef,
    public relationshipService: RelationshipDataService,
    private searchService: SearchService,
    private calendar: NgbCalendar,
    private config: NgbDatepickerConfig,
    private modalService: NgbModal,) {
    
    this.config.minDate = { year: 1900, month: 1, day: 1 };
    this.config.outsideDays = "hidden";
    this._document.getElementById('appFavicon').setAttribute('href', 'assets/dspace/images/favicons/favicon-ecourt.ico');
    window.addEventListener('beforeunload', this.promptIfSureToRedirect, true);
    
  }
  containsNumber(myString): boolean {
    // Use a regular expression to check if the string contains a number
    return /\d+/.test(myString);
  }
  promptIfSureToRedirect(event) {
    event.preventDefault();
    event.returnValue = 'R u sure You want close Ecourt.';
    return event;
  }
  getshowHidePurpose(code) {
    return this.list_purpose_code.includes(code);
    
  }
  genrateCauseList(): void {
    this.lockbutton = true;
    this.firstimegenratecuselist = true;
    this.navigateEvent();
  }
  ngOnDestroy(): void {
    this._document.getElementById('appFavicon').setAttribute('href', 'assets/dspace/images/favicons/favicon.ico');
  window.addEventListener('beforeunload', this.promptIfSureToRedirect, false);
}
  ngOnInit(): void {
    window.addEventListener('beforeunload', this.promptIfSureToRedirect, true);
   
    this.user$ = this.authService.getAuthenticatedUserFromStore();
    this.user$.subscribe((rd) => {
      //console.log("USer Object");
      this.userList = rd.getjocode.split(",");
      this.userjocode = this.userList[0];
      if (this.userjocode == "") {
        this.notificationsService.warning("E-Court access unavailable. !")
      } else {
        this.userjocode = this.userList[0];
        console.log(this.userjocode)
        this.model = this.calendar.getToday();
        this.dateAdapter.toModel(this.model);
       // this.navigateEvent();
        this.emitSelectedTab.emit(this.tabs[0])
        this.abc = `translateX(0px)`;
      }
     

    })

    // set user


  }
  onSelected(): void{
    this.navigateEvent();
  }
  opennewtab(url, itemid, casefile) {
    casefile.active = true;
    console.log("itemiditemid:::", itemid)
    window.open(url+itemid, '_blank');
  }
  viewSmartPDF(itemtab) {
    itemtab.active1 = true;
    this.bitstreamDataService._getMeargePDFByItemID(itemtab.dspaceobjectid).
      pipe(getFirstCompletedRemoteData(),
        take(1)
      ).subscribe((response: RemoteData<Bitstream>) => {
        if (response.isSuccess) {
          itemtab.bitstream = response.payload;
          let pdfSrc = this.PDFStaticPath + itemtab.bitstream._links.content.href + "&item=" +  itemtab.reg_no +"/"+ itemtab.reg_year;
          this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(pdfSrc);

          const link = this.router.serializeUrl(this.router.createUrlTree(['pdfviewer'], { queryParams: { file: itemtab.bitstream._links.content.href, item:  itemtab.reg_no + "/" + itemtab.reg_year  } })).toString();
          console.log(encodeURI(link))
          window.open(encodeURI(link), '_blank');
          this.cdRef.detectChanges();
          this.cdRef.detectChanges();
         
        } else {
          
        }
      })

    
  }
  getreportstatus(itemcase):boolean {
   
      if (itemcase.dspaceobjectid != undefined && itemcase.dspaceobjectid != null) {
        this.bitstreamDataService._getMeargePDFByItemID(itemcase.dspaceobjectid).
          pipe(getFirstCompletedRemoteData(),
            take(1)
          ).subscribe((response: RemoteData<Bitstream>) => {
            if (response.isSuccess) {
              itemcase.bitstream = response.payload;
              this.cdRef.detectChanges();
              return true;
             
             } else {
              return false;
            }
          })
      } else {
        return false;
      }

   
    
    
  }
  genratesmartview(itemTab) {
    itemTab.lodder = true;
    if (itemTab.dspaceobjectid != null && itemTab.dspaceobjectid != undefined) {
      this.documenttypeTreeService._genrateSmartDocumentView(itemTab.dspaceobjectid).pipe(
        getFirstCompletedRemoteData(),
        take(1)
      ).subscribe((response: RemoteData<DocumentTypeTree>) => {
        if (response.isSuccess) {
          this.bitstreamDataService.findById(response.payload.bitstream.id).pipe(getFirstSucceededRemoteData(),
            getRemoteDataPayload(),
          ).subscribe((bistream: Bitstream) => {

            itemTab.bitstream = bistream;
            this.notificationsService.success("File merged successfully !", { name: "" });
            itemTab.lodder = false;
            this.cdRef.detectChanges();
          })


        } else {
          this.notificationsService.error("Fail to merge files", { name: "" });
          itemTab.lodder = false;
          this.cdRef.detectChanges();
        }


      })
    } else {
      this.notificationsService.error("Item not found in repository !", { name: "" });
    }
    
  }
  public navigateEvent(): void {
     /* this.resetList();
      this.counter = 0;
      this.datajson = [];
      this.tabs = [];
      this.items = [];
      this.items1 = [];
    for (let item of myData) {
      this.tabs.push({ code: item.for_bench_id, data: item, _benchname: item.benchname });
    }*/
    if (this.userjocode == "") {
      this.notificationsService.warning("E-Court access unavailable. !")
    } else {

      this.resetList();
      this.counter = 0;
      this.datajson = [];
      this.tabs = [];
      this.items = [];
      this.items1 = [];
      const month = this.model.month <= 9 ? "0" + this.model.month : this.model.month;
      const day = this.model.day <= 9 ? "0" + this.model.day : this.model.day;
      this.date1 = this.model.year + "-" + month + "-" + day;
     

      this.searchService.searchCauseList(
        new PaginatedSearchOptions({
          dsoTypes: [DSpaceObjectType.ITEM],
          pagination: this.config1,
          filters: [new SearchFilter('f.entityType', ['Causelist'], ''), new SearchFilter('date', [this.date1], ''), new SearchFilter('jocode', [this.userjocode], '')]
        }), 1000, false).pipe(getFirstCompletedRemoteData()).subscribe((rd) => {
          var json = JSON.parse(rd.payload.jsonStr);
          this.lockbutton = false;
          console.log("Befor Sorting..........", json.data,"===========")
          this.loder = false;
          this.datajson = json;
          for (let item of this.datajson) {
              this.tabs.push({ code: item.for_bench_id, data: item, _benchname: item.benchname });
          }

          this.cdRef.detectChanges();
        });
    }
    

  }
 BachCodeExists(Bcode) {
    return this.tabs.some(function (el) {
      return el.code === Bcode;
  });
}
  resetList() {
    this.causeList = [];
    this.caseFiles = [];
    //this.judgeName = [];
    this.causeItem = null;
   
    this.causelisttypename = "";
    this.loder = true;
    this.causelisttype="";
    //this.causelistcode="";
  }
  getsenior(age) {
    if (age == undefined) {
      return false;
    } else if (parseInt(age)>=65) {
      return true;
    } else {
      return false;
    }
  }
  getresponse(responselw) {
    
    let newpet = responselw.split("@");
    // for (var i = 0; i < responselw.length; i++) {
      
    //     newpet.push(responselw[i].adv_name)
    // }
    responselw = Array.from(new Set(newpet));
    var RL = "";
    for (let i = 0; i < responselw.length; i++){
      if (responselw[i] != null && responselw[i] != "null" && responselw[i]!=undefined) {
        RL = RL + "" + responselw[i] + " </br>";
      }
    }
    return RL;
  }
  getpet(responselw) {
    let newpet = responselw.split("@");
    // for (var i = 0; i < responselw.length; i++){
    //   if (responselw[i].type==1)
    //       newpet.push(responselw[i].adv_name)
    // }
     
    responselw = Array.from(new Set(newpet));
    var RL = "";
    for (let i = 0; i < responselw.length; i++) {
      if (responselw[i] != null && responselw[i] != "null" && responselw[i] != undefined) {
        RL = RL + "" + responselw[i] + " </br>";
      }
    }
    return RL;
  }
  //select bench call this method
  selectTab(index, causelistJson) {
    this.batchid = causelistJson
    //console.log(causelistJson)
    this.judgeName = causelistJson.judge;
    this.resetList();
    this.selectedIndex = index
    this.emitSelectedTab.emit(this.tabs[index].code);
    this.causelistcode = this.tabs[index].code;
   // console.log(this.causelistcode)
    this.scrollTab(index - this.leftTabIdx - 1)
    for (let item of causelistJson.causeListType) {
      if (item.causelisttpurpose.causeList.length != 0) {
        this.causeList.push({ cause: item.causelisttypename, data: item });
      }
      
    }
    this.loder = false;
    //this.cdRef.detectChanges();
  }
  CauseListExists(Causetype) {
    return this.causeList.some(function (el) {
      return el.cause === Causetype;
    });
  }
  scrollTab(x) {
    if (this.atStart && x < 0 || this.atEnd && x > 0) {
      return
    }
    this.leftTabIdx = this.leftTabIdx + x
    this.abc = `translateX(${(this.leftTabIdx) * -140}px)`
    this.atStart = this.leftTabIdx === 0
    this.atEnd = this.leftTabIdx === this.tabs.length - 1;

  }
 
// getCaveatCase(MainCaseFile:Item){
 
//   console.log("MainCaseFile",MainCaseFile)
  //  this.relationshipService.getRelatedItemsByLabel(MainCaseFile, 'CaveatCaseOfCaseFile', null).subscribe((rd) => {
  //   return rd.payload.page;
  //  });
// }

  getInfo(cause1: string, index: number, item: any) {
    console.log("===========", item)
    // this.judgeName = item.judge;
    this.causelisttypename = item.causelisttypename;
    this.selectedIndexactive = index;
    this.loder2 = true;
    this.cdRef.detectChanges();
    this.caseFiles = [];
    //item.causelisttpurpose.causeList;
    for (let m = 0; m < item.causelisttpurpose.causeList.length; m++) {
      this.caseFiles.push({ "purpose_cd": item.causelisttpurpose.causeList[m][0].purpose_cd, "causelistType": item.causelisttpurpose.causeList[m][0].purpose_name, "causeList": item.causelisttpurpose.causeList[m] })
      // this.caseFiles[i].causelistType = item.causelisttpurpose.causeList[i][0].purpose_name;
      // this.caseFiles[i].causeList = item.causelisttpurpose.causeList[i]; 
    }
    for (let i = 0; i < this.caseFiles.length; i++) {
    for (let j = 0; j < this.caseFiles[i].causeList.length; j++) {
      if (this.caseFiles[i].causeList[j].caseFile.cino != undefined && this.caseFiles[i].causeList[j].caseFile.cino != null) {
        this.itemDataService._getItemByCino(this.caseFiles[i].causeList[j].caseFile.cino).
          pipe(getFirstCompletedRemoteData(),
            take(1)
        ).subscribe((response: RemoteData<Item>) => { 
          if (response.isSuccess) { 
            this.caseFiles[i].causeList[j].caseFile.dspaceobjectid = response.payload.id;
            this.cdRef.detectChanges();
          }

          this.bitstreamDataService._getMeargePDFByItemID(this.caseFiles[i].causeList[j].caseFile.dspaceobjectid).
            pipe(getFirstCompletedRemoteData(),
              take(1)
            ).subscribe((response: RemoteData<Bitstream>) => {
              if (response.isSuccess) {
                this.caseFiles[i].causeList[j].caseFile.bitstream = response.payload;
                this.cdRef.detectChanges();
              }
            })


        })
        
      }
        

      for (let k = 0; k < this.caseFiles[i].causeList[j].caseFile.civilt2connected[0].length; k++) {
        
      //  console.log(this.caseFiles[i].causeList[j].caseFile.connectedcase[k])
        if (this.caseFiles[i].causeList[j].caseFile.civilt2connected[0][k].cino != undefined && this.caseFiles[i].causeList[j].caseFile.civilt2connected[0][k].cino != null) {
          this.itemDataService._getItemByCino(this.caseFiles[i].causeList[j].caseFile.civilt2connected[0][k].cino).
            pipe(getFirstCompletedRemoteData(),
              take(1)
          ).subscribe((response: RemoteData<Item>) => {
            if (response.isSuccess) {
              this.caseFiles[i].causeList[j].caseFile.civilt2connected[0][k].dspaceobjectid = response.payload.id;
              this.cdRef.detectChanges();
            }
          
          this.bitstreamDataService._getMeargePDFByItemID(this.caseFiles[i].causeList[j].caseFile.civilt2connected[0][k].dspaceobjectid).
            pipe(getFirstCompletedRemoteData(),
              take(1)
            ).subscribe((response: RemoteData<Bitstream>) => {
              if (response.isSuccess) {
                this.caseFiles[i].causeList[j].caseFile.civilt2connected[0][k].bitstream = response.payload;
                this.cdRef.detectChanges();
              }
            })

          })
        }
      }
    }
      if (i == this.caseFiles.length - 1) {
        debugger;
        this.loder2 = false;
        this.cdRef.detectChanges();
      }
  }
    
    this.cdRef.detectChanges();
  
  }

  getFromCharCode(index) {
    return String.fromCharCode(index);
  }
  
  itemId:string = '';
  penColor : string = '#0000ff';
  noteinfo: '';
  sketchpadCheckBox = new FormControl(true);
  smartnote :boolean = false;
  myDivStyle = {};
  viewSmartNote(modal: any, id: string, event: MouseEvent) {
      // Get the position of the clicked card
      const target = event.target as HTMLElement;
      const rect = target.getBoundingClientRect();
  
      // Set styles for `myDiv` based on card's position
      this.myDivStyle = {
        position: 'absolute',
        top: `${rect.top + window.scrollY - 10}px`,  // Adjust position if needed
        // left: `${rect.left + window.scrollX +240}px`,  // Adjust position if needed
        display: 'block'
      };
  
    this.smartnote = true;
    this.isSkatchpad = true;
    this.itemId = id;
    // this.modalRef = this.modalService.open(modal, { size: 'md',modalDialogClass: 'notepad1' });
  }

  closeNote() {
    this.smartnote = false;
  }
  setPenColor(color: string) {
    if(color === '#ffffff') {
      this.isEraser = true;
    } else {
      this.isEraser = false;
    }
    this.penColor = color;
  }
  
  noteTextInput(event:any) {
    
  }

  sketchpadChangeEvent(event,modal) {
    this.modalService.open(modal).result.then(
      (result) => {
        if (result === 'ok') {
          if(event.target.checked) {
            this.isSkatchpad = true;
            this.cdRef.detectChanges();
          } else {
            this.isSkatchpad = false;
            this.noteText.patchValue('');
            this.cdRef.detectChanges();
            let data :any =[];
           data.push({text:this.noteText.value});
          // this.saveNotes();
          }
        } else {
          if(event.target.checked) {
            event.target.checked = false
          } else {
            event.target.checked = true;
          }
        }
      });
  }
  
 
}


