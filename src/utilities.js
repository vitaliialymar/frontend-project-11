import axios from 'axios';
import uniqueId from 'lodash/uniqueId.js';
import _ from 'lodash';

const getData = (url, i18next) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
  .then((response) => response.data.contents)
  .catch(() => {
    throw new Error(`${i18next.t('networkError')}`);
  });

const parse = (data, i18next, url) => {
  const parser = new DOMParser();
  const dom = parser.parseFromString(data, 'application/xml');
  const error = dom.querySelector('parsererror');
  if (error) {
    console.log(error.querySelector('div').textContent);
    throw new Error(`${i18next.t('danger')}`);
  }

  const getFeed = () => {
    const title = dom.querySelector('title').textContent;
    const description = dom.querySelector('description').textContent;
    return { url, title, description };
  };

  const getPosts = () => {
    const items = dom.querySelectorAll('item');
    const posts = [];
    items.forEach((item) => {
      const title = item.querySelector('title').textContent;
      const link = item.querySelector('link').textContent;
      const description = item.querySelector('description').textContent;
      posts.push({
        id: uniqueId(), title, link, description,
      });
    });
    return posts;
  };

  const feed = getFeed();
  const posts = getPosts();

  return { feed, posts };
};

const updatePosts = (url, watchState, elements, i18next) => {
  const { postsItems } = watchState.form;

  return getData(url, i18next)
    .then((data) => {
      const dom = parse(data, i18next, url);

      const currentPosts = dom.posts;
      const difference = _.differenceBy(currentPosts, postsItems, 'title');
      if (_.isEmpty(difference)) {
        return;
      }
      watchState.form.postsItems.unshift(...difference);
    })
    .catch((e) => console.log(e.message))
    .then(() => setTimeout(() => updatePosts(url, watchState, elements, i18next), 5000));
};

export {
  getData,
  parse,
  updatePosts,
};
