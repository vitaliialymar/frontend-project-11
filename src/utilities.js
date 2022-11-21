import axios from 'axios';
import uniqueId from 'lodash/uniqueId.js';
import isEmpty from 'lodash/isEmpty';

const getData = (url, i18next) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
  .then((response) => response.data.contents)
  .catch(() => {
    throw new Error(`${i18next.t('networkError')}`);
  });

const getFeed = (dom, watchState, url) => {
  const title = dom.querySelector('title').textContent;
  const description = dom.querySelector('description').textContent;
  watchState.form.urls.push({
    id: uniqueId(), url, title, description,
  });
};

const getPosts = (dom, watchState, url) => {
  const { urls } = watchState.form;
  const currentUrl = urls.find((item) => item.url === url);
  const items = dom.querySelectorAll('item');
  const posts = [];
  items.forEach((item) => {
    const title = item.querySelector('title').textContent;
    const link = item.querySelector('link').textContent;
    const description = item.querySelector('description').textContent;
    posts.push({
      feedId: currentUrl.id, id: uniqueId(), title, link, description,
    });
  });
  return posts;
};

const parse = (data, i18next) => {
  const parser = new DOMParser();
  const dom = parser.parseFromString(data, 'application/xml');
  const error = dom.querySelector('parsererror');
  if (error) {
    console.log(error.querySelector('div').textContent);
    throw new Error(`${i18next.t('danger')}`);
  }
  return dom;
};

const updatePosts = (url, watchState, elements, i18next) => {
  const { postsItems, urls } = watchState.form;
  const currentUrl = urls.find((item) => item.url === url);
  const oldPostsItems = postsItems.filter((item) => item.feedId === currentUrl.id);
  const oldPostsTitles = oldPostsItems.map((post) => post.title);

  return getData(url, i18next)
    .then((data) => {
      const dom = parse(data, i18next);

      const currentPosts = getPosts(dom, watchState, url);
      const currentPostsTitles = currentPosts.map((post) => post.title);
      const difference = currentPostsTitles.filter((title) => !oldPostsTitles.includes(title));
      if (isEmpty(difference)) {
        return;
      }
      const newPosts = difference.map((title) => currentPosts
        .filter((post) => post.title === title));
      watchState.form.postsItems.unshift(...newPosts.flat());
    })
    .catch((e) => console.log(e.message))
    .then(() => setTimeout(() => updatePosts(url, watchState, elements, i18next), 5000));
};

export {
  getData,
  getFeed,
  getPosts,
  parse,
  updatePosts,
};
