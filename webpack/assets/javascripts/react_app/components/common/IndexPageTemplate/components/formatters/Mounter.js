import React from 'react';
import PropTypes from 'prop-types';
import * as TableFormatters from './index';
import componentRegistry from '../../../../../components/componentRegistry';

const Mounter = ({
  component,
  componentProps,
  reloadData,
  preventDropdownToggle,
}) => {
  const ActualComponent =
    TableFormatters[component] || componentRegistry.registry.type[component];

  if (ActualComponent) {
    return (
      <ActualComponent
        {...componentProps}
        reloadData={reloadData}
        preventDropdownToggle={preventDropdownToggle}
      />
    );
  }

  return null;
};

Mounter.propTypes = {
  component: PropTypes.string.isRequired,
  componentProps: PropTypes.object,
  reloadData: PropTypes.func.isRequired,
  preventDropdownToggle: PropTypes.func.isRequired,
};

Mounter.defaultProps = {
  componentProps: {},
};

export default Mounter;
