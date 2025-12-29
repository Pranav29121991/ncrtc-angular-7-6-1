import { autoserialize, deserialize, deserializeAs,inheritSerialization } from 'cerialize';
import { typedObject } from '../cache/builders/build-decorators';
import { IDToUUIDSerializer } from '../cache/id-to-uuid-serializer';
import { excludeFromEquals } from '../utilities/equals.decorators';
import { BitstreamFormatSupportLevel } from './bitstream-format-support-level';
import { HALLink } from './hal-link.model';
import { ResourceType } from './resource-type';
import { CacheableObject } from '../cache/cacheable-object.model';
import { DSpaceObject } from './dspace-object.model';
import { HALResource } from './hal-resource.model';
import { WORKFLOWPROCESSE_FORMAT } from './workflowprocessdraftdetail.resource-type';

/**
 * Model class for a WORKFLOWPROCESSE Format
 */
@typedObject
@inheritSerialization(DSpaceObject)
export class Workflowprocesse extends DSpaceObject {
  static type = WORKFLOWPROCESSE_FORMAT;

  @autoserialize
  id: string;
  @autoserialize
  uuid: string;
  @autoserialize
  index: number;
  @autoserialize
  handle :any;
  @autoserialize
  metadata: any;
  @autoserialize
  owner: any;  
  @autoserialize
  content:any;
  @autoserialize
  workflowprocesseperson:any;
  @autoserialize
  workFlowProcessOutwardDetailsRest:any;
  @autoserialize
  workflowProcessNoteRest:any;
  @autoserialize
  workFlowProcessDraftDetailsRest:any;
  @autoserialize
  itemRest:any;
  @autoserialize
  priorityRest:any;
  @autoserialize
  dispatchModeRest:any;
  @autoserialize
  eligibleForFilingRest:any;
  @autoserialize
  workFlowProcessInwardDetailsRest:any;
  @autoserialize
  sender:any;
  @autoserialize
  workflowType:any;
  @autoserialize
  workflowProcessSenderDiaryRest:any;
  @autoserialize
  Subject:any;
  @autoserialize
  workflowStatus:any;
  @autoserialize
  mode:any;
  @autoserialize
  ismode:any;
  @autoserialize
  dateRecived:string;
  @autoserialize
  ePersonRest:any;
  @autoserialize
  currentrecipient:string;
  @autoserialize
  dueDate:string;
  @autoserialize
  isread:boolean;
  @autoserialize
  remark:string;
  
  

 
  /**
   * The {@link HALLink}s for this WorkFlowProcess
   */
  @deserialize
  _links: {
    self: HALLink;
  };
}
