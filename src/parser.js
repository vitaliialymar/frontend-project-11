import axios from 'axios';
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

};

const parse = (data) => {
  const parser = new DOMParser();
  const dom = parser.parseFromString(data, 'application/xml');
  return dom;
};

export default (url, watchState, elements) => getData(url)
  .then((data) => {
    const dom = parse(data);
    watchState.form.urls.push({ url, ...getFeed(dom) });
    // watchState.form.postsItems.push(getPosts(dom));
    renderFeeds(elements, watchState);
    // renderPosts(elements, watchState);
  })
  .catch((error) => {
    throw error;
  });
