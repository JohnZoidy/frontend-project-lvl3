import uniqueId from 'lodash/uniqueId.js';

export const parseFeed = (xmldata) => {
  try {
    const channel = xmldata.activeElement.querySelector('channel');
    const descriptionNode = channel.querySelector('description');
    const description = descriptionNode.parentNode === channel ? descriptionNode.textContent : '';
    const feed = {
      id: uniqueId('fd_'),
      name: channel.querySelector('title').textContent,
      description,
      postList: [],
      linkList: [],
    };
    channel.querySelectorAll('item').forEach((item) => {
      const feedElement = {
        id: uniqueId(),
        feedName: item.querySelector('title').textContent,
        feedDescription: item.querySelector('description').textContent,
        link: item.querySelector('link').textContent,
      };
      feed.postList.push(feedElement);
      feed.linkList.push(feedElement.link);
    });
    return feed;
  } catch (e) {
    console.log(e);
    throw new Error('XML structure reading error!');
  }
};

export const parseAndCompare = (xmldata, linkList) => {
  try {
    const result = {
      addedPostList: [],
      addedLinkList: [],
    };
    const channel = xmldata.activeElement.querySelector('channel');
    channel.querySelectorAll('item').forEach((item) => {
      const currentLink = item.querySelector('link').textContent;
      if (!linkList.includes(currentLink)) {
        result.addedLinkList.push(currentLink);
        const feedElement = {
          id: uniqueId(),
          feedName: item.querySelector('title').textContent,
          feedDescription: item.querySelector('description').textContent,
          link: currentLink,
        };
        result.addedPostList.push(feedElement);
      }
    });
    return result;
  } catch (e) {
    console.log(e);
    throw new Error('XML structure reading error!');
  }
};
