// import { Collapse, Toast, Popover } from 'bootstrap';
// import bootstrap from 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import onChange from 'on-change';
import { string } from 'yup';
import watchers from './view.js';

const urlSchema = string().required().url();

const globalState = {
  rssForm: {
    state: 'ready',
    data: {
      currentUrl: '',
      currentRssData: '',
      addedUrls: [],
    },
    error: '',
  },
};

const form = document.querySelector('form');
const inputField = document.getElementById('url-input');

const watchedState = onChange(globalState, watchers);

form.addEventListener('submit', (e) => {
  e.preventDefault();
  watchedState.rssForm.state = 'checking';
  urlSchema.validate(inputField.value)
    .then((result) => {
      globalState.rssForm.data.currentUrl = result;
      if (globalState.rssForm.data.addedUrls.includes(result)) { // check duplicate
        globalState.rssForm.error = 'duplicate';
        watchedState.rssForm.state = 'invalid';
        console.log(globalState);
      } else {
        globalState.rssForm.data.addedUrls.push(result);
        watchedState.rssForm.state = 'valid';
        // getData
        console.log(globalState);
      }
    })
    .catch((errorText) => {
      globalState.rssForm.error = errorText.errors; // returns array
      watchedState.rssForm.state = 'invalid';
      console.log(globalState);
    });
  /*
      const response = getData(globalState.rssForm.data.currentUrl);
      response.then((answer) => {
        if (answer.status === 200) {
          watchedState.rssForm.data.currentRssData = answer.data; // get data and show window
          watchedState.rssForm.state = 'ready'; // clear field and focus
        } else {
          watchedState.rssForm.state = 'getError';
        }
      });
    }
  }
  */
});
