import { Bitstream } from './bitstream.model';
import { Item } from './item.model';
import { DocumentType } from './documenttype.model';
import { autoserialize, deserialize, inheritSerialization,deserializeAs } from 'cerialize';
import { Observable } from 'rxjs';
import { link, typedObject } from '../cache/builders/build-decorators';

import { DOCUMENTTYPETREE } from './documenttypeTree.resource-type';
import { DSpaceObject } from './dspace-object.model';
import { HALLink } from './hal-link.model';
import { HALResource } from './hal-resource.model';


@typedObject
@inheritSerialization(DSpaceObject)
export class DocumentTypeTree extends DSpaceObject implements HALResource {
  static type = DOCUMENTTYPETREE;

  /**
   * The size of this bitstream in bytes
   */
  @autoserialize
  desc: string;
  @autoserialize
  templetName: string;
  @autoserialize
  isTemplet: Boolean=true;
  @autoserialize
  isDate: Boolean=false;
  @autoserialize
  isRemark: Boolean=false;
  @autoserialize
  isDescription: Boolean = false;
  @autoserialize
  indexUpdateAction: number;
  @autoserialize
  isSubchild: Boolean = false;
  @autoserialize
  nonrepetitive: Boolean = false;
  @autoserialize
  hasSubChild: Boolean = false;
  @autoserialize
  rootOfmaster: Boolean=false;
  @autoserialize
  parent: DocumentTypeTree; 
  @autoserialize
  children:Array<DocumentTypeTree>;
  @autoserialize
  documentType:DocumentType;
  @autoserialize
  hasChildren:Boolean=false;
  @autoserialize
  item:Item;
  @autoserialize
  bitstream:Bitstream ;
  @autoserialize
  templetTree:DocumentTypeTree;
  @autoserialize
  remarkdesc:string  
  @autoserialize
  doc_date:Date;
  @autoserialize
  index:number;
  @autoserialize
  display:Boolean=false;
  /**
   * The name of the Bundle this Bitstream is part of
   */
 

  /**
   * The {@link HALLink}s for this Bitstream
   */
  @deserialize
  _links: {
    self: HALLink;
    bundle: HALLink;
    format: HALLink;
    content: HALLink;
    thumbnail: HALLink;
  };

  
}
