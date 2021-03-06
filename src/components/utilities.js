import moment from 'moment';
import queryString from 'qs';

export function isBookPublicationType(publicationType) {
  let publicationTypeIsBook = {
    'All': false,
    'Audiobook': true,
    'Book': true,
    'Book Series': true,
    'Database': false,
    'Journal': false,
    'Newsletter': false,
    'Newspaper': false,
    'Proceedings': false,
    'Report': false,
    'Streaming Audio': true,
    'Streaming Video': true,
    'Thesis & Dissertation': false,
    'Website': false,
    'Unspecified': false
  };

  return !!publicationTypeIsBook[publicationType];
}

export function isValidCoverage(coverageObj) {
  if (coverageObj.beginCoverage) {
    if (!moment.utc(coverageObj.beginCoverage, 'YYYY-MM-DD').isValid()) { return false; }
  }
  if (coverageObj.endCoverage) {
    if (!moment.utc(coverageObj.endCoverage, 'YYYY-MM-DD').isValid()) { return false; }
  }
  return true;
}

export function isValidCoverageList(coverageArray) {
  return coverageArray
    .every(coverageArrayObj => (isValidCoverage(coverageArrayObj)));
}

// We use these functions quite a bit with these options, so this just
// allows us to preload them with defaults so we don't have to repeat
// the same options every time.
export const qs = {
  parse: path => queryString.parse(path, { ignoreQueryPrefix: true }),
  stringify: params => queryString.stringify(params, { encodeValuesOnly: true })
};

export const processErrors = ({ request, update, destroy }) => {
  let processErrorsSet = ({ errors, timestamp }) => errors.map((error, index) => ({
    message: error.title,
    type: 'error',
    id: `error-${timestamp}-${index}`
  }));

  let hasErrors = update.isRejected || request.isRejected || destroy.isRejected;
  let putErrors = hasErrors ? processErrorsSet(update) : [];
  let getErrors = hasErrors ? processErrorsSet(request) : [];
  let destroyErrors = hasErrors ? processErrorsSet(destroy) : [];

  return [...putErrors, ...getErrors, ...destroyErrors];
};

/**
 * Transforms UI params into search params
 *
 * @param {Object} parms - query param object
 */
export function transformQueryParams(searchType, params) {
  if (searchType === 'titles') {
    let { q, searchfield = 'name', filter = {}, ...searchParams } = params;
    if (searchfield === 'title') { searchfield = 'name'; }
    let searchfilter = { ...filter, [searchfield]: q };
    return { ...searchParams, filter: searchfilter };
  } else { return params; }
}
