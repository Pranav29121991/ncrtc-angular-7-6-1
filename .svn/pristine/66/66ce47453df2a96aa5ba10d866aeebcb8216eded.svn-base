import { DocumentType } from '../../../core/shared/documenttype.model';
import {
    DocumentTypeRegistryAction,
    DocumentTypeRegistryActionTypes,
    DocumentTypeRegistryEditDocumentTypeAction
} from './documenttype-registry.actions';

/**
 * The DocumentType registry state.
 * @interface DocumentTypeRegistryState
 */
export interface DocumentTypeRegistryState {
  editDocumentType: DocumentType;
}

/**
 * The initial state.
 */
const initialState: DocumentTypeRegistryState = {
    editDocumentType: null,
};

/**
 * Reducer that handles DocumentTypeRegistryActions to modify DocumentType
 * @param state   The current DocumentTypeRegistryState
 * @param action  The DocumentTypeRegistryAction to perform on the state
 */
export function documentTypeRegistryReducer(state = initialState, action: DocumentTypeRegistryAction): DocumentTypeRegistryState {
  switch (action.type) {

    case DocumentTypeRegistryActionTypes.EDIT_DCOUMENTTYPE: {
      return Object.assign({}, state, {
        editDocumentType: (action as DocumentTypeRegistryEditDocumentTypeAction).documentType
      });
    }

    case DocumentTypeRegistryActionTypes.CANCEL_EDIT_DCOUMENTTYPE: {
      return Object.assign({}, state, {
        editDocumentType: null
      });
    }

    default:
      return state;
  }
}
