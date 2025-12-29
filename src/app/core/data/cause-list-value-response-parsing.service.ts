import { Injectable } from '@angular/core';
import { FacetValue } from '../../shared/search/models/facet-value.model';
import { ParsedResponse } from '../cache/response.models';
import { RawRestResponse } from '../dspace-rest/raw-rest-response.model';
import { DSpaceSerializer } from '../dspace-rest/dspace.serializer';

import { CauseListValues } from '../../shared/search/models/causelist-values.model';
import { DspaceRestResponseParsingService } from './dspace-rest-response-parsing.service';
import { RestResponse, DSOSuccessResponse } from '../cache/response.models';
import { RestRequest } from './rest-request.model';
@Injectable()
export class CauseListValueResponseParsingService extends DspaceRestResponseParsingService {
    parse(request: RestRequest, data: RawRestResponse): ParsedResponse {
        const payload = data.payload;
        const facetValues = new DSpaceSerializer(CauseListValues).deserialize(payload);
        console.log(facetValues)
        
        this.addToObjectCache(facetValues, request,data);
         return new ParsedResponse(data.statusCode, facetValues._links.self);
    }
}
