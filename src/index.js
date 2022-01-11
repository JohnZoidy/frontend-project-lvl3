import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/style.css';
import i18n from 'i18next';
import onChange from 'on-change';
import { string, setLocale } from 'yup';
import watchers from './view.js';
import resources from './locales/ru.js';

const currentInstance = i18n.createInstance();
currentInstance.init({
  lng: 'ru',
  debug: true,
  resources,
}).then(() => {
  setLocale({
    mixed: {
      default: currentInstance.t('default'),
    },
    string: {
      url: currentInstance.t('invalidURL'),
    },
  });
});

const globalState = {
  rssForm: {
    state: '',
    data: {
      currentUrl: '',
      currentRssData: '',
      addedUrls: [],
    },
    error: '',
  },
};

const form = document.querySelector('.rss-form');
const inputField = document.getElementById('url-input');

const watchedState = onChange(globalState, watchers);

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const urlSchema = string().required().url();
  watchedState.rssForm.error = '';
  globalState.rssForm.data.currentUrl = inputField.value;
  watchedState.rssForm.state = 'checking';
  urlSchema.validate(globalState.rssForm.data.currentUrl)
    .then((result) => {
      if (globalState.rssForm.data.addedUrls.includes(result)) { // check duplicate
        watchedState.rssForm.error = 'Данный URL уже добавлен в список лент';
        watchedState.rssForm.state = 'invalid';
        console.log(globalState);
      } else {
        globalState.rssForm.data.addedUrls.push(result);
        watchedState.rssForm.state = 'valid';
        // getData
        console.log(globalState);
      }
    })
    .catch((errorObj) => {
      const [errorText] = errorObj.errors;
      watchedState.rssForm.error = errorText; // returns array
      watchedState.rssForm.state = 'invalid';
      console.log(globalState);
    });
  /*
      const response = getData(globalState.rssForm.data.currentUrl);
      response.then((answer) => {
        if (answer.status === 200) {
          watchedState.rssForm.data.currentRssData = answer.data; // get data and show window
          watchedState.rssForm.state = 'success'; // clear field and focus
        } else {
          watchedState.rssForm.state = 'getError';
        }
      });
    }
  }
  */
  document.addEventListener('load', () => {
    watchedState.rssForm.state = 'load';
  });
});
