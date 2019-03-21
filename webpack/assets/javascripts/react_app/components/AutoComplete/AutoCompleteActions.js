import URI from 'urijs';
import debounce from 'lodash/debounce';
import API from '../../API';
import { STATUS } from '../../constants';
import { clearSpaces } from '../../common/helpers';
import {
  AUTO_COMPLETE_REQUEST,
  AUTO_COMPLETE_SUCCESS,
  AUTO_COMPLETE_FAILURE,
  AUTO_COMPLETE_RESET,
  TRIGGERS,
} from './AutoCompleteConstants';

export const getResults = ({
  url,
  searchQuery,
  controller,
  trigger,
  id,
}) => dispatch => {
  startRequest({
    controller,
    searchQuery,
    trigger,
    dispatch,
    id,
  });

  return createAPIRequest({
    controller,
    searchQuery,
    trigger,
    id,
    dispatch,
    url,
  });
};

let createAPIRequest = ({
  controller,
  searchQuery,
  trigger,
  id,
  dispatch,
  url,
}) => {
  if (!url) {
    requestFailure({ error: null, id, dispatch });
    throw new Error('No API path was provided.');
  }
  const path = getAPIPath({ trigger, searchQuery, url });
  return API.get(path)
    .then(({ data }) =>
      requestSuccess({
        data,
        controller,
        dispatch,
        searchQuery,
        trigger,
        id,
      })
    )
    .catch(error => {
      if (!error.visible) {
        requestFailure({ error: null, id, dispatch });
        // this would be a console error.
        throw error;
      }
      // this would be a UI visible error.
      requestFailure({ error: error.message, id, dispatch });
    });
};

createAPIRequest = debounce(createAPIRequest, 250);

const startRequest = ({ controller, searchQuery, trigger, dispatch, id }) => {
  dispatch({
    type: AUTO_COMPLETE_REQUEST,
    payload: {
      controller,
      searchQuery,
      status: STATUS.PENDING,
      trigger,
      id,
    },
  });
};

const requestSuccess = ({
  data,
  trigger,
  controller,
  searchQuery,
  id,
  dispatch,
}) => {
  const { error } = data[0] || {};
  if (error) {
    // eslint-disable-next-line no-throw-literal
    throw { message: error, visible: true }; // display this error in the UI.
  }
  const results = data.map(result => objectDeepTrim(result, trigger));
  return dispatch({
    type: AUTO_COMPLETE_SUCCESS,
    payload: {
      controller,
      results,
      searchQuery,
      status: STATUS.RESOLVED,
      trigger,
      id,
      error,
    },
  });
};

const requestFailure = ({ error, id, dispatch }) => {
  dispatch({
    type: AUTO_COMPLETE_FAILURE,
    payload: {
      results: [],
      error,
      status: STATUS.ERROR,
      id,
    },
  });
};

const isFinishedWithPoint = string => string.slice(-1) === '.';

const getAPIPath = ({ trigger, searchQuery, url }) => {
  const loadNextResults =
    trigger === TRIGGERS.ITEM_SELECT && !isFinishedWithPoint(searchQuery)
      ? ' '
      : '';
  const APISearchQuery = searchQuery + loadNextResults;
  const APIPath = new URI(url);
  APIPath.addSearch({ search: APISearchQuery });
  return APIPath.toString();
};

export const resetData = (controller, id) => dispatch =>
  dispatch({
    type: AUTO_COMPLETE_RESET,
    payload: { controller, id },
  });

export const initialUpdate = (searchQuery, controller, id) => dispatch =>
  dispatch({
    type: AUTO_COMPLETE_SUCCESS,
    payload: {
      searchQuery,
      controller,
      trigger: TRIGGERS.COMPONENT_DID_MOUNT,
      status: STATUS.RESOLVED,
      results: [],
      id,
    },
  });

const objectDeepTrim = (obj, trigger) => {
  const copy = { ...obj };
  Object.keys(copy).forEach(key => {
    const addSpace =
      key === 'label' && trigger === TRIGGERS.ITEM_SELECT ? ' ' : '';
    copy[key] = clearSpaces(copy[key]) + addSpace;
  });
  return copy;
};
