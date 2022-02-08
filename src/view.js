import isEmpty from 'lodash/isEmpty.js';

const watchers = (path, value, previousValue) => {
  const inputField = document.getElementById('url-input');
  const mainButton = document.querySelector('[type="submit"]');
  const errorLabel = document.querySelector('.feedback');
  const feedsList = document.querySelector('.col-lg-4');
  const postList = document.querySelector('.col-lg-8');
  const activeModal = document.getElementById('modal');
  if (path === 'rssForm.process') {
    if (value === 'invalid') {
      mainButton.removeAttribute('disabled');
      inputField.removeAttribute('readonly');
      inputField.classList.add('is-invalid');
      errorLabel.classList.add('text-danger');
      mainButton.removeAttribute('disabled');
      errorLabel.classList.remove('text-success');
    }
    if (value === 'loading') {
      mainButton.setAttribute('disabled', '');
      inputField.setAttribute('readonly', true);
      inputField.classList.remove('is-invalid');
    }
    if (value === 'success') {
      inputField.classList.remove('is-invalid');
      mainButton.removeAttribute('disabled');
      inputField.removeAttribute('readonly');
      inputField.value = '';
      inputField.focus();
      errorLabel.classList.remove('text-danger');
      errorLabel.classList.add('text-success');
    }
  }
  if (path === 'stateUI.feed' && isEmpty(previousValue)) {
    feedsList.innerHTML = `<h4 class="d-flex justify-content-between align-items-center mb-3">Фиды</h4>
    <ul class="list-group mb-3"></ul>`;
    postList.innerHTML = `<h4 class="mb-3">Посты</h4><div class="row g-3">
    <ul class="list-group border-0 rounded-0"></ul></div>`;
  }
  if (path === 'stateUI.feed' && !isEmpty(value)) {
    const newFeed = document.createElement('li');
    newFeed.classList.add('list-group-item', 'justify-content-between', 'lh-sm');
    newFeed.innerHTML = '<h6 class="my-0"></h6><small class="text-muted"></small>';
    newFeed.firstChild.textContent = value.title;
    newFeed.lastChild.textContent = value.description;
    feedsList.lastChild.prepend(newFeed);
  }
  if (path === 'stateUI.newPost') {
    const newPost = document.createElement('li');
    newPost.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    newPost.innerHTML = `<a class="fw-bold" target="_blank" rel="noopener noreferrer"></a>
    <button type="button" class="btn btn-outline-primary btn-sm" data-bs-toggle="modal" data-bs-target="#modal">Просмотр</button>`;
    newPost.firstChild.setAttribute('href', value.link);
    newPost.firstChild.setAttribute('data-id', value.id);
    newPost.firstChild.textContent = value.postTitle;
    newPost.lastChild.setAttribute('data-id', value.id);
    postList.querySelector('ul').append(newPost);
  }
  if (path === 'rssForm.feedback') {
    errorLabel.textContent = value;
  }
  if (path === 'stateUI.activeID') {
    const activeHref = postList.querySelector(`a[data-id="${value}"]`);
    activeHref.classList.remove('fw-bold');
    activeHref.classList.add('link-secondary', 'fw-normal');
  }
  if (path === 'stateUI.activeModal') {
    activeModal.querySelector('.modal-title').textContent = value.postName;
    activeModal.querySelector('.modal-body').textContent = value.postDescription;
    activeModal.querySelector('a').setAttribute('href', value.link);
  }
};

export default watchers;
