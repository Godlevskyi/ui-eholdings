import React from 'react';
import { Field } from 'redux-form';

import { TextArea } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';

function validate(value) {
  return value.length > 1500 ?
    <FormattedMessage id="ui-eholdings.validate.errors.title.description.length" /> : undefined;
}

export default function DescriptionField() {
  return (
    <div data-test-eholdings-description-textarea>
      <Field
        name="description"
        component={TextArea}
        label={<FormattedMessage id="ui-eholdings.title.description" />}
        validate={validate}
      />
    </div>
  );
}
