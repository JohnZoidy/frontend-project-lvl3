const inputField = document.getElementById('url-input');
const mainButton = document.querySelector('[type="submit"]');
const errorLabel = document.querySelector('.feedback');

const watchers = (path, value) => {
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
  if (path === 'feedlist') {
    console.log(value);
  }
  if (path === 'rssForm.feedback') {
    errorLabel.textContent = value;
  }
};

export default watchers;
