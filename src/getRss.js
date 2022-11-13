import validate from './validator.js';
import buildData from './parser.js';

const getRssData = (watchState, i18next, elements) => {
  validate(watchState.form.fields, watchState.form.urls, i18next)
    .then(() => {
      watchState.form.feedbackValue = i18next.t('success');
      watchState.form.valid = true;
      watchState.form.processState = 'sending';
      return buildData(watchState.form.fields.url, watchState, elements);
    })
    .catch((error) => {
      watchState.form.feedbackValue = error.message;
      watchState.form.valid = false;
      watchState.form.processState = 'filling';
    });
};

export default getRssData;
