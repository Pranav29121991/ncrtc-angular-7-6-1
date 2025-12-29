import { Component, Input } from '@angular/core';
import { DSpaceObject } from '../../../../../core/shared/dspace-object.model';
import { hasValue, isEmpty } from '../../../../empty.util';
import { getResourceTypeValueFor } from '../../../../../core/cache/object-cache.reducer';


@Component({
  selector: 'ds-type-badge',
  templateUrl: './type-badge.component.html'
})
/**
 * Component rendering the type of an item as a badge
 */
export class TypeBadgeComponent {

  private _object: DSpaceObject;
  private _typeMessage: string;
  private _caseStatus: string;
  private _dispodate: string;

  /**
   * The component used to retrieve the type from
   */
  @Input() set object(object: DSpaceObject) {
    this._object = object;

    const renderTypes = this._object.getRenderTypes();
    // console.log(this._object.allMetadataValues('casefile.case.status').toString())
    if (!isEmpty(this._object.allMetadataValues('casefile.case.status').toString())) {
      this._caseStatus = this._object.allMetadataValues('casefile.case.status').toString();
    } else if (!isEmpty(this._object.allMetadataValues('causelist.type').toString())) {
      this._caseStatus = this._object.allMetadataValues('causelist.type').toString();
    } else {
      this._caseStatus = null;
    }
    if (!isEmpty(this._object.firstMetadata('casefile.status.dateofdisposal'))) {
      this._dispodate = this._object.firstMetadataValue('casefile.status.dateofdisposal').toString();
    } else {
      this._dispodate = "";
    }
    if (!isEmpty(renderTypes.length)) {
      const renderType = renderTypes[0];
      if (renderType instanceof Function) {
        const resourceTypeValue = getResourceTypeValueFor(object.type);

        if (hasValue(resourceTypeValue)) {
          this._typeMessage = `${resourceTypeValue.toLowerCase()}.listelement.badge`;
        } else {
          this._typeMessage = `${renderType.name.toLowerCase()}.listelement.badge`;
        }
      } else {
        this._typeMessage = `${renderType.toLowerCase()}.listelement.badge`;
      }

    }
  }

  get object(): DSpaceObject {
    return this._object;
  }
  get dispodate(): string {
    return this._dispodate;
  }
  get typeMessage(): string {
    return this._typeMessage;
  }
  get caseStatus(): string {

    return this._caseStatus;
  }

  classbager(name: string): string {
    if (name == "Disposed") {
      return "badge-danger";
    } else if (name == "Pending") {
      return "badge-success";
    } else {
      return "badge-info";
    }

  }
}
