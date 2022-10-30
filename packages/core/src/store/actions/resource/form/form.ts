import { fetchFormPack, fetchShareFormPack, fetchTemplateFormPack } from '../../../../modules/database/form_api';
import { AxiosResponse } from 'axios';
import { ConfigConstant, StatusCode } from 'config';
import { Dispatch } from 'redux';
import { batchActions } from 'redux-batched-actions';
import { getFormLoading } from 'store/selector';
import { receiveDataPack } from 'store/actions/resource/datasheet';
import * as actions from '../../../action_constants';
import { deleteNode } from '../../catalog_tree';
import { Api } from 'api';
import { DEFAULT_READ_ONLY_PERMISSION } from 'store/constants';
import { IFieldPermissionMap, IFormProps, IFormSnapshot, ISourceDatasheetInfo, INodeMeta, IReduxState, ICollaborator } from 'store/interface';

export const DEFAULT_FORM_PROPS = {
  title: '',
  coverVisible: true,
  logoVisible: true,
  brandVisible: true,
  fullScreen: false,
};

export function fetchForm(formId: string, successFn?: (props?: any) => void) {
  return (dispatch: any, getState: () => IReduxState) => {
    const state = getState();
    const { shareId, templateId } = state.pageParams;
    const formLoading = getFormLoading(state, formId);

    if (formLoading) {
      return;
    }

    let requestMethod = fetchFormPack;
    if (shareId) {
      requestMethod = () => fetchShareFormPack(shareId, formId);
    }
    if (templateId) {
      requestMethod = () => fetchTemplateFormPack(templateId, formId);
    }
    dispatch(requestFormPack(formId));
    return requestMethod(formId).then(response => {
      return Promise.resolve({ formId, response, dispatch, shareId });
    }).catch(e => {
      if (state.catalogTree.treeNodesMap[formId]) {
        dispatch(deleteNode({ nodeId: formId, parentId: state.catalogTree.treeNodesMap[formId].parentId }));
      }
      dispatch(formErrorCode(formId, StatusCode.COMMON_ERR));
      throw e;
    }).then((res: any) => {
      successFn?.();
      fetchDataSuccess(res);
    });
  };
}

function fetchDataSuccess(
  { formId, response, dispatch, shareId }: { formId: string, response: AxiosResponse, dispatch: Dispatch, shareId: string },
) {
  const body = response.data;
  const data = body.data;
  if (body.success && data) {
    const actions = receiveFormData(data);
    if (Array.isArray(actions)) {
      dispatch(batchActions(actions));
    } else {
      dispatch(actions);
    }
  }
  if (!body.success) {
    dispatch(formErrorCode(formId, body.code));
  }
}

export interface IResetFormAction {
  type: string;
  formId: string;
}

export function receiveFormData(
  { form, snapshot, sourceInfo, fieldPermissionMap }:
    { form: INodeMeta, sourceInfo: ISourceDatasheetInfo, snapshot: IFormSnapshot, fieldPermissionMap: IFieldPermissionMap },
): any {
  const formId = form.id;
  const { meta, formProps } = snapshot;
  const currentView = meta.views.filter(view => {
    return view.id === sourceInfo.viewId;
  });
  if (!currentView.length) {
    return formErrorCode(formId, StatusCode.FORM_FOREIGN_DATASHEET_NOT_EXIST);
  }
  const formState = {
    ...form,
    snapshot: {
      formProps: {
        ...DEFAULT_FORM_PROPS,
        ...formProps,
      },
    },
    sourceInfo,
    fieldPermissionMap,
  };

  return [
    {
      type: actions.SET_FORM_DATA,
      formId,
      payload: formState,
    },
    receiveDataPack({
      snapshot: { meta, recordMap: {}, datasheetId: sourceInfo.datasheetId },
      datasheet: {
        id: sourceInfo.datasheetId,
        revision: sourceInfo.datasheetRevision,
        permissions: DEFAULT_READ_ONLY_PERMISSION
      } as INodeMeta
    }, true)
  ];
}

export const setFormConnected = (formId: string) => {
  return {
    type: actions.FORM_CONNECTED,
    formId,
  };
};

export const formErrorCode = (formId: string, code: number | null) => {
  return {
    type: actions.FORM_ERROR_CODE,
    formId,
    payload: code,
  };
};

export function requestFormPack(formId: string) {
  return {
    type: actions.SET_FORM_LOADING,
    formId,
    payload: true,
  };
}

export const updateFormProps = (formId: string, formProps: IFormProps) => {
  return {
    type: actions.FORM_PROP_UPDATE,
    formId,
    payload: formProps,
  };
};

export const updateForm = (
  formId: string,
  form: Partial<INodeMeta>,
) => {
  return {
    type: actions.UPDATE_FORM,
    formId,
    payload: form,
  };
};

export async function fetchForeignFormList(
  dstId: string,
  viewId: string,
) {
  try {
    const res = await Api.getRelateNodeByDstId(dstId, viewId, ConfigConstant.NodeType.FORM);
    return res.data.data;
  } catch (e) {
    throw new Error(e);
  }
}
export const deactivateFormCollaborator = (payload: { socketId: string }, resourceId: string) => {
  return {
    type: actions.FORM_DEACTIVATE_COLLABORATOR,
    formId: resourceId,
    payload,
  };
};

export const activeFormCollaborator = (payload: ICollaborator, resourceId: string) => {
  return {
    type: actions.FORM_ACTIVE_COLLABORATOR,
    formId: resourceId,
    payload,
  };
};

export const resetForm = (
  formId: string,
) => {
  return {
    type: actions.RESET_FORM,
    formId,
  };
};
