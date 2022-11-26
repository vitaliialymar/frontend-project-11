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

const updatePosts = (url, watchState) => {
  const { postsItems } = watchState.form;

  return getData(url)
    .then((data) => {
      const { posts } = parse(data, url);
      console.log('1');

      const currentPosts = posts;
      const difference = _.differenceBy(currentPosts, postsItems, 'title');
      if (_.isEmpty(difference)) {
        return;
      }
      watchState.form.postsItems.unshift(...difference);
    })
    .catch((e) => console.log(e.message))
    .finally(() => setTimeout(() => updatePosts(url, watchState), 5000));
};

export {
  getData,
  parse,
  updatePosts,
};
