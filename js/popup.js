
function getCurrentTabId(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (callback) callback(tabs.length ? tabs[0].id : null);
  });
}

getCurrentTabId(id => {
  const bg = chrome.extension.getBackgroundPage();

  const app = new Vue({
    el: '#app',
    data() {
      const options = bg.getOptionsById(id)
      return {
        loginUrl: options.loginUrl || '',
        routers: options.routers || [],
        current: options.current || '',
      };
    },
    methods: {
      login() {
        window.open(this.loginUrl);
      },
      switchRouter(name) {
        if (this.current === name) return;
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
    },
    created() {
      chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.type === 'ROUTER_VIEW_DEVTOOL_CURRENT_ROUTE') {
          this.current = request.payload;
        }
      });
    },
    mounted() {
      const active = document.querySelector('.active');
      active && active.scrollIntoViewIfNeeded()
    }
  })
})
