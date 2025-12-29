
import { DOCUMENTTYPE } from './../shared/documenttype.resource-type';
import { Injectable } from '@angular/core';
import { dataService } from './base/data-service.decorator';

import { createSelector, select } from '@ngrx/store';
import { RequestService } from './request.service';
import { Operation } from 'fast-json-patch';
import {  take } from 'rxjs/operators';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { CoreState } from '../core-state.model';
import {  PatchRequest, PutRequest, } from '../data/request.models';
import { getRemoteDataPayload, } from '../shared/operators';
import { Store } from '@ngrx/store';
import { ObjectCacheService } from '../cache/object-cache.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { NotificationsService } from 'src/app/shared/notifications/notifications.service';
import { HttpClient } from '@angular/common/http';
import { DSOChangeAnalyzer } from './dso-change-analyzer.service';
import { DocumentType } from '../shared/documenttype.model';
import { Observable } from 'rxjs';
import { RemoteData } from './remote-data';
import { getFirstCompletedRemoteData, getFirstSucceededRemoteData } from '../shared/operators';
import { find, map } from 'rxjs/operators';
import { hasValue } from 'src/app/shared/empty.util';
import { PostRequest } from './request.models';
import { AppState } from '../../app.reducer';
import { NoContent } from '../shared/NoContent.model';
import { FindListOptions } from './find-list-options.model';
import {
  DocumentTypeRegistryCancelDocumentTypeAction,
  DocumentTypeRegistryEditDocumentTypeAction
} from '../../admin/admin-registries/documenttype/documenttype-registry.actions';
import { DocumentTypeRegistryState }  from '../../admin/admin-registries/documenttype/documenttype-registry.reducers';
import { PaginatedList } from './paginated-list.model';
import { FollowLinkConfig } from 'src/app/shared/utils/follow-link-config.model';
import { IdentifiableDataService } from './base/identifiable-data.service';
import { CreateData, CreateDataImpl } from './base/create-data';
import { FindAllData, FindAllDataImpl } from './base/find-all-data';
import { SearchData, SearchDataImpl } from './base/search-data';
import { PatchData, PatchDataImpl } from './base/patch-data';
import { DeleteData, DeleteDataImpl } from './base/delete-data';
import { RequestParam } from '../cache/models/request-param.model';
import { PutData, PutDataImpl } from './base/put-data';
const documentTypeRegistryStateSelector = (state: AppState) => state.documentTypeRegistry;
const editDocumentTypeSelector = createSelector(documentTypeRegistryStateSelector, (documentTypeRegistryState: DocumentTypeRegistryState) => documentTypeRegistryState.editDocumentType);

@Injectable()
@dataService(DOCUMENTTYPE)
export class DocumenttypeService extends IdentifiableDataService<DocumentType> implements CreateData<DocumentType>, FindAllData<DocumentType>, SearchData<DocumentType>, PutData<DocumentType>, DeleteData<DocumentType>{
 // protected linkPath = 'documenttypes'
  protected topLinkPath = 'documenttype';

  private createData: CreateData<DocumentType>;
  private findAllData: FindAllData<DocumentType>;
  private searchData: SearchData<DocumentType>;
  private putData: PutData<DocumentType>;
  private deleteData: DeleteData<DocumentType>;

