const makeAnswerHandler = (elements, answer) => {
  const { feedback, input } = elements;
  switch (answer) {
    case false:
      feedback.classList.remove('text-success');
      feedback.classList.add('text-danger');
      input.classList.add('is-invalid');
      feedback.textContent = 'Ресурс не содержит валидный RSS';
      break;

    case true:
      feedback.classList.remove('text-danger');
      feedback.classList.add('text-success');
      input.classList.remove('is-invalid');
      feedback.textContent = 'RSS успешно загружен';
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

const initView = (elements) => (path, value) => {
  switch (path) {
    case 'form.processState':
      handleProcessState(elements, value);
      break;

    case 'form.valid':
      makeAnswerHandler(elements, value);
      break;

    default:
      break;
  }
};

export default initView;
