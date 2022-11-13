import axios from 'axios';
import uniqueId from 'lodash/uniqueId.js';
import { renderFeeds, renderPosts } from './view.js';

const getData = (url) => axios.get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}`)
  .then((response) => response.data.contents)
  .catch((error) => {
    throw error;
  });

const getFeed = (dom) => {
  const title = dom.querySelector('title').textContent;
  const description = dom.querySelector('description').textContent;
  return { title, description };
};

const getPosts = (dom) => {
  const items = dom.querySelectorAll('item');
  const posts = [];
  items.forEach((item) => {
    const title = item.querySelector('title').textContent;
    const link = item.querySelector('link').textContent;
    posts.push({ id: uniqueId(), title, link });
  });
  return posts;
};

const parse = (data, watchState, i18next) => {
  const parser = new DOMParser();
  const dom = parser.parseFromString(data, 'application/xml');
  const error = dom.querySelector('parsererror');
  if (error) {
    watchState.form.feedbackValue = i18next.t('danger');
  }
  return dom;
};

export default (url, watchState, elements, i18next) => getData(url)
  .then((data) => {
    const dom = parse(data, watchState, i18next);
    watchState.form.valid = true;
    watchState.form.urls.push({ url, ...getFeed(dom) });
    watchState.form.postsItems = getPosts(dom);
    renderFeeds(elements, watchState);
    renderPosts(elements, watchState);
  })
  .catch((error) => {
    throw error;
  });
