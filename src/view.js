const makeAnswerHandler = (elements, answer, i18next) => {
  const { feedback, input } = elements;
  switch (answer) {
    case false:
      feedback.classList.remove('text-success');
      feedback.classList.add('text-danger');
      input.classList.add('is-invalid');
      feedback.textContent = i18next.t('errors.danger');
      break;

    case true:
      feedback.classList.remove('text-danger');
      feedback.classList.add('text-success');
      input.classList.remove('is-invalid');
      feedback.textContent = i18next.t('success');
      break;

    default:
      break;
  }
};

const handleProcessState = (elements, process) => {
  switch (process) {
    case 'filling':
      elements.input.disabled = false;
      elements.submit.disabled = false;
      break;

    case 'sending':
      elements.input.disabled = false;
      elements.submit.disabled = false;
      elements.form.reset();
      elements.form.focus();
      break;

    default:
      throw new Error(`Unknown process ${process}`);
  }
};

const initView = (elements, i18next) => (path, value) => {
  switch (path) {
    case 'form.processState':
      handleProcessState(elements, value);
      break;

    case 'form.valid':
      makeAnswerHandler(elements, value, i18next);
      break;

    default:
      break;
  }
};

export default initView;
