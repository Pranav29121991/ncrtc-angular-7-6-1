import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  DynamicCheckboxModel,
  DynamicFormControlModel,
  DynamicFormLayout,
  DynamicInputModel,
} from '@ng-dynamic-forms/core';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest as observableCombineLatest, Observable, of as observableOf, Subscription } from 'rxjs';
import { debounceTime, switchMap, take } from 'rxjs/operators';
import { PaginatedList } from '../../../../core/data/paginated-list.model';
import { RemoteData } from '../../../../core/data/remote-data';
import {
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteData,
  getRemoteDataPayload
} from '../../../../core/shared/operators';
import { DocumenttypeService } from '../../../../core/data/documenttype.service';
import { DocumentType } from '../../../../core/shared/documenttype.model';
import { hasValue } from '../../../../shared/empty.util';
import { FormBuilderService } from '../../../../shared/form/builder/form-builder.service';
import { NotificationsService } from '../../../../shared/notifications/notifications.service';
import { PaginationComponentOptions } from '../../../../shared/pagination/pagination-component-options.model';
import { AuthService } from '../../../../core/auth/auth.service';
import { AuthorizationDataService } from '../../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../../core/data/feature-authorization/feature-id';
import { ConfirmationModalComponent } from '../../../../shared/confirmation-modal/confirmation-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RequestService } from '../../../../core/data/request.service';
import { NoContent } from '../../../../core/shared/NoContent.model';
import { PaginationService } from '../../../../core/pagination/pagination.service';
import { followLink } from '../../../../shared/utils/follow-link-config.model';

import { Registration } from '../../../../core/shared/registration.model';

@Component({
  selector: 'ds-documenttype-form',
  templateUrl: './documenttype-form.component.html',
  styleUrls: ['./documenttype-form.component.scss']
})
export class DocumenttypeFormComponent implements OnInit, OnDestroy{
  labelPrefix = 'admin.access-control.documenttype.form.';
  formId = 'documenttype-form';
  messagePrefix = 'admin.access-control.documenttype.form';
  documenttypename: DynamicInputModel;
  formModel: DynamicFormControlModel[];
  formLayout: DynamicFormLayout = {
    documenttypeName: {
      grid: {
        host: 'row'
      }
    },
  };

  subs: Subscription[] = [];
  formGroup: FormGroup;
  /**
   * An EventEmitter that's fired whenever the form is being submitted
   */
   @Output() submitForm: EventEmitter<any> = new EventEmitter();

   /**
    * An EventEmitter that's fired whenever the form is cancelled
    */
   @Output() cancelForm: EventEmitter<any> = new EventEmitter();
 
   /**
    * Observable whether or not the admin is allowed to reset the DocumentType's password
    * TODO: Initialize the observable once the REST API supports this (currently hardcoded to return false)
    */
   canReset$: Observable<boolean>;
 
   /**
    * Observable whether or not the admin is allowed to delete the DocumentType
    */
   canDelete$: Observable<boolean>;
 
   /**
    * Observable whether or not the admin is allowed to impersonate the DocumentType
    */
   canImpersonate$: Observable<boolean>;
 
   /**
    * List of subscriptions
    */
  

  documenttypeInitial: DocumentType;

  /**
   * Whether or not this DocumentType is currently being impersonated
   */
  isImpersonated = false;

  /**
   * Subscription to email field value change
   */
  emailValueChangeSubscribe: Subscription;
  constructor(protected changeDetectorRef: ChangeDetectorRef,
    public documenttypeService: DocumenttypeService,
    private formBuilderService: FormBuilderService,
    private translateService: TranslateService,
    private notificationsService: NotificationsService,
    private authService: AuthService,
    private authorizationService: AuthorizationDataService,
    private modalService: NgbModal,
    private paginationService: PaginationService,
    public requestService: RequestService,
   ) { 
    this.subs.push(this.documenttypeService.getActivedocumentType().subscribe((documenttype: DocumentType) => {
      console.log("Constrotort Form")
      console.log(documenttype)
      console.log("Constrotort Form")
      this.documenttypeInitial = documenttype;
      if (hasValue(documenttype)) {
        //this.isImpersonated = this.authService.isImpersonatingUser(eperson.id);
      }
    }));
   }

  ngOnInit(): void {
    this.initialisePage();
  }
  
