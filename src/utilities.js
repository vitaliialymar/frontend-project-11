import axios from 'axios';
import uniqueId from 'lodash/uniqueId.js';
import isEmpty from 'lodash/isEmpty';
import { renderFeeds, renderPosts } from './view.js';

const getData = (url, watchState, i18next) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
  .then((response) => response.data.contents)
  .catch(() => {
    watchState.form.feedbackValue = i18next.t('networkError');
    watchState.form.valid = false;
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

const parse = (data, watchState, i18next) => {
  const parser = new DOMParser();
  const dom = parser.parseFromString(data, 'application/xml');
  const error = dom.querySelector('parsererror');
  if (error) {
    watchState.form.feedbackValue = i18next.t('danger');
    watchState.form.valid = false;
    console.log(error.querySelector('div').textContent);
  }
  return dom;
};

const updatePosts = (url, watchState, elements, i18next) => {
  const { postsItems, urls } = watchState.form;
  const currentUrl = urls.find((item) => item.url === url);
  const oldPostsItems = postsItems.filter((item) => item.feedId === currentUrl.id);
  const oldPostsTitles = oldPostsItems.map((post) => post.title);

  return getData(url, watchState, i18next)
    .then((data) => {
      const dom = parse(data, watchState, i18next);

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

export default (url, watchState, elements, i18next) => getData(url, watchState, i18next)
  .then((data) => {
    const dom = parse(data, watchState, i18next);
    getFeed(dom, watchState, url);
    const posts = getPosts(dom, watchState, url);
    watchState.form.postsItems.push(...posts);
    renderFeeds(elements, watchState);
    renderPosts(elements, watchState, i18next);
    updatePosts(url, watchState, elements, i18next);

    watchState.form.valid = true;
    watchState.form.fields.url = '';
  })
  .catch((e) => {
    watchState.form.valid = false;
    console.log(e.message);
  });
