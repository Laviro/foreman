/* eslint-disable camelcase */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { Pagination, PaginationVariant } from '@patternfly/react-core';
import {
  TableText,
  Table as PF4Table,
  TableHeader,
  TableBody,
  sortable,
  cellWidth,
} from '@patternfly/react-table';

import { useForemanSettings } from '../../../../../Root/Context/ForemanContext';
import { STATUS } from '../../../../../constants';
import { translate as __ } from '../../../../../common/I18n';
import TableEmptyState from './components/EmptyState';
import { getSortColumnIndex, getPerPageOptions } from './TableHelpers';
import ActionsDropdown from '../ActionsDropdown';

const Table = ({
  page,
  perPage: urlPerPage,
  status,
  sortBy,
  sortOrder,
  query,
  itemCount,
  fetchData,
  onTableSetPage,
  onTablePerPageSelect,
  onTableSort,
  error,
  response,
  path,
}) => {
  const { perPage: appPerPage } = useForemanSettings();
  const perPage = urlPerPage || appPerPage;
  const [rows, setRows] = React.useState([]);
  const [columns, setColumns] = React.useState([]);
  const reloadData = () =>
    fetchData(path, { page, perPage, query, sortBy, sortOrder });

  useEffect(() => {
    reloadData();
  }, []);

  useEffect(() => {
    if (status === STATUS.RESOLVED && !isEmpty(response)) {
      const { rows: nextRows, columns: nextColumns } = response;
      const isActions = nextRows.some(({ actions }) => !!actions);
      nextRows && setRows(handleRows(nextRows));
      nextColumns && setColumns(handleColumns(nextColumns, isActions));
    }
  }, [response, status]);

  const handleRows = serverRows =>
    serverRows.asMutable({ deep: true }).map(({ cells, actions }) => {
      const nextCells = cells.map(cell => {
        if (typeof cell !== 'object') return cell;
        if (cell.type === 'link') {
          return (
            <TableText>
              <a href={cell.path}>{cell.label}</a>
            </TableText>
          );
        }
        return cell;
      });
      actions &&
        nextCells.push({
          title: (
            <ActionsDropdown
              isKebab
              actions={actions}
              reloadData={reloadData}
            />
          ),
        });

      return { cells: nextCells };
    });

  const handleColumns = (serverColumns, isActions) => {
    const nextColumns = serverColumns.asMutable({ deep: true }).map(colData => {
      if (typeof colData !== 'object') {
        return { title: colData };
      }
      const { sort_by, width, label } = colData;
      const col = { title: label, transforms: [] };
      if (sort_by) {
        col.sortKey = sort_by;
        col.transforms = [sortable];
      }
      if (width) {
        col.transforms = [...col.transforms, cellWidth(width)];
      }
      return col;
    });
    isActions && nextColumns.push(__('Actions'));
    return nextColumns;
  };

  return (
    <>
      <Pagination
        itemCount={itemCount}
        perPage={perPage}
        page={page}
        variant={PaginationVariant.top}
        onSetPage={(e, pageNo) => onTableSetPage(pageNo, path)}
        onPerPageSelect={(e, perP) => onTablePerPageSelect(perP, path)}
        perPageOptions={getPerPageOptions(urlPerPage, appPerPage)}
      />
      <PF4Table
        sortBy={{
          index: getSortColumnIndex(columns, sortBy),
          direction: sortOrder,
        }}
        onSort={(e, index, direction) =>
          onTableSort(index, direction, columns, path)
        }
        cells={columns}
        rows={rows}
        aria-label={`table${path}`}
        columns={columns}
      >
        <TableHeader />
        <TableBody />
      </PF4Table>
      <TableEmptyState status={status} error={error} rowsLength={rows.length} />
    </>
  );
};

Table.propTypes = {
  page: PropTypes.number,
  perPage: PropTypes.number,
  status: PropTypes.string,
  sortBy: PropTypes.string,
  sortOrder: PropTypes.string,
  itemCount: PropTypes.number,
  onTableSetPage: PropTypes.func.isRequired,
  onTablePerPageSelect: PropTypes.func.isRequired,
  onTableSort: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
  query: PropTypes.string,
  error: PropTypes.string,
  response: PropTypes.object,
  path: PropTypes.string.isRequired,
  columns: PropTypes.array,
};

Table.defaultProps = {
  page: 1,
  perPage: null,
  status: null,
  sortBy: '',
  sortOrder: '',
  query: '',
  error: '',
  response: {},
  columns: [],
  itemCount: 0,
};

export default Table;
