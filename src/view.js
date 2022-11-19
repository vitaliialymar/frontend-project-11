const handleProcessState = (elements, state) => {
  const { feedback, input } = elements;
  const { valid, feedbackValue } = state.form;
  switch (valid) {
    case false:
      feedback.classList.remove('text-success');
      feedback.classList.add('text-danger');
      input.classList.add('is-invalid');
      feedback.textContent = feedbackValue;
      state.form.valid = null;
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
      state.form.valid = null;
      elements.form.reset();
      elements.form.focus();
      break;

    default:
      break;
  }
};

export const renderFeeds = (elements, state) => {
  const { feeds } = elements;
  const { urls } = state.form;

  if (urls.length <= 1) {
    const feedsContainer = document.createElement('div');
    feedsContainer.classList.add('card', 'border-0');

    const div = document.createElement('div');
    div.classList.add('card-body');
    const h2 = document.createElement('h2');
    h2.classList.add('card-title', 'h4');
    h2.textContent = 'Фиды';
    div.prepend(h2);
    const ul = document.createElement('ul');
    ul.classList.add('list-group', 'border-0', 'rounded-0');
    feedsContainer.append(div, ul);
    feeds.append(feedsContainer);
  }

  const feedsList = feeds.querySelector('ul');
  feedsList.innerHTML = '';

  urls.forEach((url) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    const title = document.createElement('h3');
    title.classList.add('h6', 'm-0');
    title.textContent = url.title;
    const description = document.createElement('p');
    description.classList.add('m-0', 'small', 'text-black-50');
    description.textContent = url.description;
    li.append(title, description);
    feedsList.append(li);
  });
};

export const renderPosts = (elements, state) => {
  const { posts } = elements;
  const { postsItems } = state.form;

  const postsDiv = posts.querySelector('div');
  if (!postsDiv) {
    const postContainer = document.createElement('div');
    postContainer.classList.add('card', 'border-0');

    const div = document.createElement('div');
    div.classList.add('card-body');
    const h2 = document.createElement('h2');
    h2.classList.add('card-title', 'h4');
    h2.textContent = 'Посты';
    div.prepend(h2);

    const ul = document.createElement('ul');
    ul.classList.add('list-group', 'border-0', 'rounded-0');
    postContainer.append(div, ul);
    posts.append(postContainer);
  }

  const postsList = posts.querySelector('ul');
  postsList.innerHTML = '';

  postsItems.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    const link = document.createElement('a');
    link.classList.add('fw-bold');
    link.textContent = post.title;
    link.setAttribute('href', `${post.link}`);
    link.setAttribute('data-id', `${post.id}`);
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');

    const button = document.createElement('button');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.setAttribute('type', 'button');
    button.setAttribute('data-id', `${post.id}`);
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');
    button.textContent = 'Просмотр';

    li.append(link, button);
    postsList.append(li);
  });
};

export const renderModal = (state) => {
  const { postsItems, modal } = state.form;
  const title = document.querySelector('.modal-title');
  const description = document.querySelector('.modal-body');
  const href = document.querySelector('.full-article');
  const currentPost = postsItems.find((post) => post.id === modal);
  title.textContent = currentPost.title;
  description.textContent = currentPost.description;
  href.href = currentPost.link;
};

export const openPost = (id) => {
  const element = document.querySelector(`a[data-id="${id}"]`);
  element.classList.replace('fw-bold', 'fw-normal');
};

export default handleProcessState;
