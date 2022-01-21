import i18n from 'i18next';
import onChange from 'on-change';
import { string, setLocale } from 'yup';
import axios from 'axios';
import watchers from './view.js';
import resources from './locales/ru.js';
import { parseRssChannel, getFeedData, getPostsData } from './parser.js';

const app = () => {
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
    listen: true,
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

  const proxifyURL = (urlIn) => `https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(urlIn)}&disableCache=true`;
  const watchedState = onChange(globalState, watchers);
  const addPosts = (channel) => {
    const posts = getPostsData(channel, globalState.linkList);
    globalState.linkList.push(...posts.addedLinkList);
    globalState.postListStore.push(...posts.addedPostList); // important!
    watchedState.postList = posts.addedPostList; // important!
  };
  const listenFeed = (urlArray) => {
    urlArray.forEach((url) => {
      axios.get(proxifyURL(url)).then((response) => {
        const channel = parseRssChannel(response);
        addPosts(channel);
      }).catch((err) => {
        throw new Error(err);
      });
    });
    setTimeout(() => listenFeed(urlArray), 5000);
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const urlSchema = string().required().url().notOneOf(globalState.addedUrls);
    globalState.rssForm.currentUrl = inputField.value.trim();
    urlSchema.validate(globalState.rssForm.currentUrl).then((result) => {
      watchedState.rssForm.state = 'valid';
      axios.get(proxifyURL(result)).then((response) => {
        try {
          const channel = parseRssChannel(response);
          watchedState.feed = getFeedData(channel);
          addPosts(channel);
          globalState.addedUrls.push(globalState.rssForm.currentUrl);
          watchedState.rssForm.feedback = currentInstance.t('downloadSuccess');
          watchedState.rssForm.state = 'success';
          if (globalState.listen) {
            globalState.listen = false;
            listenFeed(globalState.addedUrls);
          }
        } catch (err) {
          console.log(err);
          watchedState.rssForm.feedback = currentInstance.t('parseError');
          watchedState.rssForm.state = 'invalid';
        }
      }).catch((err) => {
        watchedState.rssForm.feedback = currentInstance.t('downloadError');
        watchedState.rssForm.state = 'invalid';
        console.log(err);
      });
    }).catch((errorObj) => {
      const errorText = errorObj.errors[0];
      watchedState.rssForm.feedback = errorText;
      watchedState.rssForm.state = 'invalid';
    });
  });

  document.addEventListener('load', () => {
    watchedState.rssForm.state = 'load';
  });

  postListElement.addEventListener('click', (e) => {
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

app();
