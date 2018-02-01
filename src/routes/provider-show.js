import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createResolver } from '../redux';
import Provider from '../redux/provider';

import View from '../components/provider-show';

class ProviderShowRoute extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        providerId: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,
    model: PropTypes.object.isRequired,
    getProvider: PropTypes.func.isRequired,
    getPackages: PropTypes.func.isRequired
  };

  componentWillMount() {
    let { providerId } = this.props.match.params;
    this.props.getProvider(providerId);
  }

  componentWillReceiveProps({ match: { params: { providerId } } }) {
    if (providerId !== this.props.match.params.providerId) {
      this.props.getProvider(providerId);
    }
  }

  fetchPackages = (page) => {
    let { match, getPackages } = this.props;
    let { providerId } = match.params;

    getPackages(providerId, { page });
  };

  render() {
    return (
      <View
        model={this.props.model}
        fetchPackages={this.fetchPackages}
      />
    );
  }
}

export default connect(
  ({ eholdings: { data } }, { match }) => ({
    model: createResolver(data).find('providers', match.params.providerId)
  }), {
    getProvider: id => Provider.find(id, { include: 'packages' }),
    getPackages: (id, params) => Provider.queryRelated(id, 'packages', params)
  }
)(ProviderShowRoute);
