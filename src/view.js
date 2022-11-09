const makeAnswerHandler = (answer) => {
  const element = document.querySelector('.feedback');
  switch (answer) {
    case false:
      element.textContent = 'Ресурс не содержит валидный RSS';
      break;

    case true:
      element.classList.remove('text-danger');
      element.classList.add('text-success');
      element.textContent = 'RSS успешно загружен';
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
      makeAnswerHandler(value);
      break;

    default:
      break;
  }
};

export default initView;
