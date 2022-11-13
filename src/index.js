import onChange from 'on-change';
import i18next from 'i18next';
import resources from './locales/ru.js';
import getRssData from './getRss.js';
import handleProcessState from './view.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

const app = () => {
  const state = {
    form: {
      fields: {
        url: '',
      },
      urls: [],
      postsItems: [],
      processState: '',
      valid: true,
      feedbackValue: '',
    },
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
  }).then(() => {
    const watchState = onChange(state, (path) => {
      if (path === 'form.valid') {
        handleProcessState(elements, state);
      }
    });

    elements.input.addEventListener('input', (e) => {
      e.preventDefault();
      watchState.form.processState = 'filling';
      const { value } = e.target;
      watchState.form.fields.url = value.trim();
    });

    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      getRssData(watchState, i18next, elements);
    });
  });
};

app();
