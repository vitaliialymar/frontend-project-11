import _ from 'lodash';
import onChange from 'on-change';
import * as yup from 'yup';
// import axios from 'axios';
import initView from './view.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

const validate = (fields, urls) => {
  const schema = yup.object({
    url: yup.string().url().oneOf(urls),
  });
  try {
    schema.validateSync(fields, { abortEarly: false });
    return {};
  } catch (e) {
    return e;
  }
};

const app = () => {
  const state = {
    form: {
      fields: {
        url: '',
        urls: [],
      },
      processState: '',
      valid: true,
      errors: {},
    },
  };

  const elements = {
    input: document.getElementById('url-input'),
    submit: document.querySelector('button'),
    form: document.querySelector('form'),
  };

  const watchState = onChange(state, initView(elements));

  elements.input.addEventListener('input', (e) => {
    e.preventDefault();
    watchState.form.processState = 'filling';
    const { value } = e.target;
    console.log(value);
    watchState.form.fields.url = value.trim();
  });

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchState.form.fields.urls.push(watchState.form.fields.url);
    const error = validate(watchState.form.fields, watchState.form.fields.urls);
    console.log(error);
    console.log(watchState);
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
