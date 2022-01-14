import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/style.css';
import i18n from 'i18next';
import onChange from 'on-change';
import { string, setLocale } from 'yup';
import axios from 'axios';
import watchers from './view.js';
import resources from './locales/ru.js';
import parse from './parser.js';

const currentInstance = i18n.createInstance();
currentInstance
  .init({
    lng: 'ru',
    debug: true,
    resources,
  })
  .then(() => {
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
      addedUrls: [],
    },
    feedback: '',
  },
  feedlist: [],
  xml: '',
};

const form = document.querySelector('.rss-form');
const inputField = document.getElementById('url-input');
const proxifyURL = (urlIn) => `https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${urlIn}`;

const watchedState = onChange(globalState, watchers);

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const urlSchema = string().required().url();
  globalState.rssForm.feedback = '';
  globalState.rssForm.data.currentUrl = inputField.value;
  watchedState.rssForm.state = 'checking';
  urlSchema
    .validate(globalState.rssForm.data.currentUrl)
    .then((result) => {
      if (globalState.rssForm.data.addedUrls.includes(result)) {
        watchedState.rssForm.feedback = currentInstance.t('duplicate');
        watchedState.rssForm.state = 'invalid';
      } else {
        watchedState.rssForm.state = 'valid';
        axios.get(proxifyURL(result)).then((response) => {
          try {
            const domParser = new DOMParser();
            globalState.xml = domParser.parseFromString(response.data.contents, 'application/xml');
            watchedState.feedlist.push(parse(globalState.xml));
            globalState.rssForm.data.addedUrls.push(globalState.rssForm.data.currentUrl);
            watchedState.rssForm.feedback = currentInstance.t('downloadSuccess');
            watchedState.rssForm.state = 'success';
          } catch (eer) {
            console.log(eer);
            watchedState.rssForm.feedback = currentInstance.t('parseError');
            watchedState.rssForm.state = 'invalid';
          }
        }).catch((err) => {
          watchedState.rssForm.feedback = currentInstance.t('downloadError');
          watchedState.rssForm.state = 'invalid';
          console.log(err);
        });
      }
    })
    .catch((errorObj) => {
      const [errorText] = errorObj.errors;
      watchedState.rssForm.feedback = errorText;
      watchedState.rssForm.state = 'invalid';
    });
  document.addEventListener('load', () => {
    watchedState.rssForm.state = 'load';
  });
});
