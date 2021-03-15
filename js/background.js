

window.__OPTIONS__ = {};

window.getOptionsById = id => (window.__OPTIONS__[id] || {});

function getCurrentTabId(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (callback) callback(tabs.length ? tabs[0].id : null);
  });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  
  if (request.type === 'ROUTER_VIEW_DEVTOOL_INIT_OPTIONS') {
    getCurrentTabId(id => {
      console.log(id);
      __OPTIONS__[id] = request.payload;
    })
    sendResponse('ROUTER_VIEW_DEVTOOL_INIT_OPTIONS: COMPLETE');
  }
});