
function getCurrentTabId(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (callback) callback(tabs.length ? tabs[0].id : null);
  });
}

getCurrentTabId(id => {
  const bg = chrome.extension.getBackgroundPage();
  debugger

  const app = new Vue({
    el: '#app',
    data() {
      const options = bg.getOptionsById(id)
      return {
        loginUrl: options.loginUrl || '',
        routers: options.routers || [],
      };
    },
    methods: {
      login() {
        window.open(this.loginUrl);
      },
      switchRouter(name) {
        chrome.tabs.sendMessage(
          id,
          {
            type: 'ROUTER_VIEW_DEVTOOL_SWITCH_ROUTER',
            payload: { name }
          },
          function (response) {
            console.log(response);
          }
        );
      }
    }
  })

})
