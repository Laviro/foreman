import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  Modal,
  Button,
  DropdownItem,
  ModalVariant,
} from '@patternfly/react-core';
import { APIActions } from '../../../../../redux/API';
import { translate as __ } from '../../../../../common/I18n';
import { noop } from '../../../../../common/helpers';
import { selectAPIStatus } from '../../../../../redux/API/APISelectors';
import { STATUS } from '../../../../../constants';

export const TableConfirmModal = ({
  disabled,
  label,
  message,
  path,
  operation,
  reloadData,
  preventDropdownToggle,
}) => {
  const [open, setOpen] = React.useState(false);
  const toggleModal = () => setOpen(value => !value);

  useEffect(() => {
    preventDropdownToggle(open);
  }, [open, preventDropdownToggle]);

  const APIKey = `CONFIRM${path}`;
  const status = useSelector(state => selectAPIStatus(state, APIKey));
  const dispatch = useDispatch();
  const handleConfirm = () => {
    dispatch(
      APIActions[operation]({
        key: APIKey,
        url: path,
        successToast: response => response.data.message,
        handleSuccess: reloadData,
      })
    );
  };

  return (
    <React.Fragment>
      <DropdownItem isDisabled={disabled} onClick={toggleModal}>
        {label}
      </DropdownItem>
      <Modal
        id="table-confirm-modal"
        variant={ModalVariant.small}
        title={label}
        isOpen={open}
        onClose={toggleModal}
        actions={[
          <Button
            key="confirm"
            variant="primary"
            onClick={handleConfirm}
            isLoading={status === STATUS.PENDING}
          >
            {__('Confirm')}
          </Button>,
          <Button key="cancel" variant="link" onClick={toggleModal}>
            {__('Cancel')}
          </Button>,
        ]}
      >
        {message}
      </Modal>
    </React.Fragment>
  );
};

TableConfirmModal.propTypes = {
  disabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  operation: PropTypes.string.isRequired,
  reloadData: PropTypes.func.isRequired,
  preventDropdownToggle: PropTypes.func,
};

TableConfirmModal.defaultProps = {
  disabled: false,
  preventDropdownToggle: noop,
};

export default TableConfirmModal;
