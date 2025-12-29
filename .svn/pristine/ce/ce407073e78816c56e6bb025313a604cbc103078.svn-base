import { DocumentType } from './../shared/documenttype.model';
import { getFirstCompletedRemoteData, getFirstSucceededRemoteData, getRemoteDataPayload } from './../shared/operators';
import { DocumentTypeTree } from './../shared/documenttypetree.model';
import { sendRequest } from '../shared/request.operators';
import { Injectable } from '@angular/core';
import { dataService } from './base/data-service.decorator';

import { createSelector } from '@ngrx/store';
import { RequestService } from './request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { Store } from '@ngrx/store';
import { ObjectCacheService } from '../cache/object-cache.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { NotificationsService } from 'src/app/shared/notifications/notifications.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DSOChangeAnalyzer } from './dso-change-analyzer.service';
import { HttpOptions } from '../dspace-rest/dspace-rest.service';
import { Observable, throwError } from 'rxjs';
import { RemoteData } from './remote-data';
import { filter, map, take, find, catchError } from 'rxjs/operators';
import { PatchRequest, PostRequest, PutRequest, DeleteRequest } from './request.models';
import { AppState } from '../../app.reducer';
import { DocumentTypeRegistryState } from '../../admin/admin-registries/documenttype/documenttype-registry.reducers';
import { FindListOptions } from './find-list-options.model';
import { hasValue, isNotEmpty } from 'src/app/shared/empty.util';
import { DOCUMENTTYPETREE } from '../shared/documenttypeTree.resource-type';
import { NoContent } from '../shared/NoContent.model';
import { URLCombiner } from '../url-combiner/url-combiner';
import { FollowLinkConfig } from 'src/app/shared/utils/follow-link-config.model';
import { PaginatedList } from './paginated-list.model';
import { RequestParam } from '../cache/models/request-param.model';
import { Bitstream } from '../shared/bitstream.model';
import { IdentifiableDataServiceStub } from 'src/app/shared/testing/identifiable-data-service.stub';
import { CreateData, CreateDataImpl } from './base/create-data';
import { SearchData, SearchDataImpl } from './base/search-data';
import { FindAllData, FindAllDataImpl } from './base/find-all-data';
import { PutData, PutDataImpl } from './base/put-data';
import { DeleteData, DeleteDataImpl } from './base/delete-data';
import { IdentifiableDataService } from './base/identifiable-data.service';
// const documentTypeRegistryStateSelector = (state: AppState) => state.documentTypeRegistry;
// const editDocumentTypeSelector = createSelector(documentTypeRegistryStateSelector, (documentTypeRegistryState: DocumentTypeRegistryState) => documentTypeRegistryState.editDocumentType);
const documentTypeRegistryStateSelector = (state: AppState) => state.documentTypeRegistry;
const editDocumentTypeSelector = createSelector(documentTypeRegistryStateSelector, (documentTypeRegistryState: DocumentTypeRegistryState) => documentTypeRegistryState.editDocumentType);

@Injectable()
@dataService(DOCUMENTTYPETREE)
export class DocumenttypeTreeService extends IdentifiableDataService<DocumentTypeTree> implements CreateData<DocumentTypeTree>, FindAllData<DocumentTypeTree>, SearchData<DocumentTypeTree>, PutData<DocumentTypeTree>, DeleteData<DocumentTypeTree> {
  protected linkPath = 'documenttypetrees';
  protected getAllRootTree = 'getAllRootTree';
  protected getTreeByItem = 'getAllDocumentTypeandChildByItemID';
  protected genrateSmartDocumentView = 'mergeBookMark';
  protected getChildByNodeID = 'getChildByNodeIDForTempletForSubmiter';
  protected getChildByNodeIDAdmin = 'getChildByNodeIDForTempletForAdmin';
  protected searchDocumentTreeByDocumentTypeName = 'searchDocumentTreeByDocumentTypeName';
  protected topLinkPath = 'documenttype';
  protected getDocTypeByBitstreamID = "getDocTypeByBitstreamID";

