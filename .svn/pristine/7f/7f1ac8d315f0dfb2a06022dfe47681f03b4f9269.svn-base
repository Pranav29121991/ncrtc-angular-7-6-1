import { Injectable } from '@angular/core';
import { dataService } from './base/data-service.decorator';
import { WORKFLOWPROCESSE_FORMAT } from '../shared/workflowprocessdraftdetail.resource-type';
import { Workflowprocesse } from '../shared/workflowprocesse-format.model';
import { IdentifiableDataService } from './base/identifiable-data.service';
import { SearchData, SearchDataImpl } from './base/search-data';
import { filter, Observable } from 'rxjs';
import { FollowLinkConfig } from 'src/app/shared/utils/follow-link-config.model';
import { FindListOptions } from './find-list-options.model';
import { PaginatedList } from './paginated-list.model';
import { RemoteData } from './remote-data';
import { RequestService } from './request.service';
import { HttpClient } from '@angular/common/http';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { RequestParam } from '../cache/models/request-param.model';
import { Item } from '../shared/item.model';
import { Bitstream } from '../shared/bitstream.model';

@Injectable()
@dataService(WORKFLOWPROCESSE_FORMAT)
export class ReportService extends IdentifiableDataService<Bitstream> implements SearchData<Bitstream> {

  private searchData: SearchDataImpl<Bitstream>;
  protected path1 = 'bitstreams';
  protected searchByMetadataPath = '/searchPageCount'
  constructor(protected requestService: RequestService,
    private httpClient: HttpClient,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService) {
    super('searchPageCount', requestService, rdbService, objectCache, halService);
    this.searchData = new SearchDataImpl(this.path1, requestService, rdbService, objectCache, halService, this.responseMsToLive);
    //console.log(this.searchData);
   }
   
   public _getprogressReportByDate(fromdate: string, todate: string, options: FindListOptions = {}, useCachedVersionIfAvailable = false, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<Bitstream>[]): Observable<RemoteData<PaginatedList<Bitstream>>> {
    options = Object.assign({}, options, {
      searchParams: [new RequestParam('startDate', fromdate), new RequestParam('endDate', todate)]
    });
    return this.searchBy(this.searchByMetadataPath, options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow).pipe(
      filter((collections: RemoteData<PaginatedList<Bitstream>>) => !collections.isResponsePending));
  }
  
  searchBy(searchMethod: string, options?: FindListOptions, useCachedVersionIfAvailable?: boolean, reRequestOnStale?: boolean, ...linksToFollow: FollowLinkConfig<Bitstream>[]): Observable<RemoteData<PaginatedList<Bitstream>>> {
    return this.searchData.searchBy(searchMethod, options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }
}
