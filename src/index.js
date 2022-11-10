import _ from 'lodash';
import onChange from 'on-change';
import * as yup from 'yup';
import i18next from 'i18next';
import resources from './locales/ru.js';
// import axios from 'axios';
import initView from './view.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

const validate = (fields, urls) => {
  const schema = yup.object({
    url: yup.string().url().notOneOf(urls),
  });
  try {
    schema.validateSync(fields, { abortEarly: false });
    return {};
  } catch (e) {
    return e;
  }
};

const app = () => {
  const elements = {
    input: document.getElementById('url-input'),
    submit: document.querySelector('button'),
    form: document.querySelector('form'),
    feedback: document.querySelector('.feedback'),
  };

  i18next.init({
    lng: 'ru',
    debug: true,
    resources,
  });

  const state = {
    lng: 'ru',
    form: {
      fields: {
        url: '',
      },
      urls: [],
      processState: '',
      valid: true,
      errors: {},
    },
  };

  const watchState = onChange(state, initView(elements, i18next));

  elements.input.addEventListener('input', (e) => {
    e.preventDefault();
    watchState.form.processState = 'filling';
    const { value } = e.target;
    watchState.form.fields.url = value.trim();
  });

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const error = validate(watchState.form.fields, watchState.form.urls);
    // console.log(error);
    // console.log(watchState);
    watchState.form.urls.push(watchState.form.fields.url);
    watchState.form.errors = { error };

    if (!_.isEmpty(watchState.form.errors.error)) {
      watchState.form.valid = false;
    } else {
      watchState.form.valid = true;
      watchState.form.processState = 'sending';
    }
  });
};

app();
