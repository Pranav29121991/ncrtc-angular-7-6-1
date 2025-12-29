import { autoserialize, deserialize, inheritSerialization,deserializeAs } from 'cerialize';
import { Observable } from 'rxjs';
import { link, typedObject } from '../cache/builders/build-decorators';

import { DOCUMENTTYPE } from './documenttype.resource-type';
import { DSpaceObject } from './dspace-object.model';
import { HALLink } from './hal-link.model';
import { HALResource } from './hal-resource.model';


@typedObject
@inheritSerialization(DSpaceObject)
export class DocumentType extends DSpaceObject implements HALResource {
  static type = DOCUMENTTYPE;

  /**
   * The size of this bitstream in bytes
   */
  @autoserialize
  documenttypename: string;

  /**
   * The name of the Bundle this Bitstream is part of
   */
   @deserializeAs(Date)
  doc_date: Date;

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

  get name(): string {
    return this.documenttypename;
  }
  
}
