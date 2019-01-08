import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';

import {
  Button,
  Icon,
  IconButton,
  PaneHeader
} from '@folio/stripes/components';

import { FormattedMessage } from 'react-intl';
import DetailsViewSection from '../../details-view-section';
import NameField from '../_fields/name';
import EditionField from '../_fields/edition';
import PublisherNameField from '../_fields/publisher-name';
import PackageSelectField from '../_fields/package-select';
import ContributorField from '../_fields/contributor';
import IdentifiersFields from '../_fields/identifiers';
import DescriptionField from '../_fields/description';
import PublicationTypeField from '../_fields/publication-type';
import PeerReviewedField from '../_fields/peer-reviewed';
import NavigationModal from '../../navigation-modal';
import Toaster from '../../toaster';
import PaneHeaderButton from '../../pane-header-button';
import styles from './title-create.css';

export default class TitleCreate extends Component {
  static propTypes = {
    customPackages: PropTypes.object.isRequired,
    onCancel: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    removeCreateRequests: PropTypes.func.isRequired,
    request: PropTypes.object.isRequired,
  };

  componentWillUnmount() {
    this.props.removeCreateRequests();
  }

  getActionMenu = ({ onToggle }) => {
    const {
      onCancel,
      request
    } = this.props;

    return onCancel ? (
      <Button
        data-test-eholdings-title-create-cancel-action
        buttonStyle="dropdownItem fullWidth"
        disabled={request.isPending}
        onClick={() => {
          onToggle();
          onCancel();
        }}
      >
        <FormattedMessage id="ui-eholdings.actionMenu.cancelEditing" />
      </Button>
    ) : null;
  }

  render() {
    let {
      customPackages,
      onSubmit,
      onCancel,
      request
    } = this.props;

    let packageOptions = customPackages.map(pkg => ({
      label: pkg.name,
      value: pkg.id
    }));

    return (
      <div data-test-eholdings-title-create>
        <Toaster
          position="bottom"
          toasts={request.errors.map(({ title }, index) => ({
            id: `error-${request.timestamp}-${index}`,
            message: title,
            type: 'error'
          }))}
        />
        <Form
          onSubmit={onSubmit}
          mutators={{ ...arrayMutators }}
          initialValues={{
            publicationType: 'Unspecified'
          }}
          render={({ handleSubmit, pristine }) => (
            <Fragment>
              <form onSubmit={handleSubmit}>
                <PaneHeader
                  paneTitle={<FormattedMessage id="ui-eholdings.title.create.paneTitle" />}
                  actionMenu={this.getActionMenu}
                  firstMenu={onCancel && (
                    <FormattedMessage id="ui-eholdings.label.icon.goBack">
                      {ariaLabel => (
                        <IconButton
                          icon="arrow-left"
                          ariaLabel={ariaLabel}
                          onClick={onCancel}
                          data-test-eholdings-details-view-back-button
                        />
                      )}
                    </FormattedMessage>
                  )}
                  lastMenu={(
                    <Fragment>
                      {request.isPending && (
                        <Icon icon="spinner-ellipsis" />
                      )}
                      <PaneHeaderButton
                        disabled={pristine || request.isPending}
                        type="submit"
                        buttonStyle="primary"
                        data-test-eholdings-title-create-save-button
                      >
                        {request.isPending ?
                          <FormattedMessage id="ui-eholdings.saving" />
                          : <FormattedMessage id="ui-eholdings.save" />
                        }
                      </PaneHeaderButton>
                    </Fragment>
                  )}
                />

                <div className={styles['title-create-form-container']}>
                  <DetailsViewSection
                    label={<FormattedMessage id="ui-eholdings.title.titleInformation" />}
                    separator={false}
                  >
                    <NameField />
                    <ContributorField />
                    <EditionField />
                    <PublisherNameField />
                    <PublicationTypeField />
                    <IdentifiersFields />
                    <DescriptionField />
                    <PeerReviewedField />
                  </DetailsViewSection>
                  <DetailsViewSection
                    label={<FormattedMessage id="ui-eholdings.label.packageInformation" />}
                  >
                    <PackageSelectField options={packageOptions} />
                  </DetailsViewSection>
                </div>
              </form>

              <NavigationModal
                modalLabel={<FormattedMessage id="ui-eholdings.navModal.modalLabel" />}
                continueLabel={<FormattedMessage id="ui-eholdings.navModal.continueLabel" />}
                dismissLabel={<FormattedMessage id="ui-eholdings.navModal.dismissLabel" />}
                when={!pristine && !request.isResolved}
              />
            </Fragment>
          )}
        />
      </div>
    );
  }
}
