import axios from 'axios';
import uniqueId from 'lodash/uniqueId.js';
import { renderFeeds, renderPosts } from './view.js';

const getData = (url) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
  .then((response) => response.data.contents)
  .catch((error) => {
    throw error;
  });

const getFeed = (dom, watchState, url) => {
  const title = dom.querySelector('title').textContent;
  const description = dom.querySelector('description').textContent;
  watchState.form.urls.push({ url, title, description });
};

const getPosts = (dom, watchState) => {
  const items = dom.querySelectorAll('item');
  items.forEach((item) => {
    const title = item.querySelector('title').textContent;
    const link = item.querySelector('link').textContent;
    watchState.form.postsItems.push({ id: uniqueId(), title, link });
  });
};

const parse = (data, watchState, i18next) => {
  const parser = new DOMParser();
  const dom = parser.parseFromString(data, 'application/xml');
  const error = dom.querySelector('parsererror');
  if (error) {
    watchState.form.feedbackValue = i18next.t('danger');
    watchState.form.valid = false;
    throw new Error('Error!');
  }
  return dom;
};

export default (url, watchState, elements, i18next) => getData(url)
  .then((data) => {
    const dom = parse(data, watchState, i18next);
    watchState.form.valid = true;
    getFeed(dom, watchState, url);
    getPosts(dom, watchState);
    renderFeeds(elements, watchState);
    renderPosts(elements, watchState);
  })
  .catch((error) => {
    throw error;
  });
