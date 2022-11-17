import axios from 'axios';
import uniqueId from 'lodash/uniqueId.js';
import isEmpty from 'lodash/isEmpty';
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

const parse = (data) => {
  const parser = new DOMParser();
  const dom = parser.parseFromString(data, 'application/xml');
  const error = dom.querySelector('parsererror');
  if (error) {
    throw new Error('Error!');
  }
  return dom;
};

const updatePosts = (watchState, elements, i18next) => {
  const { urls, postsItems } = watchState.form;
  const currentPosts = urls.map((item) => getData(item.url));

  const promise = Promise.all(currentPosts)
    .then((datas) => {
      datas.forEach((data) => {
        const dom = parse(data);
        const oldPostsTitles = postsItems.map((post) => post.title);
        const current = getPosts(dom);
        const currentPostsTitles = current.map((post) => post.title);
        const difference = currentPostsTitles.filter((title) => !oldPostsTitles.includes(title));
        if (isEmpty(difference)) return;
        const newPosts = difference.map((title) => current.find((post) => post.title === title));
        newPosts.forEach((post) => postsItems.unshift(post));
        renderPosts(elements, watchState);
      });
    });

  return promise.then(() => setTimeout(() => updatePosts(watchState, elements, i18next), 5000));
};

export default (url, watchState, elements, i18next) => getData(url)
  .then((data) => {
    const { postsItems } = watchState.form;
    const dom = parse(data);
    watchState.form.valid = true;
    getFeed(dom, watchState, url);
    const posts = getPosts(dom);
    posts.forEach((post) => postsItems.push(post));
    renderFeeds(elements, watchState);
    renderPosts(elements, watchState);
    updatePosts(watchState, elements, i18next);
  })
  .catch((error) => {
    throw error;
  });
