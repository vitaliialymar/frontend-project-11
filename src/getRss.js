import validate from './validator.js';
import buildData from './utilities.js';

const getRssData = (watchState, i18next, elements) => {
  validate(watchState.form.fields, watchState.form.urls, i18next)
    .then(() => {
      watchState.form.feedbackValue = i18next.t('success');
      watchState.form.processState = 'sending';
      buildData(watchState.form.fields.url, watchState, elements, i18next);
    })
    .catch((error) => {
      watchState.form.feedbackValue = error.message;
      watchState.form.valid = false;
      watchState.form.processState = 'filling';
      console.log(watchState);
    });
};

export default getRssData;
