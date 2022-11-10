const handleProcessState = (elements, state) => {
  const { feedback, input } = elements;
  const { valid, feedbackValue } = state.form;
  switch (valid) {
    case false:
      feedback.classList.remove('text-success');
      feedback.classList.add('text-danger');
      input.classList.add('is-invalid');
      feedback.textContent = feedbackValue;
      elements.input.disabled = false;
      elements.submit.disabled = false;
      break;

    case true:
      feedback.classList.remove('text-danger');
      feedback.classList.add('text-success');
      input.classList.remove('is-invalid');
      feedback.textContent = feedbackValue;
      elements.input.disabled = false;
      elements.submit.disabled = false;
      elements.form.reset();
      elements.form.focus();
      break;

    default:
      break;
  }
};

export default handleProcessState;
