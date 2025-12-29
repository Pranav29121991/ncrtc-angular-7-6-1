import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Bitstream } from '../../core/shared/bitstream.model';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { combineLatest, combineLatest as observableCombineLatest, Observable, of as observableOf, Subscription } from 'rxjs';
import { DynamicFormControlModel, DynamicFormGroupModel, DynamicFormLayout, DynamicFormService, DynamicInputModel, DynamicSelectModel } from '@ng-dynamic-forms/core';
import { FormBuilder, UntypedFormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DynamicCustomSwitchModel } from '../../shared/form/builder/ds-dynamic-form-ui/models/custom-switch/custom-switch.model';
import cloneDeep from 'lodash/cloneDeep';
import { BitstreamDataService } from '../../core/data/bitstream-data.service';
import { getAllSucceededRemoteDataPayload, getFirstCompletedRemoteData, getFirstSucceededRemoteData, getFirstSucceededRemoteDataPayload, getRemoteDataPayload } from '../../core/shared/operators';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { BitstreamFormatDataService } from '../../core/data/bitstream-format-data.service';
import { BitstreamFormat } from '../../core/shared/bitstream-format.model';
import { BitstreamFormatSupportLevel } from '../../core/shared/bitstream-format-support-level';
import { hasValue, hasValueOperator, isEmpty, isNotEmpty } from '../../shared/empty.util';
import { Metadata } from '../../core/shared/metadata.utils';
import { Location } from '@angular/common';
import { RemoteData } from '../../core/data/remote-data';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { getEntityEditRoute } from '../../item-page/item-page-routing-paths';
import { Bundle } from '../../core/shared/bundle.model';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
import { Item } from '../../core/shared/item.model';
import { DsDynamicInputModel } from '../../shared/form/builder/ds-dynamic-form-ui/models/ds-dynamic-input.model';
import { DsDynamicTextAreaModel } from '../../shared/form/builder/ds-dynamic-form-ui/models/ds-dynamic-textarea.model';
import { PrimaryBitstreamService } from '../../core/data/primary-bitstream.service';
import { DocumenttypeTreeService } from 'src/app/core/data/documenttypetree.service';
import { NgbDateAdapter, NgbDatepicker, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DocumentTypeTree } from 'src/app/core/shared/documenttypetree.model';
import { catchError, debounceTime, distinctUntilChanged, mergeMap } from 'rxjs/operators';
import * as moment from 'moment';
import { FormControl, Validators } from '@angular/forms'
import { ConfirmationModalComponent } from 'src/app/shared/confirmation-modal/confirmation-modal.component';
import { NoContent } from 'src/app/core/shared/NoContent.model';
@Component({
  selector: 'ds-edit-bitstream-page',
  styleUrls: ['./edit-bitstream-page.component.scss'],
  templateUrl: './edit-bitstream-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
/**
 * Page component for editing a bitstream
 */
export class EditBitstreamPageComponent implements OnInit, OnDestroy {
  @ViewChild('d', { static: false }) ngbDatepicker11: NgbDatepicker;
  loder: boolean = false;
  DocumentypeTempletForm;
  isDate: Boolean = false;
  isRemarks: Boolean = false;
  isDescripition: Boolean = false;
  hassubschid: Boolean = false;
  public states: Array<DocumentTypeTree> = [];
  public subchidoptions: Array<DocumentTypeTree> = [];
  public subchidDescipitionoptions: Array<DocumentTypeTree> = [];
  showdocument: Boolean = false;
  treename: string = "";
  SelectedTree: DocumentTypeTree;
  public modeldate: NgbDateStruct;
  documentTree_edit: DocumentTypeTree = null;
  edit_documentTree: boolean = false;
  save_documenttypebutton: boolean = true;
  /**
   * The bitstream's remote data observable
   * Tracks changes and updates the view
   */
  bitstreamRD$: Observable<RemoteData<Bitstream>>;

  /**
   * The formats their remote data observable
   * Tracks changes and updates the view
   */
  bitstreamFormatsRD$: Observable<RemoteData<PaginatedList<BitstreamFormat>>>;

  /**
   * The UUID of the primary bitstream for this bundle
   */
  primaryBitstreamUUID: string;

  /**
   * The bitstream to edit
   */
  bitstream: Bitstream;

  /**
   * The originally selected format
   */
  originalFormat: BitstreamFormat;

  /**
   * A list of all available bitstream formats
   */
  formats: BitstreamFormat[];

  /**
   * @type {string} Key prefix used to generate form messages
   */
  KEY_PREFIX = 'bitstream.edit.form.';

  /**
   * @type {string} Key suffix used to generate form labels
   */
  LABEL_KEY_SUFFIX = '.label';

  /**
   * @type {string} Key suffix used to generate form labels
   */
  HINT_KEY_SUFFIX = '.hint';

  /**
   * @type {string} Key prefix used to generate notification messages
   */
  NOTIFICATIONS_PREFIX = 'bitstream.edit.notifications.';

  /**
   * IIIF image width metadata key
   */
  IMAGE_WIDTH_METADATA = 'iiif.image.width';

  /**
   * IIIF image height metadata key
   */
  IMAGE_HEIGHT_METADATA = 'iiif.image.height';

  /**
   * IIIF table of contents metadata key
   */
  IIIF_TOC_METADATA = 'iiif.toc';

  /**
   * IIIF label metadata key
   */
  IIIF_LABEL_METADATA = 'iiif.label';

  /**
   * Options for fetching all bitstream formats
   */
  findAllOptions = { elementsPerPage: 9999 };

  /**
   * The Dynamic Input Model for the file's name
   */
  fileNameModel = new DsDynamicInputModel({
    hasSelectableMetadata: false, metadataFields: [], repeatable: false, submissionId: '',
    id: 'fileName',
    name: 'fileName',
    required: true,
    validators: {
      required: null
    },
    errorMessages: {
      required: 'You must provide a file name for the bitstream'
    }
  });

  /**
   * The Dynamic Switch Model for the file's name
   */
  primaryBitstreamModel = new DynamicCustomSwitchModel({
      id: 'primaryBitstream',
      name: 'primaryBitstream'
    }
  );

  /**
   * The Dynamic TextArea Model for the file's description
   */
  descriptionModel = new DsDynamicTextAreaModel({
    hasSelectableMetadata: false, metadataFields: [], repeatable: false, submissionId: '',
    id: 'description',
    name: 'description',
    rows: 10
  });

  /**
   * The Dynamic Input Model for the selected format
   */
  selectedFormatModel = new DynamicSelectModel({
    id: 'selectedFormat',
    name: 'selectedFormat'
  });

  /**
   * The Dynamic Input Model for supplying more format information
   */
  newFormatModel = new DynamicInputModel({
    id: 'newFormat',
    name: 'newFormat'
  });

  /**
   * The Dynamic Input Model for the iiif label
   */
  iiifLabelModel = new DsDynamicInputModel({
      hasSelectableMetadata: false, metadataFields: [], repeatable: false, submissionId: '',
      id: 'iiifLabel',
      name: 'iiifLabel'
    },
    {
      grid: {
        host: 'col col-lg-6 d-inline-block'
      }
    });
  iiifLabelContainer = new DynamicFormGroupModel({
    id: 'iiifLabelContainer',
    group: [this.iiifLabelModel]
  }, {
    grid: {
      host: 'form-row'
    }
  });

  iiifTocModel = new DsDynamicInputModel({
    hasSelectableMetadata: false, metadataFields: [], repeatable: false, submissionId: '',
    id: 'iiifToc',
    name: 'iiifToc',
  }, {
    grid: {
      host: 'col col-lg-6 d-inline-block'
    }
  });
  iiifTocContainer = new DynamicFormGroupModel({
    id: 'iiifTocContainer',
    group: [this.iiifTocModel]
  }, {
    grid: {
      host: 'form-row'
    }
  });

  iiifWidthModel = new DsDynamicInputModel({
    hasSelectableMetadata: false, metadataFields: [], repeatable: false, submissionId: '',
    id: 'iiifWidth',
    name: 'iiifWidth',
  }, {
    grid: {
      host: 'col col-lg-6 d-inline-block'
    }
  });
  iiifWidthContainer = new DynamicFormGroupModel({
    id: 'iiifWidthContainer',
    group: [this.iiifWidthModel]
  }, {
    grid: {
      host: 'form-row'
    }
  });

  iiifHeightModel = new DsDynamicInputModel({
    hasSelectableMetadata: false, metadataFields: [], repeatable: false, submissionId: '',
    id: 'iiifHeight',
    name: 'iiifHeight'
  }, {
    grid: {
      host: 'col col-lg-6 d-inline-block'
    }
  });
  iiifHeightContainer = new DynamicFormGroupModel({
    id: 'iiifHeightContainer',
    group: [this.iiifHeightModel]
  }, {
    grid: {
      host: 'form-row'
    }
  });

  /**
   * All input models in a simple array for easier iterations
   */
  inputModels = [this.fileNameModel, this.primaryBitstreamModel, this.descriptionModel, this.selectedFormatModel,
    this.newFormatModel];

  /**
   * The dynamic form fields used for editing the information of a bitstream
   * @type {(DynamicInputModel | DynamicTextAreaModel)[]}
   */
  formModel: DynamicFormControlModel[] = [
    new DynamicFormGroupModel({
      id: 'fileNamePrimaryContainer',
      group: [
        this.fileNameModel,
        this.primaryBitstreamModel
      ]
    }, {
      grid: {
        host: 'form-row'
      }
    }),
    new DynamicFormGroupModel({
      id: 'descriptionContainer',
      group: [
        this.descriptionModel
      ]
    }),
    new DynamicFormGroupModel({
      id: 'formatContainer',
      group: [
        this.selectedFormatModel,
        this.newFormatModel
      ]
    })
  ];

  /**
   * The base layout of the "Other Format" input
   */
  newFormatBaseLayout = 'col col-sm-6 d-inline-block';

  /**
   * Layout used for structuring the form inputs
   */
  formLayout: DynamicFormLayout = {
    fileName: {
      grid: {
        host: 'col col-sm-8 d-inline-block'
      }
    },
    primaryBitstream: {
      grid: {
        host: 'col col-sm-4 d-inline-block switch border-0'
      }
    },
    description: {
      grid: {
        host: 'col-12 d-inline-block'
      }
    },
    embargo: {
      grid: {
        host: 'col-12 d-inline-block'
      }
    },
    selectedFormat: {
      grid: {
        host: 'col col-sm-6 d-inline-block'
      }
    },
    newFormat: {
      grid: {
        host: this.newFormatBaseLayout + ' invisible'
      }
    },
    fileNamePrimaryContainer: {
      grid: {
        host: 'row position-relative'
      }
    },
    descriptionContainer: {
      grid: {
        host: 'row'
      }
    },
    formatContainer: {
      grid: {
        host: 'row'
      }
    }
  };

  /**
   * The form group of this form
   */
  formGroup: UntypedFormGroup;

  /**
   * The ID of the item the bitstream originates from
   * Taken from the current query parameters when present
   * This will determine the route of the item edit page to return to
   */
  itemId: string;

  /**
   * The entity type of the item the bitstream originates from
   * Taken from the current query parameters when present
   * This will determine the route of the item edit page to return to
   */
  entityType: string;

  /**
   * Set to true when the parent item supports IIIF.
   */
  isIIIF = false;

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   * @type {Array}
   */
  protected subs: Subscription[] = [];

  /**
   * The parent bundle containing the Bitstream
   * @private
   */
  private bundle: Bundle;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private changeDetectorRef: ChangeDetectorRef,
              private location: Location,
              private formService: DynamicFormService,
              private translate: TranslateService,
              private bitstreamService: BitstreamDataService,
              public dsoNameService: DSONameService,
              private notificationsService: NotificationsService,
    private bitstreamFormatService: BitstreamFormatDataService,
    private documenttypeTreeService: DocumenttypeTreeService,
    private primaryBitstreamService: PrimaryBitstreamService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
  ) {
    this.DocumentypeTempletForm = this.formBuilder.group({
      documenttypeSelect: ['', [Validators.required]],
      documentDate: [],
      documentRemark: [],
      DocumentDescription: [],
      documentsubchild: [''],
      documentsubchildDescription: ['']
    })
  }

  /**
   * Initialize the component
   * - Create a FormGroup using the FormModel defined earlier
   * - Subscribe on the route data to fetch the bitstream to edit and update the form values
   * - Translate the form labels and hints
   */


  findDocumentByBitstrem(bitstremid) {
    //get DocumentTypeTree On load if Exites
    this.documenttypeTreeService._getDocTypeByBitstreamID(bitstremid).pipe(
      getFirstSucceededRemoteData(),
      getRemoteDataPayload(),
      take(1)
    ).subscribe((documentypetree: DocumentTypeTree) => {
      this.documentTree_edit = documentypetree;
      this.save_documenttypebutton = false;

    })
    this.changeDetectorRef.detectChanges();

  }
  formatedate(dateuse) {
    return moment(dateuse).local().format('MM/DD/YYYY HH:mm')
  }

  editDocumentTree() {
    this.edit_documentTree = true;
    this.save_documenttypebutton = true;

    this.isRemarks = this.documentTree_edit.templetTree.isRemark;
    this.isDate = this.documentTree_edit.templetTree.isDate;
    this.isDescripition = this.documentTree_edit.templetTree.isDescription;
    this.changeDetectorRef.detectChanges();

    //this.DocumentypeTempletForm.controls['isDate'].patchValue(this.documentTree_edit.doc_date,{onlySelf: true});
    if (this.documentTree_edit.templetTree.isDate) {
      let date1 = new Date(this.documentTree_edit.doc_date)
      let datedoc = { day: date1.getDate(), month: date1.getMonth() + 1, year: date1.getFullYear() }
      this.modeldate = datedoc;

    }
    this.DocumentypeTempletForm.controls['documenttypeSelect'].patchValue(this.documentTree_edit.templetTree.documentType.documenttypename, { onlySelf: true });
    this.DocumentypeTempletForm.controls['documentRemark'].patchValue(this.documentTree_edit.remarkdesc, { onlySelf: true });
    this.DocumentypeTempletForm.controls['DocumentDescription'].patchValue(this.documentTree_edit.desc, { onlySelf: true });
    this.SelectedTree = this.documentTree_edit.templetTree;
    this.changeDetectorRef.detectChanges();
  }
  deleteDocumenttypeEdit() {
    console.log(this.documentTree_edit)

    let node = this.documentTree_edit;
    if (hasValue(node.id)) {
      const modalRef = this.modalService.open(ConfirmationModalComponent);
      modalRef.componentInstance.dso = node;
      modalRef.componentInstance.headerLabel = 'Delete Document Type';
      modalRef.componentInstance.infoLabel = 'Are you sure you want to delete document Type ?';
      modalRef.componentInstance.cancelLabel = 'confirmation-modal.delete-documenttype.cancel';
      modalRef.componentInstance.confirmLabel = 'confirmation-modal.delete-documenttype.confirm';
      modalRef.componentInstance.brandColor = 'danger';
      modalRef.componentInstance.confirmIcon = 'fas fa-trash';
      modalRef.componentInstance.response.pipe(take(1)).subscribe((confirm: boolean) => {
        if (confirm) {
          this.documenttypeTreeService.delete(node.id).pipe(getFirstCompletedRemoteData()).subscribe((restResponse: RemoteData<NoContent>) => {
            if (restResponse.hasSucceeded) {
              if (this.documentTree_edit.isSubchild) {
                this.documenttypeTreeService._getChildNodeByparentID(this.documentTree_edit.templetTree.id, false).pipe(
                  getFirstSucceededRemoteData(),
                  getFirstCompletedRemoteData(),
                ).subscribe((response: RemoteData<PaginatedList<DocumentTypeTree>>) => {
                  if (response.payload.pageInfo.totalElements == 0) {
                    this.documenttypeTreeService.delete(this.documentTree_edit.templetTree.id).pipe(getFirstCompletedRemoteData()).subscribe((restResponse: RemoteData<NoContent>) => {
                      if (restResponse.hasSucceeded) {
                        this.edit_documentTree = false;
                        this.save_documenttypebutton = true;
                        this.documentTree_edit = null;
                        this.SelectedTree = null;
                        this.changeDetectorRef.detectChanges();
                        this.notificationsService.success("Document type deleted successfully", { name: "" });
                      }
                    })
                  } else {
                    this.edit_documentTree = false;
                    this.save_documenttypebutton = true;
                    this.documentTree_edit = null;
                    this.SelectedTree = null;
                    this.changeDetectorRef.detectChanges();
                    this.notificationsService.success("Document type deleted successfully", { name: "" });
                  }


                })
              } else {
                this.edit_documentTree = false;
                this.save_documenttypebutton = true;
                this.documentTree_edit = null;
                this.SelectedTree = null;
                this.changeDetectorRef.detectChanges();
                this.notificationsService.success("Document type deleted successfully", { name: "" });
              }

            } else {
              this.notificationsService.error("Something went wrong please try again", { name: "" });
            }
          })
        }
      })
    }
  }
  onAdd() {

    if (this.documentTree_edit != null) {
      let documentTypeTreeObj: DocumentTypeTree = this.getdocumentTypeTreeObj(true)
      this.documenttypeTreeService.updateDocumentTypeTree(documentTypeTreeObj).pipe(
        getFirstCompletedRemoteData(),
      ).subscribe((response: RemoteData<DocumentTypeTree>) => {
        // console.log(response)
        if (response.hasSucceeded) {
          this.isRemarks = false;
          this.isDate = false;
          this.isDescripition = false;

          this.showdocument = false;
          this.treename = '';
          this.SelectedTree = null;
          this.notificationsService.success("Document Type Update success", { name: "Templet" });
          this.documentTree_edit = response.payload;

          this.save_documenttypebutton = false;
          // this.findDocumentByBitstrem(this.bitstream.id);
          this.DocumentypeTempletForm.reset();
          this.changeDetectorRef.detectChanges();
        } else {
          this.notificationsService.error("Something went wrong", { name: "Templet" });
        }
      })

    } else {
      if (this.SelectedTree.hasSubChild) {
        if (this.DocumentypeTempletForm.get("documentsubchildDescription").value == "" && this.DocumentypeTempletForm.get("documentsubchild").value == "") {
          //nomal document type addd here whiout haschild
          let documentTypeTreeObj: DocumentTypeTree = this.getdocumentTypeTreeObj(true)

          this.documenttypeTreeService.createDocumentypeTemplet(documentTypeTreeObj).pipe(
            getFirstCompletedRemoteData(),
          ).subscribe((response: RemoteData<DocumentTypeTree>) => {
            // console.log(response)
            if (response.hasSucceeded) {
              this.isRemarks = false;
              this.isDate = false;
              this.isDescripition = false;

              this.showdocument = false;
              this.treename = '';

              this.save_documenttypebutton = false;

              this.SelectedTree = null;
              this.notificationsService.success("Document Type Added success", { name: "Templet" });
              this.documentTree_edit = response.payload;
              // this.findDocumentByBitstrem(this.bitstream.id);
              this.DocumentypeTempletForm.reset();
              this.changeDetectorRef.detectChanges();


            } else {
              this.notificationsService.error("Something went wrong", { name: "Templet" });
            }
          })
        }
        else if (this.DocumentypeTempletForm.get("documentsubchildDescription").value == "") {
          //this condition true when hassubchid and not select any descrition
          let documentTypeTreeObj: DocumentTypeTree = this.getdocumentTypeTreeObjPrent(true)

          this.documenttypeTreeService.createDocumentypeTemplet(documentTypeTreeObj).pipe(
            getFirstCompletedRemoteData(),
          ).subscribe((response: RemoteData<DocumentTypeTree>) => {
            // console.log(response)
            if (response.hasSucceeded) {
              this.isRemarks = false;
              this.isDate = false;
              this.isDescripition = false;

              this.showdocument = false;
              this.treename = '';

              this.save_documenttypebutton = false;
              if (this.SelectedTree.hasSubChild) {
                let documentTypeTreeObjSubchid: DocumentTypeTree = this.getdocumentTypeTreeObjSubChid(response.payload);
                this.documenttypeTreeService.createDocumentypeTemplet(documentTypeTreeObjSubchid).pipe(
                  getFirstCompletedRemoteData(),
                ).subscribe((response: RemoteData<DocumentTypeTree>) => {
                  if (response.hasSucceeded) {
                    this.notificationsService.success("Document Type Added success", { name: "Templet" });
                    this.save_documenttypebutton = false;
                    this.documentTree_edit = response.payload;
                    // this.findDocumentByBitstrem(this.bitstream.id);
                    this.DocumentypeTempletForm.reset();
                    this.changeDetectorRef.detectChanges();
                  }
                })
              } else {
                this.SelectedTree = null;
                this.notificationsService.success("Document Type Added success", { name: "Templet" });
                this.documentTree_edit = response.payload;
                // this.findDocumentByBitstrem(this.bitstream.id);
                this.DocumentypeTempletForm.reset();
                this.changeDetectorRef.detectChanges();
              }

            } else {
              this.notificationsService.error("Something went wrong", { name: "Templet" });
            }
          })
        } else {
          let parentTree: DocumentTypeTree = this.DocumentypeTempletForm.get("documentsubchildDescription").value;
          let documentTypeTreeObjSubchid: DocumentTypeTree = this.getdocumentTypeTreeObjSubChid(parentTree);
          this.documenttypeTreeService.createDocumentypeTemplet(documentTypeTreeObjSubchid).pipe(
            getFirstCompletedRemoteData(),
          ).subscribe((response: RemoteData<DocumentTypeTree>) => {
            if (response.hasSucceeded) {
              this.notificationsService.success("Document Type Added success", { name: "Templet" });
              this.save_documenttypebutton = false;
              this.documentTree_edit = response.payload;
              // this.findDocumentByBitstrem(this.bitstream.id);
              this.DocumentypeTempletForm.reset();
              this.changeDetectorRef.detectChanges();
            }
          })
        }

      } else {
        //nomal document type addd here whiout haschild
        let documentTypeTreeObj: DocumentTypeTree = this.getdocumentTypeTreeObj(true)

        this.documenttypeTreeService.createDocumentypeTemplet(documentTypeTreeObj).pipe(
          getFirstCompletedRemoteData(),
        ).subscribe((response: RemoteData<DocumentTypeTree>) => {
          // console.log(response)
          if (response.hasSucceeded) {
            this.isRemarks = false;
            this.isDate = false;
            this.isDescripition = false;

            this.showdocument = false;
            this.treename = '';

            this.save_documenttypebutton = false;

            this.SelectedTree = null;
            this.notificationsService.success("Document Type Added success", { name: "Templet" });
            this.documentTree_edit = response.payload;
            // this.findDocumentByBitstrem(this.bitstream.id);
            this.DocumentypeTempletForm.reset();
            this.changeDetectorRef.detectChanges();


          } else {
            this.notificationsService.error("Something went wrong", { name: "Templet" });
          }
        })
      }

    }

  }
  cancleEdit() {
    this.edit_documentTree = false;
    this.save_documenttypebutton = false;


  }
  ngOnInit(): void {

    this.itemId = this.route.snapshot.queryParams.itemId;
    this.entityType = this.route.snapshot.queryParams.entityType;
    this.findDocumentByBitstrem(this.route.snapshot.paramMap.get('id'))
    this.bitstreamRD$ = this.route.data.pipe(map((data: any) => data.bitstream));
    this.bitstreamFormatsRD$ = this.bitstreamFormatService.findAll(this.findAllOptions);

    const bitstream$ = this.bitstreamRD$.pipe(
      getFirstSucceededRemoteData(),
      getRemoteDataPayload(),
    );

    const allFormats$ = this.bitstreamFormatsRD$.pipe(
      getFirstSucceededRemoteData(),
      getRemoteDataPayload(),
    );

    const bundle$ = bitstream$.pipe(
      switchMap((bitstream: Bitstream) => bitstream.bundle),
      getFirstSucceededRemoteDataPayload(),
    );

    const primaryBitstream$ = bundle$.pipe(
      hasValueOperator(),
      switchMap((bundle: Bundle) => this.bitstreamService.findByHref(bundle._links.primaryBitstream.href)),
      getFirstSucceededRemoteDataPayload(),
    );

    const item$ = bundle$.pipe(
      switchMap((bundle: Bundle) => bundle.item),
      getFirstSucceededRemoteDataPayload(),
    );
    this.subs.push(
      observableCombineLatest(
        bitstream$,
        allFormats$,
        bundle$,
        primaryBitstream$,
        item$,
      ).pipe()
        .subscribe(([bitstream, allFormats, bundle, primaryBitstream, item]) => {
          this.bitstream = bitstream as Bitstream;
          this.formats = allFormats.page;
          this.bundle = bundle;
          // hasValue(primaryBitstream) because if there's no primaryBitstream on the bundle it will
          // be a success response, but empty
          this.primaryBitstreamUUID = hasValue(primaryBitstream) ? primaryBitstream.uuid : null;
          this.itemId = item.uuid;
          this.setIiifStatus(this.bitstream);
        })
    );

    this.subs.push(
      this.translate.onLangChange
        .subscribe(() => {
          this.updateFieldTranslations();
        })
    );
  }

  /**
   * Initializes the form.
   */
  setForm() {
    this.formGroup = this.formService.createFormGroup(this.formModel);
    this.updateFormatModel();
    this.updateForm(this.bitstream);
    this.updateFieldTranslations();
  }

  /**
   * Update the current form values with bitstream properties
   * @param bitstream
   */
  updateForm(bitstream: Bitstream) {
    this.formGroup.patchValue({
      fileNamePrimaryContainer: {
        fileName: bitstream.name,
        primaryBitstream: this.primaryBitstreamUUID === bitstream.uuid
      },
      descriptionContainer: {
        description: bitstream.firstMetadataValue('dc.description')
      },
      formatContainer: {
        newFormat: hasValue(bitstream.firstMetadata('dc.format')) ? bitstream.firstMetadata('dc.format').value : undefined
      }
    });
    if (this.isIIIF) {
      this.formGroup.patchValue({
        iiifLabelContainer: {
          iiifLabel: bitstream.firstMetadataValue(this.IIIF_LABEL_METADATA)
        },
        iiifTocContainer: {
          iiifToc: bitstream.firstMetadataValue(this.IIIF_TOC_METADATA)
        },
        iiifWidthContainer: {
          iiifWidth: bitstream.firstMetadataValue(this.IMAGE_WIDTH_METADATA)
        },
        iiifHeightContainer: {
          iiifHeight: bitstream.firstMetadataValue(this.IMAGE_HEIGHT_METADATA)
        }
      });
    }
    this.bitstream.format.pipe(
      getAllSucceededRemoteDataPayload()
    ).subscribe((format: BitstreamFormat) => {
      this.originalFormat = format;
      this.formGroup.patchValue({
        formatContainer: {
          selectedFormat: format.id
        }
      });
      this.updateNewFormatLayout(format.id);
    });
  }

  /**
   * Create the list of unknown format IDs an add options to the selectedFormatModel
   */
  updateFormatModel() {
    this.selectedFormatModel.options = this.formats.map((format: BitstreamFormat) =>
      Object.assign({
        value: format.id,
        label: this.isUnknownFormat(format.id) ? this.translate.instant(this.KEY_PREFIX + 'selectedFormat.unknown') : format.shortDescription
      }));
  }

  /**
   * Update the layout of the "Other Format" input depending on the selected format
   * @param selectedId
   */
  updateNewFormatLayout(selectedId: string) {
    if (this.isUnknownFormat(selectedId)) {
      this.formLayout.newFormat.grid.host = this.newFormatBaseLayout;
    } else {
      this.formLayout.newFormat.grid.host = this.newFormatBaseLayout + ' invisible';
    }
  }

  /**
   * Is the provided format (id) part of the list of unknown formats?
   * @param id
   */
  isUnknownFormat(id: string): boolean {
    const format = this.formats.find((f: BitstreamFormat) => f.id === id);
    return hasValue(format) && format.supportLevel === BitstreamFormatSupportLevel.Unknown;
  }

  /**
   * Used to update translations of labels and hints on init and on language change
   */
  private updateFieldTranslations() {
    this.inputModels.forEach(
      (fieldModel: DynamicFormControlModel) => {
        this.updateFieldTranslation(fieldModel);
      }
    );
  }

  /**
   * Update the translations of a DynamicFormControlModel
   * @param fieldModel
   */
  private updateFieldTranslation(fieldModel) {
    fieldModel.label = this.translate.instant(this.KEY_PREFIX + fieldModel.id + this.LABEL_KEY_SUFFIX);
    if (fieldModel.id !== this.primaryBitstreamModel.id) {
      fieldModel.hint = this.translate.instant(this.KEY_PREFIX + fieldModel.id + this.HINT_KEY_SUFFIX);
    }
  }

  /**
   * Fired whenever the form receives an update and changes the layout of the "Other Format" input, depending on the selected format
   * @param event
   */
  onChange(event) {
    const model = event.model;
    if (model.id === this.selectedFormatModel.id) {
      this.updateNewFormatLayout(model.value);
    }
  }

  /**
   * Check for changes against the bitstream and send update requests to the REST API
   */
  onSubmit() {
    const updatedValues = this.formGroup.getRawValue();
    const updatedBitstream = this.formToBitstream(updatedValues);
    const selectedFormat = this.formats.find((f: BitstreamFormat) => f.id === updatedValues.formatContainer.selectedFormat);
    const isNewFormat = selectedFormat.id !== this.originalFormat.id;
    const isPrimary = updatedValues.fileNamePrimaryContainer.primaryBitstream;
    const wasPrimary = this.primaryBitstreamUUID === this.bitstream.uuid;

    let bitstream$;
    let bundle$: Observable<Bundle>;
    let errorWhileSaving = false;

    if (wasPrimary !== isPrimary) {
      let bundleRd$: Observable<RemoteData<Bundle>>;
      if (wasPrimary) {
        bundleRd$ = this.primaryBitstreamService.delete(this.bundle);
      } else if (hasValue(this.primaryBitstreamUUID)) {
        bundleRd$ = this.primaryBitstreamService.put(this.bitstream, this.bundle);
      } else {
        bundleRd$ = this.primaryBitstreamService.create(this.bitstream, this.bundle);
      }

      const completedBundleRd$ = bundleRd$.pipe(getFirstCompletedRemoteData());

      this.subs.push(completedBundleRd$.pipe(
        filter((bundleRd: RemoteData<Bundle>) => bundleRd.hasFailed)
      ).subscribe((bundleRd: RemoteData<Bundle>) => {
        this.notificationsService.error(
          this.translate.instant(this.NOTIFICATIONS_PREFIX + 'error.primaryBitstream.title'),
          bundleRd.errorMessage
        );
        errorWhileSaving = true;
      }));

      bundle$ = completedBundleRd$.pipe(
        map((bundleRd: RemoteData<Bundle>) => {
          if (bundleRd.hasSucceeded) {
            return bundleRd.payload;
          } else {
            return this.bundle;
          }
        })
      );

      this.subs.push(bundle$.pipe(
        hasValueOperator(),
        switchMap((bundle: Bundle) => this.bitstreamService.findByHref(bundle._links.primaryBitstream.href, false)),
        getFirstSucceededRemoteDataPayload()
      ).subscribe((bitstream: Bitstream) => {
        this.primaryBitstreamUUID = hasValue(bitstream) ? bitstream.uuid : null;
      }));

    } else {
      bundle$ = observableOf(this.bundle);
    }
    if (isNewFormat) {
      bitstream$ = this.bitstreamService.updateFormat(this.bitstream, selectedFormat).pipe(
        getFirstCompletedRemoteData(),
        map((formatResponse: RemoteData<Bitstream>) => {
          if (hasValue(formatResponse) && formatResponse.hasFailed) {
            this.notificationsService.error(
              this.translate.instant(this.NOTIFICATIONS_PREFIX + 'error.format.title'),
              formatResponse.errorMessage
            );
          } else {
            return formatResponse.payload;
          }
        })
      );
    } else {
      bitstream$ = observableOf(this.bitstream);
    }

    combineLatest([bundle$, bitstream$]).pipe(
      tap(([bundle]) => this.bundle = bundle),
      switchMap(() => {
        return this.bitstreamService.update(updatedBitstream).pipe(
          getFirstSucceededRemoteDataPayload()
        );
      })
    ).subscribe(() => {
      this.bitstreamService.commitUpdates();
      this.notificationsService.success(
        this.translate.instant(this.NOTIFICATIONS_PREFIX + 'saved.title'),
        this.translate.instant(this.NOTIFICATIONS_PREFIX + 'saved.content')
      );
      if (!errorWhileSaving) {
        this.navigateToItemEditBitstreams();
      }
    });
  }

  /**
   * Parse form data to an updated bitstream object
   * @param rawForm   Raw form data
   */
  formToBitstream(rawForm): Bitstream {
    const updatedBitstream = cloneDeep(this.bitstream);
    const newMetadata = updatedBitstream.metadata;
    Metadata.setFirstValue(newMetadata, 'dc.title', rawForm.fileNamePrimaryContainer.fileName);
    if (isEmpty(rawForm.descriptionContainer.description)) {
      delete newMetadata['dc.description'];
    } else {
      Metadata.setFirstValue(newMetadata, 'dc.description', rawForm.descriptionContainer.description);
    }
    if (this.isIIIF) {
      // It's helpful to remove these metadata elements entirely when the form value is empty.
      // This avoids potential issues on the REST side and makes it possible to do things like
      // remove an existing "table of contents" entry.
      if (isEmpty(rawForm.iiifLabelContainer.iiifLabel)) {

        delete newMetadata[this.IIIF_LABEL_METADATA];
      } else {
        Metadata.setFirstValue(newMetadata, this.IIIF_LABEL_METADATA, rawForm.iiifLabelContainer.iiifLabel);
      }
      if (isEmpty(rawForm.iiifTocContainer.iiifToc)) {
        delete newMetadata[this.IIIF_TOC_METADATA];
      } else {
        Metadata.setFirstValue(newMetadata, this.IIIF_TOC_METADATA, rawForm.iiifTocContainer.iiifToc);
      }
      if (isEmpty(rawForm.iiifWidthContainer.iiifWidth)) {
        delete newMetadata[this.IMAGE_WIDTH_METADATA];
      } else {
        Metadata.setFirstValue(newMetadata, this.IMAGE_WIDTH_METADATA, rawForm.iiifWidthContainer.iiifWidth);
      }
      if (isEmpty(rawForm.iiifHeightContainer.iiifHeight)) {
        delete newMetadata[this.IMAGE_HEIGHT_METADATA];
      } else {
        Metadata.setFirstValue(newMetadata, this.IMAGE_HEIGHT_METADATA, rawForm.iiifHeightContainer.iiifHeight);
      }
    }
    if (isNotEmpty(rawForm.formatContainer.newFormat)) {
      Metadata.setFirstValue(newMetadata, 'dc.format', rawForm.formatContainer.newFormat);
    }
    updatedBitstream.metadata = newMetadata;
    return updatedBitstream;
  }

  /**
   * Cancel the form and return to the previous page
   */
  onCancel() {
    this.navigateToItemEditBitstreams();
  }

  /**
   * When the item ID is present, navigate back to the item's edit bitstreams page,
   * otherwise retrieve the item ID based on the owning bundle's link
   */
  navigateToItemEditBitstreams() {
    this.router.navigate([getEntityEditRoute(this.entityType, this.itemId), 'bitstreams']);
  }

  /**
   * Verifies that the parent item is iiif-enabled. Checks bitstream mimetype to be
   * sure it's an image, excluding bitstreams in the THUMBNAIL or OTHERCONTENT bundles.
   * @param bitstream
   */
  setIiifStatus(bitstream: Bitstream) {

    const regexExcludeBundles = /OTHERCONTENT|THUMBNAIL|LICENSE/;
    const regexIIIFItem = /true|yes/i;

    const isImage$ = this.bitstream.format.pipe(
      getFirstSucceededRemoteData(),
      map((format: RemoteData<BitstreamFormat>) => format.payload.mimetype.includes('image/')));

    const isIIIFBundle$ = this.bitstream.bundle.pipe(
      getFirstSucceededRemoteData(),
      map((bundle: RemoteData<Bundle>) =>
        this.dsoNameService.getName(bundle.payload).match(regexExcludeBundles) == null));

    const isEnabled$ = this.bitstream.bundle.pipe(
      getFirstSucceededRemoteData(),
      map((bundle: RemoteData<Bundle>) => bundle.payload.item.pipe(
        getFirstSucceededRemoteData(),
        map((item: RemoteData<Item>) =>
          (item.payload.firstMetadataValue('dspace.iiif.enabled') &&
            item.payload.firstMetadataValue('dspace.iiif.enabled').match(regexIIIFItem) !== null)
        ))));

    const iiifSub = combineLatest(
      isImage$,
      isIIIFBundle$,
      isEnabled$
    ).subscribe(([isImage, isIIIFBundle, isEnabled]) => {
      if (isImage && isIIIFBundle && isEnabled) {
        this.isIIIF = true;
        this.inputModels.push(this.iiifLabelModel);
        this.formModel.push(this.iiifLabelContainer);
        this.inputModels.push(this.iiifTocModel);
        this.formModel.push(this.iiifTocContainer);
        this.inputModels.push(this.iiifWidthModel);
        this.formModel.push(this.iiifWidthContainer);
        this.inputModels.push(this.iiifHeightModel);
        this.formModel.push(this.iiifHeightContainer);
      }
      this.setForm();
      this.changeDetectorRef.detectChanges();
    });

    this.subs.push(iiifSub);

  }

  /**
   * Unsubscribe from open subscriptions
   */
  ngOnDestroy(): void {
    this.subs
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());
  }

  public highlight(query: string, content: string) {

    if (!query) {
      return content;
    }
    return content.replace(new RegExp(query, "gi"), match => {
      return '<label class="demo">' + match + '</label>';
    });
  }
  getdocumenttypetree(event): void {
    // console.log( "ITEMIDDDD::"+this.itemId)
    if (event.target.value.length > 1) {
      this.states = [];
      this.loder = true;
      this.showdocument = true;
      let typedoc: string = String(event.target.value);
      this.documenttypeTreeService._searchDocumentTreeByDocumentTypeName(typedoc).pipe(
        getFirstSucceededRemoteData(),
        getRemoteDataPayload(),
      ).subscribe((response: PaginatedList<DocumentTypeTree>) => {
        //  console.log(response)
        this.states = [];
        response.page.map((documentypetree: DocumentTypeTree) => {
          //  documentypetree.templetName=this.highlight(typedoc,documentypetree.templetName);

          this.states.push(documentypetree);
        })
        this.loder = false;
        this.changeDetectorRef.detectChanges();
      })
    } else {
      this.showdocument = false;
    }

  }
  selectedTree(tree: DocumentTypeTree) {
    debugger;
    this.isRemarks = tree.isRemark;
    this.isDate = tree.isDate;
    this.isDescripition = tree.isDescription;
    this.showdocument = false;
    this.treename = tree.templetName;
    this.SelectedTree = tree;
    this.hassubschid = tree.hasSubChild;

    this.save_documenttypebutton = true;
    if (tree.hasSubChild) {
      this.subchidoptions = [];
      this.subchidDescipitionoptions = [];
      this.documenttypeTreeService._getChildNodeByparentID(tree.id, true).pipe(
        getFirstSucceededRemoteData(),
        getFirstCompletedRemoteData(),
      ).subscribe((response: RemoteData<PaginatedList<DocumentTypeTree>>) => {
        this.subchidoptions = response.payload.page;
        setTimeout(() => {                           //<<<---using ()=> syntax
          this.changeDetectorRef.detectChanges();
        }, 200);

      })
      this.documenttypeTreeService._getIssubchildNodeByparentID(tree.id, this.itemId).pipe(
        getFirstSucceededRemoteData(),
        getFirstCompletedRemoteData(),
      ).subscribe((response: RemoteData<PaginatedList<DocumentTypeTree>>) => {
        console.log("response.payload.page....", response.payload.page)
        this.subchidDescipitionoptions = response.payload.page;
        setTimeout(() => {                           //<<<---using ()=> syntax
          this.changeDetectorRef.detectChanges();
        }, 200);

      })



    }

  }
  getdocumentTypeTreeObjPrent(isRootOfmaster: Boolean) {
    let docmentTypeTreeObj: DocumentTypeTree = new DocumentTypeTree();
    let item: Item = new Item();
    item.id = this.itemId;

    docmentTypeTreeObj.isTemplet = false;
    delete this.SelectedTree.children;
    docmentTypeTreeObj.templetTree = this.SelectedTree;
    docmentTypeTreeObj.documentType = this.SelectedTree.documentType
    docmentTypeTreeObj.isSubchild = true;
    docmentTypeTreeObj.remarkdesc = this.DocumentypeTempletForm.get("documentRemark").value
    var dd = this.DocumentypeTempletForm.get("documentDate").value;
    if (hasValue(dd)) {
      const month = dd.month < 9 ? "0" + dd.month : dd.month;
      const day = dd.day < 9 ? "0" + dd.day : dd.day;
      docmentTypeTreeObj.doc_date = new Date(dd.year + "-" + month + "-" + day);
    }
    docmentTypeTreeObj.desc = this.DocumentypeTempletForm.get("DocumentDescription").value
    docmentTypeTreeObj.item = item
    docmentTypeTreeObj.isTemplet = false;
    docmentTypeTreeObj.children = [];
    docmentTypeTreeObj.isDate = this.SelectedTree.isDate;
    docmentTypeTreeObj.isDescription = this.SelectedTree.isDescription;
    docmentTypeTreeObj.isRemark = this.SelectedTree.isRemark;
    if (this.documentTree_edit != null) {
      this.documentTree_edit.templetTree = this.SelectedTree;
      this.documentTree_edit.desc = this.DocumentypeTempletForm.get("DocumentDescription").value;
      this.documentTree_edit.remarkdesc = this.DocumentypeTempletForm.get("documentRemark").value;
      if (hasValue(dd)) {
        const month = dd.month < 9 ? "0" + dd.month : dd.month;
        const day = dd.day < 9 ? "0" + dd.day : dd.day;
        this.documentTree_edit.doc_date = new Date(dd.year + "-" + month + "-" + day);
      }
      docmentTypeTreeObj = this.documentTree_edit;
    }
    return docmentTypeTreeObj
  }
  getdocumentTypeTreeObj(isRootOfmaster: Boolean) {
    let docmentTypeTreeObj: DocumentTypeTree = new DocumentTypeTree();
    let item: Item = new Item();
    item.id = this.itemId;
    docmentTypeTreeObj.documentType = this.SelectedTree.documentType
    docmentTypeTreeObj.isTemplet = false;

    docmentTypeTreeObj.templetTree = this.SelectedTree;
    // docmentTypeTreeObj.templetTree.children=[];
    docmentTypeTreeObj.isSubchild = false;
    docmentTypeTreeObj.remarkdesc = this.DocumentypeTempletForm.get("documentRemark").value
    var dd = this.DocumentypeTempletForm.get("documentDate").value;
    if (hasValue(dd)) {
      const month = dd.month < 9 ? "0" + dd.month : dd.month;
      const day = dd.day < 9 ? "0" + dd.day : dd.day;
      docmentTypeTreeObj.doc_date = new Date(dd.year + "-" + month + "-" + day);
    }
    docmentTypeTreeObj.desc = this.DocumentypeTempletForm.get("DocumentDescription").value
    docmentTypeTreeObj.item = item
    docmentTypeTreeObj.index = 0;
    docmentTypeTreeObj.bitstream = this.bitstream;
    docmentTypeTreeObj.children = [];
    docmentTypeTreeObj.isDate = this.SelectedTree.isDate;
    docmentTypeTreeObj.isDescription = this.SelectedTree.isDescription;
    docmentTypeTreeObj.isRemark = this.SelectedTree.isRemark;
    if (this.documentTree_edit != null) {
      this.documentTree_edit.templetTree = this.SelectedTree;
      this.documentTree_edit.desc = this.DocumentypeTempletForm.get("DocumentDescription").value;
      this.documentTree_edit.remarkdesc = this.DocumentypeTempletForm.get("documentRemark").value;
      if (hasValue(dd)) {
        const month = dd.month < 9 ? "0" + dd.month : dd.month;
        const day = dd.day < 9 ? "0" + dd.day : dd.day;
        this.documentTree_edit.doc_date = new Date(dd.year + "-" + month + "-" + day);
      }
      docmentTypeTreeObj = this.documentTree_edit;
    }
    return docmentTypeTreeObj
  }

  getdocumentTypeTreeObjSubChid(perentTree: DocumentTypeTree) {
    let docmentTypeTreeObj: DocumentTypeTree = this.DocumentypeTempletForm.get("documentsubchild").value;
    let item: Item = new Item();
    item.id = this.itemId;
    delete docmentTypeTreeObj.id;
    docmentTypeTreeObj.isTemplet = false;
    delete perentTree.children;
    docmentTypeTreeObj.templetTree = perentTree;
    docmentTypeTreeObj.documentType = docmentTypeTreeObj.documentType;
    docmentTypeTreeObj.isSubchild = true;
    docmentTypeTreeObj.item = item;
    docmentTypeTreeObj.index = docmentTypeTreeObj.index;
    docmentTypeTreeObj.bitstream = this.bitstream
    docmentTypeTreeObj.children = [];
    if (this.documentTree_edit != null) {
      this.documentTree_edit.templetTree = perentTree;
      docmentTypeTreeObj = this.documentTree_edit;
    }
    console.log("docmentTypeTreeObj", docmentTypeTreeObj)
    return docmentTypeTreeObj
  }

}
