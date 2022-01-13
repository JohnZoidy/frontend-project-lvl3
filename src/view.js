const inputField = document.getElementById('url-input');
const mainButton = document.querySelector('[type="submit"]');
const errorLabel = document.querySelector('.feedback');

const watchers = (path, value) => {
  if (path === 'rssForm.state') {
    if (value === 'invalid') {
      inputField.classList.add('is-invalid');
      mainButton.removeAttribute('disabled');
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
      errorLabel.textContent = 'RSS succesfully loaded'; // checkout later!!!
    }
    if (value === 'getError') {
      // show get err
    }
    if (value === 'load') {
      inputField.focus();
    }
  }
  if (path === 'rssForm.data.currentRssData') {
    // show window and add text in feed
  }
  if (path === 'rssForm.feedback') {
    errorLabel.classList.add('text-danger');
    errorLabel.textContent = value;
  }
};

export default watchers;
