import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/style.css';
import i18n from 'i18next';
import onChange from 'on-change';
import { string, setLocale } from 'yup';
import axios from 'axios';
import watchers from './view.js';
import resources from './locales/ru.js';
import { parseFeed, parseAndCompare } from './parser.js';

const currentInstance = i18n.createInstance();
currentInstance
  .init({
    lng: 'ru',
    resources,
  })
  .then(() => {
    setLocale({
      mixed: {
        notOneOf: currentInstance.t('duplicate'),
      },
      string: {
        url: currentInstance.t('invalidURL'),
      },
    });
  });

const globalState = {
  rssForm: {
    state: '',
    currentUrl: '',
    feedback: '',
  },
  addedUrls: [],
  feed: {},
  postList: [],
  linkList: [],
};

const form = document.querySelector('.rss-form');
const inputField = document.getElementById('url-input');

const proxifyURL = (urlIn) => `https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(urlIn)}&disableCache=true`;

const watchedState = onChange(globalState, watchers);
const domParser = new DOMParser();

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const urlSchema = string().required().url().notOneOf(globalState.addedUrls);
  globalState.rssForm.feedback = '';
  globalState.rssForm.currentUrl = inputField.value.trim();
  watchedState.rssForm.state = 'checking';
  urlSchema
    .validate(globalState.rssForm.currentUrl)
    .then((result) => {
      watchedState.rssForm.state = 'valid';
      axios.get(proxifyURL(result)).then((response) => {
        try {
          const xml = domParser.parseFromString(response.data.contents, 'application/xml');
          watchedState.feed = parseFeed(xml);
          watchedState.postList.push(...globalState.feed.postList); // important!
          globalState.linkList.push(...globalState.feed.linkList);
          globalState.addedUrls.push(globalState.rssForm.currentUrl);
          watchedState.rssForm.feedback = currentInstance.t('downloadSuccess');
          watchedState.rssForm.state = 'success';
          console.log(globalState);
        } catch (err) {
          console.log(err);
          watchedState.rssForm.feedback = currentInstance.t('parseError');
          watchedState.rssForm.state = 'invalid';
        }
      })
        .catch((err) => {
          watchedState.rssForm.feedback = currentInstance.t('downloadError');
          watchedState.rssForm.state = 'invalid';
          console.log(err);
        });
    })
    .catch((errorObj) => {
      const [errorText] = errorObj.errors;
      watchedState.rssForm.feedback = errorText;
      watchedState.rssForm.state = 'invalid';
    });
});
window.addEventListener('load', () => {
  const whatchFeed = (urlArray) => {
    if (urlArray.length !== 0) {
      urlArray.forEach((url) => {
        axios.get(proxifyURL(url)).then((response) => {
          const xmlResponse = domParser.parseFromString(response.data.contents, 'application/xml');
          const compareResult = parseAndCompare(xmlResponse, globalState.linkList);
          globalState.linkList.push(...compareResult.addedLinkList);
          watchedState.postList = compareResult.addedPostList; // important!
        })
          .catch((err) => {
            throw new Error(err);
          });
      });
      setTimeout(() => whatchFeed(urlArray), 5000);
    } else {
      setTimeout(() => whatchFeed(urlArray), 5000);
    }
  };
  watchedState.rssForm.state = 'load';
  whatchFeed(globalState.addedUrls);
});
