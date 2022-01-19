import i18n from 'i18next';
import onChange from 'on-change';
import { string, setLocale } from 'yup';
import axios from 'axios';
import watchers from './view.js';
import resources from './locales/ru.js';
import { parseFeed, parseAndCompare } from './parser.js';

const app = () => {
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
    postListStore: [],
    linkList: [],
    activeID: '',
    activeModal: {},
  };

  const form = document.querySelector('.rss-form');
  const inputField = document.getElementById('url-input');

  const proxifyURL = (urlIn) => `https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(urlIn)}&disableCache=true`;

  const watchedState = onChange(globalState, watchers);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const urlSchema = string().required().url().notOneOf(globalState.addedUrls);
    globalState.rssForm.feedback = '';
    globalState.rssForm.currentUrl = inputField.value.trim();
    // globalState.rssForm.state = 'checking';
    urlSchema
      .validate(globalState.rssForm.currentUrl)
      .then((result) => {
        watchedState.rssForm.state = 'valid';
        axios
          .get(proxifyURL(result))
          .then((response) => {
            try {
              watchedState.feed = parseFeed(response);
              globalState.postListStore.push(...globalState.feed.postList);
              watchedState.postList = globalState.feed.postList;
              globalState.linkList.push(...globalState.feed.linkList);
              globalState.addedUrls.push(globalState.rssForm.currentUrl);
              watchedState.rssForm.feedback = currentInstance.t('downloadSuccess');
              watchedState.rssForm.state = 'success';
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
          axios
            .get(proxifyURL(url))
            .then((response) => {
              const compareResult = parseAndCompare(response, globalState.linkList);
              globalState.linkList.push(...compareResult.addedLinkList);
              globalState.postListStore.push(...compareResult.addedPostList); // important!
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
  window.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && e.target.dataset.id) {
      watchedState.activeID = e.target.dataset.id;
    }
    if (e.target.tagName === 'BUTTON' && e.target.dataset.id) {
      watchedState.activeID = e.target.dataset.id;
      const [showPost] = globalState.postListStore
        .filter((post) => post.id === e.target.dataset.id);
      watchedState.activeModal = showPost;
    }
  });
};

export default app;
