import uniqueId from 'lodash/uniqueId.js';

export default (response, linkList) => {
  try {
    const domParser = new DOMParser();
    const xmldata = domParser.parseFromString(response.data.contents, 'application/xml');
    const channel = xmldata.querySelector('channel');
    const descriptionNode = channel.querySelector('description');
    const description = descriptionNode.parentNode === channel ? descriptionNode.textContent : '';
    const feed = {
      id: uniqueId('fd_'),
      name: channel.querySelector('title').textContent,
      description,
    };
    const posts = {
      addedPostList: [],
      addedLinkList: [],
      addedPostIDs: [],
    };
    channel.querySelectorAll('item').forEach((item) => {
      const currentLink = item.querySelector('link').textContent;
      if (!linkList.includes(currentLink)) {
        posts.addedLinkList.push(currentLink);
        const postElement = {
          id: uniqueId(),
          postName: item.querySelector('title').textContent,
          postDescription: item.querySelector('description').textContent,
          link: currentLink,
        };
        posts.addedPostList.push(postElement);
        posts.addedPostIDs.push(postElement.id);
      }
    });
    return { feed, posts };
  } catch (e) {
    console.log(e);
    throw new Error('XML structure reading error!');
  }
};
