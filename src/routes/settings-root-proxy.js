import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import { TitleManager } from '@folio/stripes/core';

import { createResolver } from '../redux';
import { ProxyType, RootProxy } from '../redux/application';
import View from '../components/settings-root-proxy';

class SettingsRootProxyRoute extends Component {
  static propTypes = {
    getProxyTypes: PropTypes.func.isRequired,
    getRootProxy: PropTypes.func.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
    proxyTypes: PropTypes.object.isRequired,
    rootProxy: PropTypes.object.isRequired,
    updateRootProxy: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    props.getProxyTypes();
    props.getRootProxy();
  }

  componentDidUpdate(prevProps) {
    const { history, rootProxy } = this.props;
    let wasPending = prevProps.rootProxy.update.isPending && !rootProxy.update.isPending;
    let needsUpdate = !isEqual(prevProps.rootProxy, rootProxy);
    let isRejected = rootProxy.update.isRejected;

    if (wasPending && needsUpdate && !isRejected) {
      history.push({
        pathname: '/settings/eholdings/root-proxy',
        state: { eholdings: true, isFreshlySaved: true }
      });
    }
  }

  rootProxySubmitted = (values) => {
    let { rootProxy, updateRootProxy } = this.props;

    rootProxy.proxyTypeId = values.rootProxyServer;

    updateRootProxy(rootProxy);
  }

  render() {
    let { proxyTypes, rootProxy, history } = this.props;

    return (
      <TitleManager page="eHoldings settings" record="Root proxy">
        <View
          proxyTypes={proxyTypes}
          rootProxy={rootProxy}
          onSubmit={this.rootProxySubmitted}
          isFreshlySaved={
            history.action === 'PUSH' &&
            history.location.state &&
            history.location.state.isFreshlySaved
          }
        />
      </TitleManager>
    );
  }
}

export default connect(
  ({ eholdings: { data } }) => ({
    proxyTypes: createResolver(data).query('proxyTypes'),
    rootProxy: createResolver(data).find('rootProxies', 'root-proxy')
  }), {
    getProxyTypes: () => ProxyType.query(),
    getRootProxy: () => RootProxy.find('root-proxy'),
    updateRootProxy: model => RootProxy.save(model)
  }
)(SettingsRootProxyRoute);
