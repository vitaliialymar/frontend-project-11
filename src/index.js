import onChange from 'on-change';
import * as yup from 'yup';
import i18next from 'i18next';
import resources from './locales/ru.js';
// import axios from 'axios';
import handleProcessState from './view.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

const validate = (fields, urls) => {
  yup.setLocale({
    mixed: {
      notOneOf: i18next.t('alreadyAdded'),
    },
    string: {
      url: i18next.t('danger'),
    },
  });

  const schema = yup.object({
    url: yup.string().url()
      .notOneOf(urls),
  });
  return schema.validate(fields);
};

const app = () => {
  const state = {
    form: {
      fields: {
        url: '',
      },
      urls: [],
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
      const promise = validate(watchState.form.fields, watchState.form.urls);
      promise
        .then(() => {
          watchState.form.feedbackValue = i18next.t('success');
          watchState.form.urls.push(watchState.form.fields.url);
          watchState.form.valid = true;
          watchState.form.processState = 'sending';
        })
        .catch((error) => {
          watchState.form.feedbackValue = error.message;
          watchState.form.valid = false;
          watchState.form.processState = 'filling';
          if (error.message !== i18next.t('danger')) {
            watchState.form.urls.push(watchState.form.fields.url);
          }
        });
      return promise;
    });
  });
};

app();
