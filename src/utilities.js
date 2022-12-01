import axios from 'axios';
import uniqueId from 'lodash/uniqueId.js';
import _ from 'lodash';

class ParsingError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ParsingError';
  }
}

const getData = (url) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
  .then((response) => response.data.contents);

const parse = (data, url) => {
  const parser = new DOMParser();
  const dom = parser.parseFromString(data, 'application/xml');
  const error = dom.querySelector('parsererror');
  if (error) {
    console.log(error.querySelector('div').textContent);
    throw new ParsingError('ParsingError!');
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

  return { ...feed, posts };
};

const updatePosts = (watchState) => {
  const { feedsItems, postsItems } = watchState;
  const interval = 5000;

  const promises = feedsItems.map((feed) => getData(feed.url)
    .then((data) => {
      const { posts } = parse(data, feed.url);

      const currentPosts = posts;
      const difference = _.differenceBy(currentPosts, postsItems, 'title');
      if (_.isEmpty(difference)) {
        return;
      }
      watchState.postsItems.unshift(...difference);
    })
    .catch((e) => console.log(e.message)));

  return Promise.all(promises)
    .finally(() => setTimeout(() => updatePosts(watchState), interval));
};

export {
  getData,
  parse,
  updatePosts,
};
