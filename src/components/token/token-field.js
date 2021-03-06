import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  TextArea
} from '@folio/stripes/components';
import styles from './token-field.css';

export default class TokenField extends Component {
  static propTypes = {
    token: PropTypes.object,
    tokenValue: PropTypes.string,
    type: PropTypes.string
  };

  state = {
    showInputs: this.props.tokenValue
  };

  toggleInputs = () => {
    this.setState(({ showInputs }) => ({
      showInputs: !showInputs
    }));
  }

  validate(value) {
    return value && value.length > 500 ? (
      <FormattedMessage id="ui-eholdings.validate.errors.token.length" />
    ) : undefined;
  }

  render() {
    /* eslint-disable react/no-danger */
    let { token, type } = this.props;
    let { showInputs } = this.state;
    let helpTextMarkup = { __html: token.helpText };

    return (showInputs) ? (
      <div className={styles['token-fields']}>
        <div
          data-test-eholdings-token-fields-help-text={type}
          className={styles['token-help-text']}
          dangerouslySetInnerHTML={helpTextMarkup}
        />
        <div data-test-eholdings-token-fields-prompt={type} className={styles['token-prompt-text']}>
          {token.prompt}
        </div>
        <div data-test-eholdings-token-value-textarea={type} className={styles['token-value-textarea']}>
          {type === 'provider' ? (
            <Field name="providerTokenValue" component={TextArea} validate={this.validate} />
          ) : (
            <Field name="packageTokenValue" component={TextArea} validate={this.validate} />
          )}
        </div>
      </div>
    ) : (
      <div
        className={styles['token-add-row-button']}
        data-test-eholdings-token-add-button={type}
      >
        <Button
          type="button"
          onClick={this.toggleInputs}
        >
          {type === 'provider' ? (<FormattedMessage id="ui-eholdings.provider.token.addToken" />) : (<FormattedMessage id="ui-eholdings.package.token.addToken" />)}
        </Button>
      </div>
    );
  }
}
