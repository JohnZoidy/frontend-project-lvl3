import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import i18n from 'i18next';
import onChange from 'on-change';
import { string, setLocale } from 'yup';
import axios from 'axios';
import watchers from './view.js';
import resources from './locales/ru.js';
import parseRssChannel from './parser.js';

const app = () => {
  const globalState = {
    rssForm: {
      process: '',
      currentUrl: '',
      feedback: '',
    },
    addedFeedsUrls: [],
    postListStore: [],
    linkList: [],
    stateUI: {
      feed: {},
      newPost: {},
      activeID: '',
      activeModal: {},
    },
  };
  const currentInstance = i18n.createInstance();
  currentInstance.init({
    lng: 'ru',
    resources,
  }).then(() => {
    setLocale({
      mixed: {
        notOneOf: currentInstance.t('duplicate'),
        required: currentInstance.t('required'),
      },
      string: {
        url: currentInstance.t('invalidURL'),
      },
    });
  });

  const form = document.querySelector('.rss-form');
  const inputField = document.getElementById('url-input');
  const postListElement = document.querySelector('.col-lg-8');

  const proxifyURL = (urlIn) => {
    const result = new URL('https://hexlet-allorigins.herokuapp.com/get');
    result.searchParams.set('disableCache', 'true');
    result.searchParams.set('url', urlIn);
    return result.href;
  };

  const watchedState = onChange(globalState, watchers);
  const addPosts = (posts) => {
    globalState.linkList.push(...posts.addedLinkList);
    globalState.postListStore.push(...posts.addedPostList);
    posts.addedPostIDs.forEach((postID) => {
      [watchedState.stateUI.newPost] = globalState.postListStore
        .filter((post) => post.id === postID);
    });
  };

  const listenFeed = (urlArray) => {
    const promises = urlArray.map((url) => axios.get(proxifyURL(url)).catch((e) => console.log(e)));
    const results = Promise.all(promises);
    results.then((responses) => {
      responses.forEach((response) => {
        if (response) {
          const rssData = parseRssChannel(response, globalState.linkList);
          addPosts(rssData.posts);
        }
      });
    }).then(() => setTimeout(() => listenFeed(urlArray), 5000));
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const urlSchema = string().required().url().notOneOf(globalState.addedFeedsUrls);
    globalState.rssForm.currentUrl = inputField.value.trim();
    urlSchema.validate(globalState.rssForm.currentUrl).then((result) => {
      watchedState.rssForm.process = 'loading';
      axios.get(proxifyURL(result)).then((response) => {
        try {
          const rssData = parseRssChannel(response, globalState.linkList);
          watchedState.stateUI.feed = rssData.feed;
          addPosts(rssData.posts);
          globalState.addedFeedsUrls.push(globalState.rssForm.currentUrl);
          watchedState.rssForm.feedback = currentInstance.t('downloadSuccess');
          watchedState.rssForm.process = 'success';
        } catch (err) {
          console.log(err);
          watchedState.rssForm.feedback = currentInstance.t('parseError');
          watchedState.rssForm.process = 'invalid';
        }
      }).catch((err) => {
        watchedState.rssForm.feedback = currentInstance.t('downloadError');
        watchedState.rssForm.process = 'invalid';
        console.log(err);
      });
    }).catch((errorObj) => {
      console.log(errorObj);
      const errorText = errorObj.errors[0];
      watchedState.rssForm.feedback = errorText;
      watchedState.rssForm.process = 'invalid';
    });
  });

  document.onload = listenFeed(globalState.addedFeedsUrls);

  postListElement.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && e.target.dataset.id) {
      watchedState.stateUI.activeID = e.target.dataset.id;
    }
    if (e.target.tagName === 'BUTTON' && e.target.dataset.id) {
      watchedState.stateUI.activeID = e.target.dataset.id;
      const [showPost] = globalState.postListStore
        .filter((post) => post.id === e.target.dataset.id);
      watchedState.stateUI.activeModal = showPost;
    }
  });
};

export default app;
