import onChange from 'on-change';

const handleProcessState = (value, elements) => {
  switch (value) {
    case 'initial': {
      elements.input.disabled = false;
      elements.submit.disabled = false;
      break;
    }
    case 'sending': {
      elements.input.disabled = true;
      elements.submit.disabled = true;
      break;
    }
    case 'success': {
      elements.form.reset();
      elements.form.focus();
      break;
    }
    case 'error': {
      elements.input.disabled = false;
      elements.submit.disabled = false;
      break;
    }
    default:
      break;
  }
};

const handleValidForm = (elements, state, i18next) => {
  const { feedback, input } = elements;
  const { valid, feedbackValue } = state.form;
  switch (valid) {
    case false:
      feedback.classList.replace('text-success', 'text-danger');
      input.classList.add('is-invalid');
      feedback.textContent = i18next.t(feedbackValue);
      state.form.valid = null;
      break;

    case true:
      feedback.classList.replace('text-danger', 'text-success');
      input.classList.remove('is-invalid');
      feedback.textContent = i18next.t(feedbackValue);
      state.form.valid = null;
      break;

    default:
      break;
  }
};

const renderFeeds = (elements, state, i18next) => {
  const { feeds } = elements;
  const { feedsItems } = state;

  if (feedsItems.length <= 1) {
    const feedsContainer = document.createElement('div');
    feedsContainer.classList.add('card', 'border-0');

    const div = document.createElement('div');
    div.classList.add('card-body');
    const h2 = document.createElement('h2');
    h2.classList.add('card-title', 'h4');
    h2.textContent = i18next.t('feeds');
    div.prepend(h2);
    const ul = document.createElement('ul');
    ul.classList.add('list-group', 'border-0', 'rounded-0');
    feedsContainer.append(div, ul);
    feeds.append(feedsContainer);
  }

  const feedsList = feeds.querySelector('ul');
  feedsList.innerHTML = '';

  feedsItems.forEach((url) => {
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

const renderPosts = (elements, state, i18next) => {
  const { posts } = elements;
  const { postsItems } = state;

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
    button.textContent = i18next.t('button');

    li.append(link, button);
    postsList.append(li);
  });
};

const renderModal = (state) => {
  const { postsItems, modal } = state;
  const title = document.querySelector('.modal-title');
  const description = document.querySelector('.modal-body');
  const href = document.querySelector('.full-article');
  const currentPost = postsItems.find((post) => post.id === modal);
  title.textContent = currentPost.title;
  description.textContent = currentPost.description;
  href.href = currentPost.link;
};

const openPost = (state) => {
  const { openPosts } = state;
  openPosts.forEach((id) => {
    const element = document.querySelector(`a[data-id="${id}"]`);
    element.classList.replace('fw-bold', 'fw-normal');
  });
};

const watch = (elements, state, i18next) => onChange(state, (path, value) => {
  switch (path) {
    case 'form.valid': {
      handleValidForm(elements, state, i18next);
      break;
    }
    case 'feedsItems': {
      renderFeeds(elements, state, i18next);
      break;
    }
    case 'postsItems': {
      renderPosts(elements, state, i18next);
      openPost(state);
      break;
    }
    case 'modal': {
      renderModal(state);
      break;
    }
    case 'openPosts': {
      openPost(state);
      break;
    }
    case 'form.processState': {
      handleProcessState(value, elements);
      break;
    }
    default:
      break;
  }
});

export default watch;
