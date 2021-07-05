import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { routes } from './routes';
import { renderRoute } from './RoutingService';
import ForemanSwitch from './ForemanSwitcher';
import IndexPageTemplate from '../components/common/IndexPageTemplate';

const AppSwitcher = ({ children, indexPages }) => {
  const appRoutes = [
    ...routes,
    ...indexPages.map(({ path, props: ownProps }) => ({
      path,
      render: props => <IndexPageTemplate {...props} {...ownProps} />,
    })),
  ];
  return (
    <>
      <ForemanSwitch>
        {appRoutes.map(({ render, path, ...routeProps }) => (
          <Route
            path={path}
            key={path}
            {...routeProps}
            render={renderProps => renderRoute(render, renderProps)}
          />
        ))}
      </ForemanSwitch>
      {children}
    </>
  );
};

AppSwitcher.propTypes = {
  children: PropTypes.object,
  indexPages: PropTypes.array,
};

AppSwitcher.defaultProps = {
  children: null,
  indexPages: [],
};

export default AppSwitcher;
