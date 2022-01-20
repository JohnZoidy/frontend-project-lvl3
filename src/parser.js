import uniqueId from 'lodash/uniqueId.js';

export const parseFeed = (responseData) => {
  try {
    const domParser = new DOMParser();
    const xmldata = domParser.parseFromString(responseData.data.contents, 'application/xml');
    const channel = xmldata.querySelector('channel');
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
      const postElement = {
        id: uniqueId(),
        postName: item.querySelector('title').textContent,
        postDescription: item.querySelector('description').textContent,
        link: item.querySelector('link').textContent,
      };
      feed.postList.push(postElement);
      feed.linkList.push(postElement.link);
    });
    return feed;
  } catch (e) {
    console.log(e);
    throw new Error('XML structure reading error!');
  }
};

export const parseAndCompare = (responseData, linkList) => {
  try {
    const domParser = new DOMParser();
    const xmldata = domParser.parseFromString(responseData.data.contents, 'application/xml');
    const result = {
      addedPostList: [],
      addedLinkList: [],
    };
    const channel = xmldata.querySelector('channel');
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
  } catch (e) {
    console.log(e);
    throw new Error('XML structure reading error!');
  }
};
