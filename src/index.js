import i18next from 'i18next';
import resources from './locales/ru.js';
import getRssData from './getRss.js';
import watch from './view.js';
import { updatePosts, interval } from './utilities.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

const app = () => {
  const state = {
    form: {
      fields: {
        url: '',
      },
      processState: 'initial',
      valid: null,
      feedbackValue: '',
    },
    feedsItems: [],
    postsItems: [],
    openPosts: [],
    modal: null,
  };

  const elements = {
    input: document.getElementById('url-input'),
    submit: document.querySelector('button'),
    form: document.querySelector('form'),
    feedback: document.querySelector('.feedback'),
    feeds: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
  };

  i18next.init({
    lng: 'ru',
    debug: false,
    resources,
  })
    .then(() => {
      const watchState = watch(elements, state, i18next);

      elements.input.addEventListener('input', (e) => {
        e.preventDefault();
        const { value } = e.target;
        watchState.form.fields.url = value.trim();
      });

      elements.form.addEventListener('submit', (e) => {
        watchState.form.processState = 'sending';
        e.preventDefault();
        getRssData(watchState);
      });

      elements.posts.addEventListener('click', (e) => {
        const { id } = e.target.dataset;
        if (id !== undefined) {
          watchState.modal = id;
          watchState.openPosts.push(id);
        }
      });

      setTimeout(() => updatePosts(watchState), interval);
    });
};

app();
