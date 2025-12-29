
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { buildPaginatedList, PaginatedList } from '../../../core/data/paginated-list.model';
import { RemoteData } from '../../../core/data/remote-data';
import { DocumenttypeService } from '../../../core/data/documenttype.service';
import { DocumentType } from '../../../core/shared/documenttype.model';

import { hasValue } from '../../../shared/empty.util';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { DocumentTypeDtoModel } from '../../../core/eperson/models/documenttype-dto.model';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { getAllSucceededRemoteData, getFirstCompletedRemoteData } from '../../../core/shared/operators';
import { ConfirmationModalComponent } from '../../../shared/confirmation-modal/confirmation-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RequestService } from '../../../core/data/request.service';
import { PageInfo } from '../../../core/shared/page-info.model';
import { NoContent } from '../../../core/shared/NoContent.model';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { FindListOptions } from 'src/app/core/data/find-list-options.model';

@Component({
  selector: 'ds-documenttype',
  templateUrl: './documenttype.component.html',
  styleUrls: ['./documenttype.component.scss']
})
export class DocumenttypeComponent  implements OnInit, OnDestroy {

  
  labelPrefix = 'admin.access-control.documenttype.';

 
  documentType:Observable<RemoteData<PaginatedList<DocumentType>>>;// BehaviorSubject<PaginatedList<DocumentType>> = new BehaviorSubject(buildPaginatedList<DocumentType>(new PageInfo(), []));
  
  documentTypeDto$: BehaviorSubject<PaginatedList<DocumentTypeDtoModel>> = new BehaviorSubject<PaginatedList<DocumentTypeDtoModel>>({} as any);
  
