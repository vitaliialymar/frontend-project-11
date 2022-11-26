import validate from './validator.js';
import { getData, parse, updatePosts } from './utilities.js';

const getRssData = (watchState, i18next) => {
  const { fields, urls } = watchState.form;
  const { url } = fields;

  validate(fields, urls, i18next)
    .then(() => getData(url))
    .then((data) => {
      const { posts, ...feed } = parse(data, url);
      watchState.form.urls.push(feed);
      watchState.form.postsItems.push(...posts);
      updatePosts(url, watchState, i18next);

      watchState.form.fields.url = '';
      watchState.form.feedbackValue = i18next.t('success');
      watchState.form.processState = 'sending';
      watchState.form.valid = true;
    })
    .catch((error) => {
      switch (error.name) {
        case 'AxiosError':
          watchState.form.feedbackValue = i18next.t('networkError');
          break;
        case 'ValidationError':
          watchState.form.feedbackValue = error.message;
          break;
        case 'ParsingError':
          watchState.form.feedbackValue = i18next.t('danger');
          break;
        default:
          throw new Error('Unknown Error!');
      }
      watchState.form.valid = false;
      watchState.form.processState = 'filling';
    });
};

export default getRssData;
