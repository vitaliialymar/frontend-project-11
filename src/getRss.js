import validate from './validator.js';
import { getData, parse, updatePosts } from './utilities.js';

const getRssData = (watchState) => {
  const { form, feedsItems } = watchState;
  const { url } = form.fields;

  validate(form.fields, feedsItems)
    .then(() => getData(url))
    .then((data) => {
      const { posts, ...feed } = parse(data, url);
      watchState.feedsItems.push(feed);
      watchState.postsItems.push(...posts);
      updatePosts(url, watchState);

      watchState.form.fields.url = '';
      watchState.form.feedbackValue = 'success';
      watchState.form.processState = 'sending';
      watchState.form.valid = true;
    })
    .catch((error) => {
      switch (error.name) {
        case 'AxiosError':
          watchState.form.feedbackValue = 'networkError';
          break;
        case 'ValidationError':
          watchState.form.feedbackValue = error.message;
          break;
        case 'ParsingError':
          watchState.form.feedbackValue = 'danger';
          break;
        default:
          watchState.form.feedbackValue = 'generalError';
          break;
      }
      watchState.form.valid = false;
      watchState.form.processState = 'filling';
    });
};

export default getRssData;
