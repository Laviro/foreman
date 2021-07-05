import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from './TableActions';
import Table from './Table';
import { getTableAPIKey } from './TableHelpers';
import {
  selectPage,
  selectPerPage,
  selectSearch,
  selectStatus,
  selectSortBy,
  selectSortOrder,
  selectResponse,
  selectItemCount,
  selectError,
} from './TableSelectors';

// map state to props
const mapStateToProps = (state, { path }) => {
  const key = getTableAPIKey(path);
  return {
    query: selectSearch(state),
    page: selectPage(state),
    perPage: selectPerPage(state),
    sortBy: selectSortBy(state),
    sortOrder: selectSortOrder(state),
    response: selectResponse(state, key),
    itemCount: selectItemCount(state, key),
    error: selectError(state, key),
    status: selectStatus(state, key),
  };
};

// map action dispatchers to props
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

// export connected component
export default connect(mapStateToProps, mapDispatchToProps)(Table);