  config: FindListOptions = Object.assign(new FindListOptions(), {
    elementsPerPage: 20
  });
  pageInfoState$: BehaviorSubject<PageInfo> = new BehaviorSubject<PageInfo>(undefined);
  pageConfig: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'elp',
    pageSize: 20,
    currentPage: 1
  });

  
  isDocumentTypeFormShown: boolean;
   
    subs: Subscription[] = [];

  constructor(private documentTypeservice: DocumenttypeService,
    private translateService: TranslateService,
    private notificationsService: NotificationsService,
    private authorizationService: AuthorizationDataService,
    private formBuilder: FormBuilder,
    private router: Router,
    private modalService: NgbModal,
    private paginationService: PaginationService,
    public requestService: RequestService) { }

  ngOnInit(): void {
    this.initialisePage();
  }
 
  initialisePage() {
   
    this.isDocumentTypeFormShown = false;
 
    this.subs.push(this.documentTypeservice.getActivedocumentType().subscribe((documentType: DocumentType) => {
      if (documentType != null && documentType.id) {
        this.isDocumentTypeFormShown = true;
      }
    }));

    this.documentType = this.paginationService.getFindListOptions(this.pageConfig.id, this.config).pipe(
      switchMap((findListOptions: FindListOptions) => {
        return this.documentTypeservice.findAll(findListOptions);
      })
    );
    // this.subs.push(this.documentType$.pipe(
    //   switchMap((documenttype: PaginatedList<DocumentType>) => {
    //     if (documenttype.pageInfo.totalElements > 0) {
    //       return combineLatest(...documenttype.page.map((documenttype) => {
    //         return this.authorizationService.isAuthorized(FeatureID.CanDelete, hasValue(documenttype) ? documenttype.self : undefined).pipe(
    //           map((authorized) => {
    //             const documentDtoModel: DocumentTypeDtoModel = new DocumentTypeDtoModel();
    //             documentDtoModel.ableToDelete = authorized;
    //             documentDtoModel.document = documenttype;
    //             return documentDtoModel;
    //           })
    //         );
    //       })).pipe(map((dtos: DocumentTypeDtoModel[]) => {
    //         return buildPaginatedList(documenttype.pageInfo, dtos);
    //       }));
    //     } else {
    //       // if it's empty, simply forward the empty list
    //       return [documenttype];
    //     }
    //   })).subscribe((value: PaginatedList<DocumentTypeDtoModel>) => {
    //     this.documentTypeDto$.next(value);
    //   this.pageInfoState$.next(value.pageInfo);
    // }));
  }
  ngOnDestroy(): void {
    this.cleanupSubscribes();
    this.paginationService.clearPagination(this.pageConfig.id);
  }
  cleanupSubscribes() {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }
  scrollToTop() {
    (function smoothscroll() {
      const currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
      if (currentScroll > 0) {
        window.requestAnimationFrame(smoothscroll);
        window.scrollTo(0, currentScroll - (currentScroll / 8));
      }
    })();
  }
  getActiveDocumentType(): Observable<DocumentType> {
    //console.log(this.documentTypeservice.getActivedocumentType());
    return this.documentTypeservice.getActivedocumentType();
  }

  isActive(dosumenttype: DocumentType): Observable<boolean> {
    return this.getActiveDocumentType().pipe(
      map((activeDocumentType) => dosumenttype === activeDocumentType)
    );
  }
  toggleEditDocumentType(dosumenttype: DocumentType) {

    this.getActiveDocumentType().pipe(take(1)).subscribe((activeEPerson: DocumentType) => {
      if (dosumenttype === activeEPerson) {
        this.documentTypeservice.cancelEditDocumentType();
        this.isDocumentTypeFormShown = false;
      } else {
        console.log("this Edit Object")
        console.log(dosumenttype)
        this.documentTypeservice.editDocumentType(dosumenttype);
        this.isDocumentTypeFormShown = true;
      }
    });
    
    this.scrollToTop();
  }
  deleteDocumentType(dosumenttype: DocumentType) {
    if (hasValue(dosumenttype.id)) {
      const modalRef = this.modalService.open(ConfirmationModalComponent);
      modalRef.componentInstance.dso = dosumenttype;
      modalRef.componentInstance.headerLabel = 'confirmation-modal.delete-documenttype.header';
      modalRef.componentInstance.infoLabel = 'confirmation-modal.delete-documenttype.info';
      modalRef.componentInstance.cancelLabel = 'confirmation-modal.delete-documenttype.cancel';
      modalRef.componentInstance.confirmLabel = 'confirmation-modal.delete-documenttype.confirm';
      modalRef.componentInstance.brandColor = 'danger';
      modalRef.componentInstance.confirmIcon = 'fas fa-trash';
      modalRef.componentInstance.response.pipe(take(1)).subscribe((confirm: boolean) => {
        if (confirm) {
          if (hasValue(dosumenttype.id)) {
            this.documentTypeservice.delete(dosumenttype.id).pipe(getFirstCompletedRemoteData()).subscribe((restResponse: RemoteData<NoContent>) => {
              debugger;
              if (restResponse.hasSucceeded) {
               // this.notificationsService.success(this.translateService.get(this.labelPrefix + 'notification.deleted.success', {name: dosumenttype.name}));
                this.reset();
              } else {
               // this.notificationsService.error('Error occured when trying to delete Doument Type with id: ' + dosumenttype.id + ' with code: ' + restResponse.statusCode + ' and message: ' + restResponse.errorMessage);
              }
            });
          }
        }
      });
    }
  }

  reset() {
    // this.documentTypeservice.getBrowseEndpoint().pipe(
    //   take(1)
    // ).subscribe((href: string) => {
    //   this.requestService.setStaleByHrefSubstring(href).pipe(take(1)).subscribe(() => {
    //     this.documentTypeservice.cancelEditDocumentType();
    //     this.isDocumentTypeFormShown = false;
    //   });
    // });

    this.documentTypeservice.cancelEditDocumentType();
        this.isDocumentTypeFormShown = false;
    this.paginationService.resetPage(this.pageConfig.id);
  }
 
  
}

