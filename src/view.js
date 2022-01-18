import isEmpty from 'lodash/isEmpty.js';

const inputField = document.getElementById('url-input');
const mainButton = document.querySelector('[type="submit"]');
const errorLabel = document.querySelector('.feedback');
const feedsList = document.querySelector('.col-lg-4');
const postList = document.querySelector('.col-lg-8');

const watchers = (path, value, previousValue) => {
  if (path === 'rssForm.state') {
    if (value === 'invalid') {
      mainButton.removeAttribute('disabled');
      inputField.classList.add('is-invalid');
      errorLabel.classList.add('text-danger');
      mainButton.removeAttribute('disabled');
      errorLabel.classList.remove('text-success');
    }
    if (value === 'valid') {
      mainButton.setAttribute('disabled', '');
      inputField.classList.remove('is-invalid');
    }
    if (value === 'success') {
      inputField.classList.remove('is-invalid');
      mainButton.removeAttribute('disabled');
      inputField.value = '';
      inputField.focus();
      errorLabel.classList.remove('text-danger');
      errorLabel.classList.add('text-success');
    }
    if (value === 'load') {
      inputField.focus();
    }
  }
  if (path === 'feed' && isEmpty(previousValue)) {
    feedsList.innerHTML = `<h4 class="d-flex justify-content-between align-items-center mb-3">Фиды</h4>
    <ul class="list-group mb-3"></ul>`;
    postList.innerHTML = `<h4 class="mb-3">Посты</h4><div class="row g-3">
    <ul class="list-group border-0 rounded-0"></ul></div>`;
  }
  if (path === 'feed' && !isEmpty(value)) {
    const newFeed = document.createElement('li');
    newFeed.classList.add('list-group-item', 'justify-content-between', 'lh-sm');
    newFeed.innerHTML = `<h6 class="my-0">${value.name}</h6><small class="text-muted">${value.description}</small>`;
    feedsList.lastChild.prepend(newFeed);
  }
  if (path === 'postList') {
    value.forEach((feed) => {
      const newPost = document.createElement('li');
      newPost.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
      newPost.innerHTML = `<a href="${feed.link}" class="fw-bold" data-id="${feed.id}" target="_blank" rel="noopener noreferrer">${feed.feedName}</a>
      <button type="button" class="btn btn-outline-primary btn-sm" data-id="${feed.id}" data-bs-toggle="modal" data-bs-target="#modal">Просмотр</button>`;
      postList.querySelector('ul').prepend(newPost);
    });
  }
  if (path === 'rssForm.feedback') {
    errorLabel.textContent = value;
  }
};

export default watchers;