  constructor(protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<any>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DSOChangeAnalyzer<DocumentType>) {
    super("documenttypes", requestService, rdbService, objectCache, halService);

    this.createData = new CreateDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, notificationsService, this.responseMsToLive);
    this.findAllData = new FindAllDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
    this.searchData = new SearchDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
    this.putData = new PutDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
    this.deleteData = new DeleteDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, notificationsService, this.responseMsToLive, this.constructIdEndpoint);


  }
  /**
  * Retrieves the Registration endpoint
  */
  getDocumentTypeEndpoint(): Observable<string> {
    return this.halService.getEndpoint(this.linkPath);
  }
  /**
    * Save Documwnt Type
    */
  
  public create(object: DocumentType, ...params: RequestParam[]): Observable<RemoteData<DocumentType>> {
    return this.createData.create(object, ...params);
  }
  delete(objectId: string, copyVirtualMetadata?: string[]): Observable<RemoteData<NoContent>> {
    debugger;
    return this.deleteData.delete(objectId, copyVirtualMetadata);
  }
  public deleteByHref(href: string, copyVirtualMetadata?: string[]): Observable<RemoteData<NoContent>> {
    return this.deleteData.deleteByHref(href, copyVirtualMetadata);
  }
  public findAll(options?: FindListOptions, useCachedVersionIfAvailable?: boolean, reRequestOnStale?: boolean, ...linksToFollow: FollowLinkConfig<DocumentType>[]): Observable<RemoteData<PaginatedList<DocumentType>>> {
    return this.findAllData.findAll(options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }
  put(object: DocumentType): Observable<RemoteData<DocumentType>> {
    return this.putData.put(object);
  }
  public searchBy(searchMethod: string, options?: FindListOptions, useCachedVersionIfAvailable?: boolean, reRequestOnStale?: boolean, ...linksToFollow: FollowLinkConfig<DocumentType>[]): Observable<RemoteData<PaginatedList<DocumentType>>> {
    return this.searchData.searchBy(searchMethod, options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }
  
  saveDocType(documenttypename: string,): Observable<RemoteData<DocumentType>> {
    const requestId = this.requestService.generateRequestId();
    let documentType = new DocumentType();
    documentType.documenttypename = documenttypename;
    return this.create(documentType);
  }
  findAllDocumentType(options: FindListOptions = {}, ...linksToFollow: FollowLinkConfig<DocumentType>[]): Observable<RemoteData<PaginatedList<DocumentType>>> {
    return this.findAll();
  }
  public getActivedocumentType(): Observable<DocumentType> {
    return this.store.pipe(select(editDocumentTypeSelector));
  }

  private generateOperations(oldDocumentType: DocumentType, newDocumentType: DocumentType): Operation[] {
    let operations = this.comparator.diff(oldDocumentType, newDocumentType).filter((operation: Operation) => operation.op === 'replace');
    if (hasValue(oldDocumentType.documenttypename) && oldDocumentType.documenttypename !== newDocumentType.documenttypename) {
      operations = [...operations, {
        op: 'replace', path: '/documenttypename', value: newDocumentType.documenttypename
      }];
    }
    
    
    return operations;
  }
  public updateDocumentType(documentType: DocumentType): Observable<RemoteData<DocumentType>> {
    return this.put(documentType);
  }
  public clearDocumentTypeRequests(): void {
    this.getBrowseEndpoint().pipe(take(1)).subscribe((link: string) => {
      this.requestService.removeByHrefSubstring(link);
    });
  }

  /**
   * Method that clears a link's requests in cache
   */
  public clearLinkRequests(href: string): void {
    this.requestService.setStaleByHrefSubstring(href);
  }

  public cancelEditDocumentType() {
    this.store.dispatch(new DocumentTypeRegistryCancelDocumentTypeAction());
  }

  /**
   * Method to set the DocumentType being edited, dispatches an edit DocumentType action
   * @param documentType The DocumentType to edit
   */
  public editDocumentType(documentType: DocumentType) {
    this.store.dispatch(new DocumentTypeRegistryEditDocumentTypeAction(documentType));
  }

  /**
   * Method to delete an DocumentType
   * @param documentType The DocumentType to delete
   */
  // public deleteDocumentType(documentType: DocumentType): Observable<RemoteData<NoContent>> {
  //   return this.delete(documentType.id);
  // }

  public startEditingNewDocumentType(documentType: DocumentType): string {
    this.getActivedocumentType().pipe(take(1)).subscribe((activeDocumentType: DocumentType) => {
      if (documentType === activeDocumentType) {
        this.cancelEditDocumentType();
      } else {
        this.editDocumentType(documentType);
      }
    });
    return '/access-control/documenttype';
  }

  /**
   * Get DocumentType admin page
   * @param documentType New DocumentType to edit
   */
  public getDocumentTypePageRouterLink(): string {
    return '/access-control/documenttype';
  }

  /**
   * Create a new DocumentType using a token
   * @param eperson
   * @param token
   */
  public createDocumentTypeForToken(eperson: DocumentType, token: string): Observable<RemoteData<DocumentType>> {
    const requestId = this.requestService.generateRequestId();
    const hrefObs = this.getBrowseEndpoint().pipe(
      map((href: string) => `${href}?token=${token}`));
    hrefObs.pipe(
      find((href: string) => hasValue(href)),
    ).subscribe((href: string) => {
      const request = new PostRequest(requestId, href, eperson);
      this.requestService.send(request);
    });

    return this.rdbService.buildFromRequestUUID(requestId);

  }

}


