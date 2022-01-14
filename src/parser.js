import uniqueId from 'lodash/uniqueId.js';

const parse = (xmldata) => {
  try {
    const channel = xmldata.activeElement.querySelector('channel');
    const feed = {
      id: uniqueId('fd'),
      name: channel.querySelector('title').textContent,
      description: channel.querySelector('description').textContent,
      feedList: [],
    };
    channel.querySelectorAll('item').forEach((item) => {
      const feedElement = {
        id: uniqueId(feed.id),
        feedName: item.querySelector('title').textContent,
        feedDescription: item.querySelector('description').textContent,
        link: item.querySelector('link').textContent,
      };
      feed.feedList.push(feedElement);
    });
    return feed;
  } catch (e) {
    console.log(e);
    throw new Error('XML structure reading error!');
  }
};

export default parse;
