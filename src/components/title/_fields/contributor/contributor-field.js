import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'redux-form';
import {
  Headline,
  RepeatableField,
  Select,
  TextField
} from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';
import styles from './contributor-field.css';

export default class ContributorField extends Component {
  static propTypes = {
    initialValue: PropTypes.array,
  };

  validateName(value) {
    let errors;

    if (!value) {
      errors = <FormattedMessage id="ui-eholdings.validate.errors.contributor.empty" />;
    }

    if (value && value.length >= 250) {
      errors = <FormattedMessage id="ui-eholdings.validate.errors.contributor.exceedsLength" />;
    }

    return errors;
  }

  renderField = (contributor, index, fields) => {
    return (
      <Fragment>
        <div
          data-test-eholdings-contributor-type
          className={styles['contributor-fields-contributor']}
        >
          <Field
            name={`${contributor}.type`}
            component={Select}
            autoFocus={Object.keys(fields.get(index)).length === 0}
            label={<FormattedMessage id="ui-eholdings.type" />}
            id={`${contributor}-type`}
          >
            <FormattedMessage id="ui-eholdings.label.author">
              {(message) => <option value="author">{message}</option>}
            </FormattedMessage>
            <FormattedMessage id="ui-eholdings.label.editor">
              {(message) => <option value="editor">{message}</option>}
            </FormattedMessage>
            <FormattedMessage id="ui-eholdings.label.illustrator">
              {(message) => <option value="illustrator">{message}</option>}
            </FormattedMessage>
          </Field>
        </div>
        <div
          data-test-eholdings-contributor-contributor
          className={styles['contributor-fields-contributor']}
        >
          <Field
            name={`${contributor}.contributor`}
            type="text"
            id={`${contributor}-input`}
            component={TextField}
            label={<FormattedMessage id="ui-eholdings.name" />}
            validate={this.validateName}
          />
        </div>
      </Fragment>
    );
  }

  render() {
    const { initialValue } = this.props;

    return (
      <div data-test-eholdings-contributor-field>
        <FieldArray
          addLabel={<FormattedMessage id="ui-eholdings.title.contributor.addContributor" />}
          component={RepeatableField}
          emptyMessage={
            initialValue && initialValue.length > 0 && initialValue[0].contributor ?
              <FormattedMessage id="ui-eholdings.title.contributor.notSet" /> : ''
          }
          legend={<Headline tag="h4"><FormattedMessage id="ui-eholdings.label.contributors" /></Headline>}
          name="contributors"
          renderField={this.renderField}
        />
      </div>
    );
  }
}
