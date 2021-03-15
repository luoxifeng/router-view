

window.__OPTIONS__ = {};

window.getOptionsById = id => (window.__OPTIONS__[id] || {});

function getCurrentTabId(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (callback) callback(tabs.length ? tabs[0].id : null);
  });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  
  if (request.type === 'ROUTER_VIEW_DEVTOOL_INIT') {

    // 设置配置
    __OPTIONS__[sender.tab.id] = request.payload;

    /**
     * 更改icon
     */
    chrome.browserAction.setIcon({
      tabId: sender.tab.id,
      path: {
        16: `icons/enabled.png`,
        48: `icons/enabled.png`,
        128: `icons/enabled.png`
      }
    })

    // 更改popup
    chrome.browserAction.setPopup({
      tabId: sender.tab.id,
      popup: `popups/enabled.html`
    })

    sendResponse('ROUTER_VIEW_DEVTOOL_INIT: COMPLETE');
  }

  if (request.type === 'ROUTER_VIEW_DEVTOOL_CURRENT_ROUTE') {
    __OPTIONS__[sender.tab.id].current = request.payload;
  }
});
