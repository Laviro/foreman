import React from 'react';
import {
  DropdownItem,
  KebabToggle,
  Dropdown,
  DropdownToggle,
} from '@patternfly/react-core';
import PropTypes from 'prop-types';
import CaretDownIcon from '@patternfly/react-icons/dist/js/icons/caret-down-icon';
import { translate as __ } from '../../../../common/I18n';
import Mounter from './formatters/Mounter';

const ActionsDropdown = ({ actions, isKebab, reloadData }) => {
  const [open, setOpen] = React.useState(false);
  const [preventDropdownToggle, setPreventDropdownToggle] = React.useState(
    false
  );
  const toggleDropdown = () => {
    !preventDropdownToggle && setOpen(value => !value);
  };
  const dropdownItems = actions.map(
    ({ component, props: compProps, disabled, path, label }, index) => {
      if (component) {
        return (
          <Mounter
            key={index}
            component={component}
            componentProps={compProps}
            reloadData={reloadData}
            preventDropdownToggle={setPreventDropdownToggle}
          />
        );
      }

      return (
        <DropdownItem key={index} disabled={disabled} href={path}>
          {label}
        </DropdownItem>
      );
    }
  );

  return (
    <>
      <Dropdown
        onSelect={setOpen}
        isPlain={isKebab}
        toggle={
          isKebab ? (
            <KebabToggle onToggle={toggleDropdown} />
          ) : (
            <DropdownToggle
              onToggle={toggleDropdown}
              toggleIndicator={CaretDownIcon}
            >
              {__('Actions')}
            </DropdownToggle>
          )
        }
        isOpen={open}
        dropdownItems={dropdownItems}
      />
    </>
  );
};

ActionsDropdown.propTypes = {
  actions: PropTypes.array,
  isKebab: PropTypes.bool,
  reloadData: PropTypes.func,
};

ActionsDropdown.defaultProps = {
  actions: [],
  isKebab: false,
  reloadData: n => n,
};

export default ActionsDropdown;