  /**
   * This method will initialise the page
   */
   initialisePage() {
    observableCombineLatest(
      this.translateService.get(`${this.messagePrefix}.documenttypename`),
    ).subscribe(([documenttypename]) => {
      this.documenttypename = new DynamicInputModel({
        id: 'documenttypename',
        label: 'Document Type',
        name: 'documenttypename',
        validators: {
          required: null,
        },
        required: true,
      });
      this.formModel = [
        this.documenttypename
      ];
      this.formGroup = this.formBuilderService.createFormGroup(this.formModel);
      

      this.subs.push(this.documenttypeService.getActivedocumentType().subscribe((eperson: DocumentType) => {
        this.formGroup.patchValue({
          documenttypename: eperson != null ? eperson.documenttypename : '',
        });

        this.changeDetectorRef.detectChanges();
      }));
      const activeDocumentType$ = this.documenttypeService.getActivedocumentType();
      this.canImpersonate$ = activeDocumentType$.pipe(
        switchMap((documenttype) => {
          if (hasValue(documenttype)) {
            return this.authorizationService.isAuthorized(FeatureID.LoginOnBehalfOf, documenttype.self);
          } else {
            return observableOf(true);
          }
        })
      );
      this.canDelete$ = activeDocumentType$.pipe(
        switchMap((documenttype) => this.authorizationService.isAuthorized(FeatureID.CanDelete, hasValue(documenttype) ? documenttype.self : undefined))
      );
      this.canReset$ = observableOf(true);
    });
  }
  onCancel() {
    this.documenttypeService.cancelEditDocumentType();
    this.cancelForm.emit();
  }
  onSubmit() {
    this.documenttypeService.getActivedocumentType().pipe(take(1)).subscribe(
      (documentType: DocumentType) => {
        const values = {
          documenttypename: this.documenttypename.value,
        };
        if (documentType == null) {
          this.createNewDocumentType(values);
        } else {
          console.log("Edit Document Type...call")
          this.editDocumentType(documentType, values);
        }
      }
    );
  }

  createNewDocumentType(values) {
    const documentTypeToCreate = Object.assign(new DocumentType(), values);

    const response = this.documenttypeService.create(documentTypeToCreate);
    response.pipe(
      getFirstCompletedRemoteData()
    ).subscribe((rd: RemoteData<DocumentType>) => {
      if (rd.hasSucceeded) {
        this.notificationsService.success(this.translateService.get(this.labelPrefix + 'notification.created.success', { name: documentTypeToCreate.name }));
        this.submitForm.emit(documentTypeToCreate);
      } else {
        this.notificationsService.error(this.translateService.get(this.labelPrefix + 'notification.created.failure', { name: documentTypeToCreate.name }));
        this.cancelForm.emit();
      }
    });
   
  }
  editDocumentType(documenttype: DocumentType, values) {
    console.log("inside Edit Data......")
    console.log(DocumentType);
    console.log(values);
    const editedDocumentType = Object.assign(new DocumentType(), {
      id: documenttype.id,
      documenttypename: (hasValue(values.documenttypename) ? values.documenttypename : documenttype.documenttypename),
      _links: documenttype._links,
    });
    const response = this.documenttypeService.updateDocumentType(editedDocumentType);
    response.pipe(getFirstCompletedRemoteData()).subscribe((rd: RemoteData<DocumentType>) => {
      if (rd.hasSucceeded) {
        this.notificationsService.success(this.translateService.get(this.labelPrefix + 'notification.edited.success', { name: editedDocumentType.name }));
        this.submitForm.emit(editedDocumentType);
      } else {
        this.notificationsService.error(this.translateService.get(this.labelPrefix + 'notification.edited.failure', { name: editedDocumentType.name }));
        this.cancelForm.emit();
      }
    });
  }

  impersonate() {
    this.authService.impersonate(this.documenttypeInitial.id);
    this.isImpersonated = true;
  }
   /**
   * Deletes the DocumentType from the Repository. The DocumentType will be the only that this form is showing.
   * It'll either show a success or error message depending on whether the delete was successful or not.
   */
  
  stopImpersonating() {
    this.authService.stopImpersonatingAndRefresh();
    this.isImpersonated = false;
  }
  reset() {
    this.documenttypeService.getActivedocumentType().pipe(take(1)).subscribe((documenttype: DocumentType) => {
      this.requestService.removeByHrefSubstring(documenttype.self);
    });
    this.initialisePage();
  }
  ngOnDestroy(): void {
    this.onCancel();
   
  }

}
