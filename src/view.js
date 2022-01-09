const watchers = (path, value) => {
  if (path === 'rssForm.state') {
    if (value === 'invalid') {
    // if url is invalid, display err
      console.log('invalid!');
    }
    if (value === 'valid') {
    // if url is correct ,disable button
      console.log('valid!');
    }
    if (value === 'ready') {
      // clear field and focus
    }
    if (value === 'getError') {
      // show get err
    }
  }
  if (path === 'rssForm.data.currentRssData') {
    // show window and add text in feed
  }
};

export default watchers;
