document.getElementById('volume').addEventListener('change', (event) => {
  const volume = event.target.value / 100;

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    const tabId = activeTab.id;

    chrome.tabs.executeScript(tabId, {
      code: `Array.from(document.querySelectorAll('video, audio')).forEach(media => media.volume = ${volume});`
    });
  });
});

document.getElementById('reset').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    const tabId = activeTab.id;

    chrome.tabs.executeScript(tabId, {
      code: `Array.from(document.querySelectorAll('video, audio')).forEach(media => media.volume = 1);`
    });
  });
});
