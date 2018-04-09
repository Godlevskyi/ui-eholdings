import { expect } from 'chai';
import { describe, beforeEach, it } from '@bigtest/mocha';

import { describeApplication } from './helpers';
import PackageShowPage from './pages/package-show';
import PackageEditPage from './pages/package-edit';

describeApplication('CustomPackageEdit', () => {
  let provider,
    providerPackage;

  beforeEach(function () {
    provider = this.server.create('provider', {
      name: 'Cool Provider'
    });

    providerPackage = this.server.create('package', {
      provider,
      name: 'Cool Package',
      contentType: 'E-Book',
      isSelected: true,
      isCustom: true
    });
  });

  describe('visiting the package edit page without coverage dates', () => {
    beforeEach(function () {
      return this.visit(`/eholdings/packages/${providerPackage.id}/edit`, () => {
        expect(PackageEditPage.$root).to.exist;
      });
    });

    it('shows blank datepicker fields', () => {
      expect(PackageEditPage.dateRangeRowList(0).beginDate.value).to.equal('');
      expect(PackageEditPage.dateRangeRowList(0).endDate.value).to.equal('');
    });

    it('disables the save button', () => {
      expect(PackageEditPage.isSaveDisabled).to.be.true;
    });

    describe('clicking cancel', () => {
      beforeEach(() => {
        return PackageEditPage.clickCancel();
      });

      it('goes to the package show page', () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    describe('entering invalid data', () => {
      beforeEach(() => {
        return PackageEditPage.interaction
          .once(() => PackageEditPage.dateRangeRowList().length > 0)
          .do(() => {
            return PackageEditPage.interaction
              .append(PackageEditPage.dateRangeRowList(0).fillDates('12/18/2018', '12/16/2018'))
              .clickSave();
          });
      });

      it('displays a validation error for coverage', () => {
        expect(PackageEditPage.dateRangeRowList(0).beginDate.isInvalid).to.be.true;
      });
    });

    describe('entering valid data', () => {
      beforeEach(() => {
        return PackageEditPage.interaction
          .once(() => PackageEditPage.dateRangeRowList().length > 0)
          .do(() => {
            return PackageEditPage.dateRangeRowList(0).fillDates('12/16/2018', '12/18/2018');
          });
      });

      describe('clicking cancel', () => {
        beforeEach(() => {
          return PackageEditPage.clickCancel();
        });

        it('shows a navigation confirmation modal', () => {
          expect(PackageEditPage.navigationModal.$root).to.exist;
        });
      });

      describe('clicking save', () => {
        beforeEach(() => {
          return PackageEditPage.clickSave();
        });

        it('goes to the package show page', () => {
          expect(PackageShowPage.$root).to.exist;
        });

        it('displays the new coverage dates', () => {
          expect(PackageShowPage.customCoverage).to.equal('12/16/2018 - 12/18/2018');
        });
      });
    });
  });

  describe('visiting the package edit page with coverage dates and content type', () => {
    beforeEach(function () {
      providerPackage.update('customCoverage', {
        beginCoverage: '1969-07-16',
        endCoverage: '1972-12-19'
      });
      providerPackage.update('contentType', 'E-Book');
      providerPackage.save();

      return this.visit(`/eholdings/packages/${providerPackage.id}/edit`, () => {
        expect(PackageEditPage.$root).to.exist;
      });
    });

    it('disables the save button', () => {
      expect(PackageEditPage.isSaveDisabled).to.be.true;
    });

    describe('clicking cancel', () => {
      beforeEach(() => {
        return PackageEditPage.clickCancel();
      });

      it('goes to the package show page', () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    describe('entering invalid data', () => {
      beforeEach(() => {
        return PackageEditPage.interaction
          .name('')
          .append(PackageEditPage.dateRangeRowList(0).fillDates('12/18/2018', '12/16/2018'))
          .clickSave();
      });

      it('displays a validation error for the name', () => {
        expect(PackageEditPage.nameHasError).to.be.true;
      });

      it('displays a validation error for coverage', () => {
        expect(PackageEditPage.dateRangeRowList(0).beginDate.isInvalid).to.be.true;
      });
    });

    describe('entering valid data', () => {
      beforeEach(() => {
        return PackageEditPage
          .name('A Different Name')
          .contentType('E-Journal')
          .append(PackageEditPage.dateRangeRowList(0).fillDates('12/16/2018', '12/18/2018'));
      });

      describe('clicking cancel', () => {
        beforeEach(() => {
          return PackageEditPage.clickCancel();
        });

        it('shows a navigation confirmation modal', () => {
          expect(PackageEditPage.navigationModal.$root).to.exist;
        });
      });

      describe('clicking save', () => {
        beforeEach(() => {
          return PackageEditPage.clickSave();
        });

        it('goes to the package show page', () => {
          expect(PackageShowPage.$root).to.exist;
        });

        it('reflects the new name', () => {
          expect(PackageShowPage.name).to.equal('A Different Name');
        });

        it('reflects the new coverage dates', () => {
          expect(PackageShowPage.customCoverage).to.equal('12/16/2018 - 12/18/2018');
        });

        it('reflects the new content type', () => {
          expect(PackageShowPage.customContentType).to.equal('E-Journal');
        });
      });
    });
  });

  describe('encountering a server error when GETting', () => {
    beforeEach(function () {
      this.server.get('/packages/:id', {
        errors: [{
          title: 'There was an error'
        }]
      }, 500);

      return this.visit(`/eholdings/packages/${providerPackage.id}/edit`, () => {
        expect(PackageEditPage.$root).to.exist;
      });
    });

    it('dies with dignity', () => {
      expect(PackageEditPage.hasErrors).to.be.true;
    });
  });

  describe('encountering a server error when PUTting', () => {
    beforeEach(function () {
      this.server.put('/packages/:id', {
        errors: [{
          title: 'There was an error'
        }]
      }, 500);

      return this.visit(`/eholdings/packages/${providerPackage.id}/edit`, () => {
        expect(PackageEditPage.$root).to.exist;
      });
    });

    describe('entering valid data and clicking save', () => {
      beforeEach(() => {
        return PackageEditPage.interaction
          .name('A Different Name')
          .append(PackageEditPage.dateRangeRowList(0).fillDates('12/16/2018', '12/18/2018'))
          .clickSave();
      });

      it('pops up an error', () => {
        expect(PackageEditPage.toast.errorText).to.equal('There was an error');
      });
    });
  });
});
