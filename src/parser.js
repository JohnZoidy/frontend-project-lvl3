import uniqueId from 'lodash/uniqueId.js';

export const parseRssChannel = (response) => {
  try {
    const domParser = new DOMParser();
    const xmldata = domParser.parseFromString(response.data.contents, 'application/xml');
    const channel = xmldata.querySelector('channel');
    return channel;
  } catch (e) {
    console.log(e);
    throw new Error('XML structure reading error!');
  }
};

export const getFeedData = (channel) => {
  const descriptionNode = channel.querySelector('description');
  const description = descriptionNode.parentNode === channel ? descriptionNode.textContent : '';
  const feed = {
    id: uniqueId('fd_'),
    name: channel.querySelector('title').textContent,
    description,
  };
  return feed;
};

export const getPostsData = (channel, linkList) => {
  const result = {
    addedPostList: [],
    addedLinkList: [],
  };
  channel.querySelectorAll('item').forEach((item) => {
    const currentLink = item.querySelector('link').textContent;
    if (!linkList.includes(currentLink)) {
      result.addedLinkList.push(currentLink);
      const postElement = {
        id: uniqueId(),
        postName: item.querySelector('title').textContent,
        postDescription: item.querySelector('description').textContent,
        link: currentLink,
      };
      result.addedPostList.push(postElement);
    }
  });
  return result;
};