  protected getIssubchildNodeByparentID = 'getIssubchildNodeByparentIDandItemID';
  protected getChildNodeByparentID = 'getChildNodeByparentID';
  private createData: CreateData<DocumentTypeTree>;
  private findAllData: FindAllData<DocumentTypeTree>;
  private searchData: SearchData<DocumentTypeTree>;
  private putData: PutData<DocumentTypeTree>;
  private deleteData: DeleteData<DocumentTypeTree>;
  protected genratePagenoDocumentView = 'meargepagecount';
  protected findbistreambypageno = 'searchpdfbypagenumber';
  constructor(protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<any>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DSOChangeAnalyzer<DocumentType>,
  ) {
    super("documenttypetrees", requestService, rdbService, objectCache, halService);

    this.createData = new CreateDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, notificationsService, this.responseMsToLive);
    this.findAllData = new FindAllDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
    this.searchData = new SearchDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
    this.putData = new PutDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
    this.deleteData = new DeleteDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, notificationsService, this.responseMsToLive, this.constructIdEndpoint);


  }
  public getCreateEndpoint(): Observable<string> {
    return this.getBrowseEndpoint();
  }


  public create(object: DocumentTypeTree, ...params: RequestParam[]): Observable<RemoteData<DocumentTypeTree>> {
    return this.createData.create(object, ...params);
  }
  delete(objectId: string, copyVirtualMetadata?: string[]): Observable<RemoteData<NoContent>> {
    return this.deleteData.delete(objectId, copyVirtualMetadata);
  }
  public deleteByHref(href: string, copyVirtualMetadata?: string[]): Observable<RemoteData<NoContent>> {
    return this.deleteData.deleteByHref(href, copyVirtualMetadata);
  }
  public findAll(options?: FindListOptions, useCachedVersionIfAvailable?: boolean, reRequestOnStale?: boolean, ...linksToFollow: FollowLinkConfig<DocumentTypeTree>[]): Observable<RemoteData<PaginatedList<DocumentTypeTree>>> {
    return this.findAllData.findAll(options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }
  put(object: DocumentTypeTree): Observable<RemoteData<DocumentTypeTree>> {
    return this.putData.put(object);
  }
  public searchBy(searchMethod: string, options?: FindListOptions, useCachedVersionIfAvailable?: boolean, reRequestOnStale?: boolean, ...linksToFollow: FollowLinkConfig<DocumentTypeTree>[]): Observable<RemoteData<PaginatedList<DocumentTypeTree>>> {
    return this.searchData.searchBy(searchMethod, options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }



  public getRootWndPoint(query: string, options: FindListOptions = {}, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<DocumentTypeTree>[]): Observable<RemoteData<PaginatedList<DocumentTypeTree>>> {
    options = Object.assign({}, options, {
      searchParams: [new RequestParam('query', query)]
    });
    return this.searchBy(this.getAllRootTree, options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow).pipe(
      filter((collections: RemoteData<PaginatedList<DocumentTypeTree>>) => !collections.isResponsePending));
  }
  public _getdocumentTreeByItem(query: string, options: FindListOptions = {}, useCachedVersionIfAvailable = false, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<DocumentTypeTree>[]): Observable<RemoteData<PaginatedList<DocumentTypeTree>>> {
    options = Object.assign({}, options, {
      searchParams: [new RequestParam('itemID', query)]
    });
    return this.searchBy(this.getTreeByItem, options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow).pipe(
      filter((collections: RemoteData<PaginatedList<DocumentTypeTree>>) => !collections.isResponsePending));
  }

  public _genrateSmartDocumentView(query: string, options: FindListOptions = {}, useCachedVersionIfAvailable = false, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<DocumentTypeTree>[]): Observable<RemoteData<DocumentTypeTree>> {
    options = Object.assign({}, options, {
      searchParams: [new RequestParam('itemID', query)]
    });
    const hrefObs = this.getSearchByHref(this.genrateSmartDocumentView, options, ...linksToFollow);
    return this.findByHref(hrefObs, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }

  public _genrateSmartPageNo(query: string, options: FindListOptions = {}, useCachedVersionIfAvailable = false, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<DocumentTypeTree>[]): Observable<RemoteData<DocumentTypeTree>> {
    options = Object.assign({}, options, {
      searchParams: [new RequestParam('itemID', query)]
    });
    const hrefObs = this.getSearchByHref(this.genratePagenoDocumentView, options, ...linksToFollow);
    return this.findByHref(hrefObs, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }
  public getSearchEndpoint(searchMethod: string): Observable<string> {
    return this.halService.getEndpoint(this.linkPath).pipe(
      filter((href: string) => isNotEmpty(href)),
      map(href => `${href}/search/${searchMethod}`),
    );
  }

  public searchpdfbypagenumber(pageno: number, query: string, options: FindListOptions = {}, useCachedVersionIfAvailable = false, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<DocumentTypeTree>[]): Observable<RemoteData<DocumentTypeTree>> {
    options = Object.assign({}, options, {
      searchParams: [new RequestParam('itemID', query), new RequestParam('pagenumber', pageno)]
    });
    const hrefObs = this.getSearchByHref(this.findbistreambypageno, options, ...linksToFollow);
    return this.findByHref(hrefObs, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }


  getSearchByHref(searchMethod: string, options: FindListOptions = {}, ...linksToFollow: FollowLinkConfig<DocumentTypeTree>[]): Observable<string> {
    let result$: Observable<string>;
    const args = [];

    result$ = this.getSearchEndpoint(searchMethod);

    return result$.pipe(map((result: string) => this.buildHrefFromFindOptions(result, options, args, ...linksToFollow)));
  }

  public _getChildByNodeID(rootid: string, istemplet: Boolean, itemid: string, options: FindListOptions = {}, useCachedVersionIfAvailable = false, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<DocumentTypeTree>[]): Observable<RemoteData<PaginatedList<DocumentTypeTree>>> {
    options = Object.assign({}, options, {
      searchParams: [new RequestParam('rootid', rootid), new RequestParam('istemplet', istemplet), new RequestParam('itemid', itemid)]
    });
    return this.searchBy(this.getChildByNodeID, options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow).pipe(
      filter((collections: RemoteData<PaginatedList<DocumentTypeTree>>) => !collections.isResponsePending));
  }

  public _getChildNodeByparentID(rootid: string, istemplet: boolean, options: FindListOptions = {}, useCachedVersionIfAvailable = false, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<DocumentTypeTree>[]): Observable<RemoteData<PaginatedList<DocumentTypeTree>>> {
    options = Object.assign({}, options, {
      searchParams: [new RequestParam('parentID', rootid), new RequestParam('isTemplet', istemplet)]
    });
    return this.searchBy(this.getChildNodeByparentID, options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow).pipe(
      filter((collections: RemoteData<PaginatedList<DocumentTypeTree>>) => !collections.isResponsePending));
  }

  public _getIssubchildNodeByparentID(rootid: string, itemid: string, options: FindListOptions = {}, useCachedVersionIfAvailable = false, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<DocumentTypeTree>[]): Observable<RemoteData<PaginatedList<DocumentTypeTree>>> {
    options = Object.assign({}, options, {
      searchParams: [new RequestParam('parentID', rootid), new RequestParam('itemUUID', itemid)]
    });
    return this.searchBy(this.getIssubchildNodeByparentID, options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow).pipe(
      filter((collections: RemoteData<PaginatedList<DocumentTypeTree>>) => !collections.isResponsePending));
  }

  public _getChildByNodeIDByadmin(rootid: string, istemplet: Boolean, options: FindListOptions = {}, useCachedVersionIfAvailable = false, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<DocumentTypeTree>[]): Observable<RemoteData<PaginatedList<DocumentTypeTree>>> {
    options = Object.assign({}, options, {
      searchParams: [new RequestParam('rootid', rootid), new RequestParam('istemplet', istemplet)]
    });
    return this.searchBy(this.getChildByNodeIDAdmin, options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow).pipe(
      filter((collections: RemoteData<PaginatedList<DocumentTypeTree>>) => !collections.isResponsePending));
  }

  public _searchDocumentTreeByDocumentTypeName(rootid: string, options: FindListOptions = {}, useCachedVersionIfAvailable = false, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<DocumentTypeTree>[]): Observable<RemoteData<PaginatedList<DocumentTypeTree>>> {
    options = Object.assign({}, options, {
      searchParams: [new RequestParam('query', rootid)]
    });
    return this.searchBy(this.searchDocumentTreeByDocumentTypeName, options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow).pipe(
      filter((collections: RemoteData<PaginatedList<DocumentTypeTree>>) => !collections.isResponsePending));
  }
  public _getDocTypeByBitstreamID(rootid: string, options: FindListOptions = {}, useCachedVersionIfAvailable = false, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<DocumentTypeTree>[]): Observable<RemoteData<DocumentTypeTree>> {
    options = Object.assign({}, options, {
      searchParams: [new RequestParam('bitstreamId', rootid)]
    });

    const hrefObs = this.getSearchByHref(this.getDocTypeByBitstreamID, options, ...linksToFollow);
    return this.findByHref(hrefObs, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
    // return this.searchBySingle(this.getDocTypeByBitstreamID, options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);

  }

  /**
  * Retrieves the Registration endpoint
  */
  getDocumentTypeEndpoint(): Observable<string> {
    return this.halService.getEndpoint(this.linkPath);
  }
  /**
   * Create a new BitstreamFormat
   * @param {BitstreamFormat} bitstreamFormat
   */
  public createDocumentypeTemplet(documentTypeTree: DocumentTypeTree): Observable<RemoteData<DocumentTypeTree>> {
    return this.create(documentTypeTree);
  }
  public deleteDocumentType(documentTypeTree: DocumentTypeTree): Observable<RemoteData<NoContent>> {
    return this.delete(documentTypeTree.id);
  }
  public updateDocumentTypeTree(documentTypeTree: DocumentTypeTree): Observable<RemoteData<DocumentTypeTree>> {
    return this.put(documentTypeTree);
  }

  public deleteDocumentTypeTreeWithBistrem(uuid: string): Observable<RemoteData<DocumentTypeTree>> {
    const requestId = this.requestService.generateRequestId();
    const href$ = this.getEndpoint();
    const options: HttpOptions = Object.create({});
    href$.pipe(
      find((href: string) => hasValue(href)),
      map((href: string) => {
        href = href + "/" + uuid + "/delete";
        console.log("hrefhrefhrefhref.....", href)
        const request = new DeleteRequest(requestId, href, {}, options);
        this.requestService.send(request);
      })
    ).subscribe();


    return this.rdbService.buildFromRequestUUID(requestId);
  }

  public UpdateDocumentTypeTreeWithBistrem(documentTypeTree: DocumentTypeTree): Observable<RemoteData<DocumentTypeTree>> {
    const requestId = this.requestService.generateRequestId();
    const href$ = this.getEndpoint();
    const options: HttpOptions = Object.create({});
    href$.pipe(
      find((href: string) => hasValue(href)),
      map((href: string) => {
        href = href + "/" + documentTypeTree.id + "/update";
        console.log("hrefhrefhrefhref.....", href)
        const request = new PostRequest(requestId, href, documentTypeTree, options);
        this.requestService.send(request);
      })
    ).subscribe();


    return this.rdbService.buildFromRequestUUID(requestId);
  }
  public saveAnnotation(anotData: any): any {
    const requestId = this.requestService.generateRequestId();
    const href$ = this.getEndpoint1('pdfnnnotations');
    const options: HttpOptions = Object.create({});
    href$.pipe(
      find((href: string) => hasValue(href)),
      map((href: string) => {
        const request = new PostRequest(requestId, href, anotData, options);
        this.requestService.send(request);
      })
    ).subscribe();
    return this.rdbService.buildFromRequestUUID<any>(requestId).pipe(
      getFirstCompletedRemoteData()
    );
  }
  protected getEndpoint1(path: string): Observable<string> {
    return this.halService.getEndpoint(path);
  }

  public getAnnotationData(id: string): Observable<RemoteData<DocumentTypeTree>> {
    var url: string;
    const href$ = this.getEndpoint1('pdfnnnotations').pipe(
      find((href: string) => hasValue(href)),
    );
    href$.subscribe((data) => {
      url = data + '/search/getAnnotationByBitstreamID?bitstreamID=' + id;
    });
    return this.getData(url);
  }

  public getGeneralNoteData(id: string): Observable<RemoteData<DocumentTypeTree>> {
    var url: string;
    const href$ = this.getEndpoint1('pdfnnnotations').pipe(
      find((href: string) => hasValue(href)),
    );
    href$.subscribe((data) => {
      url = data + '/search/getNoteByItemID?itemID=' + id;
    });
    return this.getData(url);
  }

  private getData(url: string): Observable<RemoteData<DocumentTypeTree>> {
    return this.http.get<RemoteData<DocumentTypeTree>>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
      // Handle Unauthorized error (401) here
      console.error('Unauthorized:', error);
      // You can perform specific actions for unauthorized errors here
      // For example, you can redirect the user to a login page
    } else {
      // Handle other errors
      console.error('An error occurred:', error);
      // You can perform additional error handling for other types of errors here
    }
    return throwError(error);
  }

}


