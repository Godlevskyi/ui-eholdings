import React from 'react';
import { Field } from 'redux-form';

import { Checkbox } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';
import styles from './peer-reviewed-field.css';

function PeerReviewedField() {
  return (
    <div
      data-test-eholdings-peer-reviewed-field
      className={styles['peer-reviewed-field']}
    >
      <Field
        name="isPeerReviewed"
        component={Checkbox}
        label={<FormattedMessage id="ui-eholdings.title.peerReviewed" />}
      />
    </div>
  );
}

export default PeerReviewedField;
