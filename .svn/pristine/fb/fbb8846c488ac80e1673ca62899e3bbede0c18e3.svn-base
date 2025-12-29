import { DocumentTypeRegistryCancelDocumentTypeAction, DocumentTypeRegistryEditDocumentTypeAction } from './documenttype-registry.actions';
import { documentTypeRegistryReducer, DocumentTypeRegistryState } from './documenttype-registry.reducers';
import { DocumentTypeMock } from '../../../shared/testing/eperson.mock';

const initialState: DocumentTypeRegistryState = {
  editDocumentType: null,
};

const editState: DocumentTypeRegistryState = {
  editDocumentType: DocumentTypeMock,
};

class NullAction extends DocumentTypeRegistryEditDocumentTypeAction {
  type = null;

  constructor() {
    super(undefined);
  }
}

describe('epeopleRegistryReducer', () => {

  it('should return the current state when no valid actions have been made', () => {
    const state = initialState;
    const action = new NullAction();
    const newState = documentTypeRegistryReducer(state, action);

    expect(newState).toEqual(state);
  });

  it('should start with an initial state', () => {
    const state = initialState;
    const action = new NullAction();
    const initState = documentTypeRegistryReducer(undefined, action);

    expect(initState).toEqual(state);
  });

  it('should update the current state to change the editDocumentType to a new documentType when DocumentTypeRegistryEditDocumentTypeAction is dispatched', () => {
    const state = editState;
    const action = new DocumentTypeRegistryEditDocumentTypeAction(DocumentTypeMock);
    const newState = documentTypeRegistryReducer(state, action);

    expect(newState.editDocumentType).toEqual(DocumentTypeMock);
  });

  it('should update the current state to remove the editDocumentType from the state when DocumentTypeRegistryCancelDocumentTypeAction is dispatched', () => {
    const state = editState;
    const action = new DocumentTypeRegistryCancelDocumentTypeAction();
    const newState = documentTypeRegistryReducer(state, action);

    expect(newState.editDocumentType).toEqual(null);
  });
});
