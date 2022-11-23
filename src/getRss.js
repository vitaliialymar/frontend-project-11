import validate from './validator.js';
import { getData, parse, updatePosts } from './utilities.js';

const getRssData = (watchState, i18next, elements) => {
  const { fields, urls } = watchState.form;
  const { url } = fields;

  validate(fields, urls, i18next)
    .then(() => getData(url, i18next))
    .then((data) => {
      const dom = parse(data, i18next, url);
      watchState.form.urls.push(dom.feed);
      watchState.form.postsItems.push(...dom.posts);
      updatePosts(url, watchState, elements, i18next);

      watchState.form.fields.url = '';
      watchState.form.feedbackValue = i18next.t('success');
      watchState.form.processState = 'sending';
      watchState.form.valid = true;
    })
    .catch((error) => {
      watchState.form.feedbackValue = error.message;
      watchState.form.valid = false;
      watchState.form.processState = 'filling';
    });
};

export default getRssData;
