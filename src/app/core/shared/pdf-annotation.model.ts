import { inheritSerialization } from 'cerialize';
import { Item } from './item.model';
import { Observable } from 'rxjs';
import { RemoteData } from '../data/remote-data';
import { Collection } from './collection.model';
import { ITEM_TEMPLATE } from './template-item.resource-type';
import { link, typedObject } from '../cache/builders/build-decorators';
import { COLLECTION } from './collection.resource-type';
import { PDF_ANNOTATION } from './pdf-annotation.resource-type';

/**
 * Class representing a DSpace Template Item
 */
@typedObject
@inheritSerialization(Item)
export class PDFANNOTATION extends Item {
  static type = PDF_ANNOTATION;

  /**
   * The Collection that this item is a template for
   */
 

}
