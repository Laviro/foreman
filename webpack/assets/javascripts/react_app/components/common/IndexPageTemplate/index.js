/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Table from './components/Table';
import PageLayout from '../../../routes/common/PageLayout/PageLayout';
import { fetchData } from './components/Table/TableActions';
import { getControllerSearchProps } from '../../../constants';
import {
  selectSearch,
  selectResponse,
} from './components/Table/TableSelectors';
import { getTableAPIKey } from './components/Table/TableHelpers';
import PageActionDropdown from './components/PageActionsDropdown';

const IndexPageTemplate = ({ path }) => {
  const dispatch = useDispatch();
  const searchQuery = useSelector(selectSearch);
  const { title, header, page_actions } = useSelector(state =>
    selectResponse(state, getTableAPIKey(path))
  );
  const onSearch = nextQuery =>
    dispatch(fetchData(path, { query: nextQuery, page: 1 }));
  return (
    <PageLayout
      className="index_page_template"
      searchable
      searchQuery={searchQuery}
      searchProps={getControllerSearchProps(path)}
      onSearch={onSearch}
      header={header}
      title={title}
      toolbarButtons={<PageActionDropdown actions={page_actions} />}
    >
      <Table path={path} />
    </PageLayout>
  );
};

IndexPageTemplate.propTypes = {
  path: PropTypes.string.isRequired,
};

export default IndexPageTemplate;
