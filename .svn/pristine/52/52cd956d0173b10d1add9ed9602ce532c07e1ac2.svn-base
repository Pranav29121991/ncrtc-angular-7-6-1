import { typedObject } from '../../../core/cache/builders/build-decorators';
import { excludeFromEquals } from '../../../core/utilities/equals.decorators';
import { CAUSELIST_VALUES } from './types/causelist-values.resource-type';
import { CauseList } from './causeValue.model';
import { SearchQueryResponse } from './search-query-response.model';
import { autoserialize, deserialize, inheritSerialization, autoserializeAs } from 'cerialize';
import { FilterType } from './filter-type.model';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { HALResource } from '../../../core/shared/hal-resource.model';
import { HALLink } from '../../../core/shared/hal-link.model';
@typedObject
@inheritSerialization(PaginatedList)
@inheritSerialization(SearchQueryResponse)
export class CauseListValues extends SearchQueryResponse<CauseList> {
    static type = CAUSELIST_VALUES;

    /**
     * The sort parameters used in the search request
     * Hardcoded because rest doesn't provide a unique type
     */
    @excludeFromEquals
    public type = CAUSELIST_VALUES;

    /**
     * The name of the facet the values are for
     */
   
    @autoserialize
    jsonStr: string;

    

    /**
     * The max number of returned facetValues
     */
    @autoserialize
    facetLimit: number;
    
    @autoserializeAs(CauseList, 'objects')
    page: CauseList[];
    
}
