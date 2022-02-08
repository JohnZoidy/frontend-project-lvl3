export default (response) => {
  const domParser = new DOMParser();
  const xmldata = domParser.parseFromString(response.data.contents, 'application/xml');
  if (xmldata.querySelector('parsererror')) {
    throw new Error(xmldata.querySelector('parsererror').firstChild.textContent);
  }
  const channel = xmldata.querySelector('channel');
  const descriptionNode = channel.querySelector('description');
  const description = descriptionNode.parentNode === channel ? descriptionNode.textContent : '';
  const feed = {
    title: channel.querySelector('title').textContent,
    description,
  };
  const posts = [];
  channel.querySelectorAll('item').forEach((item) => {
    const currentLink = item.querySelector('link').textContent;
    const postElement = {
      postTitle: item.querySelector('title').textContent,
      postDescription: item.querySelector('description').textContent,
      link: currentLink,
    };
    posts.push(postElement);
  });
  return { feed, posts };
};
