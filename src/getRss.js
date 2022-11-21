import validate from './validator.js';
import {
  getData, getFeed, getPosts, parse, updatePosts,
} from './utilities.js';

const getRssData = (watchState, i18next, elements) => {
  validate(watchState.form.fields, watchState.form.urls, i18next)
    .then(() => getData(watchState.form.fields.url, i18next))
    .then((data) => {
      const dom = parse(data, i18next);
      getFeed(dom, watchState, watchState.form.fields.url);
      const posts = getPosts(dom, watchState, watchState.form.fields.url);
      watchState.form.postsItems.push(...posts);
      updatePosts(watchState.form.fields.url, watchState, elements, i18next);

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
