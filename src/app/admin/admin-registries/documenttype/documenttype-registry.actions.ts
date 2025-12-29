import { Action } from '@ngrx/store';
import { DocumentType } from '../../../core/shared/documenttype.model';
import { type } from  '../../../shared/ngrx/type';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 *
 * The 'type' utility function coerces strings into string
 * literal types and runs a simple check to guarantee all
 * action types in the application are unique.
 */
export const DocumentTypeRegistryActionTypes = {

  EDIT_DCOUMENTTYPE: type('dspace/documenttype/EDIT_DCOUMENTTYPE'),
  CANCEL_EDIT_DCOUMENTTYPE: type('dspace/documenttype/CANCEL_EDIT_DCOUMENTTYPE'),
};

/* tslint:disable:max-classes-per-file */
/**
 * Used to edit an DocumentType in the DocumentType registry
 */
export class DocumentTypeRegistryEditDocumentTypeAction implements Action {
  type = DocumentTypeRegistryActionTypes.EDIT_DCOUMENTTYPE;

  documentType: DocumentType;

  constructor(documentType: DocumentType) {
    this.documentType = documentType;
  }
}

/**
 * Used to cancel the editing of an DocumentType in the DocumentType registry
 */
export class DocumentTypeRegistryCancelDocumentTypeAction implements Action {
  type = DocumentTypeRegistryActionTypes.CANCEL_EDIT_DCOUMENTTYPE;
}

/* tslint:enable:max-classes-per-file */

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 * These are all the actions to perform on the DocumentType registry state
 */
export type DocumentTypeRegistryAction
  = DocumentTypeRegistryEditDocumentTypeAction
  | DocumentTypeRegistryCancelDocumentTypeAction;
