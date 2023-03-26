// Update the volume and badge whenever the tab is switched or reloaded
function updateVolumeAndBadge(tab) {
  const tabId = tab.id;

  chrome.tabs.executeScript(tabId, {
    code: `Array.from(document.querySelectorAll('video, audio')).map(media => media.volume)[0];`
  }, (result) => {
    const volume = Math.round(result[0] * 100);

    // Update the volume slider
    document.getElementById('volume').value = volume;

    // Update the extension badge
    chrome.browserAction.setBadgeText({ text: volume.toString(), tabId: tabId });
  });
}

// Initialize the volume and badge on extension load
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const activeTab = tabs[0];
  updateVolumeAndBadge(activeTab);
});

// Update the volume and badge whenever the tab is switched or reloaded
chrome.tabs.onActivated.addListener((activeInfo) => {
  const tabId = activeInfo.tabId;
  chrome.tabs.get(tabId, (tab) => {
    updateVolumeAndBadge(tab);
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active) {
    updateVolumeAndBadge(tab);
  }
});

// Update the volume whenever the slider changes
document.getElementById('volume').addEventListener('change', (event) => {
  const volume = event.target.value / 100;

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    const tabId = activeTab.id;

    chrome.tabs.executeScript(tabId, {
      code: `Array.from(document.querySelectorAll('video, audio')).forEach(media => media.volume = ${volume});`
    });

    // Update the badge with the new volume
    const badgeText = Math.round(volume * 100).toString();
    chrome.browserAction.setBadgeText({ text: badgeText, tabId: tabId });
  });
});

document.getElementById('reset').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    const tabId = activeTab.id;

    chrome.tabs.executeScript(tabId, {
      code: `Array.from(document.querySelectorAll('video, audio')).forEach(media => media.volume = 1);`
    });
    updateVolumeAndBadge(activeTab);
  });
});
