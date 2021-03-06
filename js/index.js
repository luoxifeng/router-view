


function inject(target) {
  const register = opts => {
    const app = opts.app;
    const routers = app.$router.options.routes.map(t => {
      return {
        name: t.name,
        title: (t.meta && t.meta.title) || t.title,
        entry: t.meta ? t.meta.isEntry : false
      };
    }).filter(t => t.entry);
    // debugger

    app.$router.afterEach((to, from) => {
      target.postMessage({
        type: 'ROUTER_VIEW_DEVTOOL_CURRENT_ROUTE',
        payload: to.name
      }, '*')
    })
    
    target.postMessage({
      type: 'ROUTER_VIEW_DEVTOOL_REGISTER',
      payload: {
        routers: routers,
        loginUrl: opts.loginUrl,
        current: app.$router.currentRoute.name
      }
    }, '*')

    target.addEventListener('message', e => {
      if (e.data.type === 'ROUTER_VIEW_DEVTOOL_SWITCH_ROUTER') {
        console.log('ROUTER_VIEW_DEVTOOL_SWITCH_ROUTER', e.data.payload)
        if (app.$router.currentRoute.name === e.data.payload.name) {
          app.$alert ? app.$alert(`已经是当前页面`) : alert(`已经是当前页面`)
          return;
        }
        app.$router.push(e.data.payload, () => {
          console.log('ROUTER_VIEW_DEVTOOL_跳转成功');
        });
      }
    })


  }
  target.__ROUTER_VIEW_DEVTOOL__ = register;
}

function injectScript() {
  const script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.textContent = `;(${inject.toString()})(window)`;
  document.documentElement.appendChild(script);
  script.parentNode.removeChild(script);
}

window.addEventListener("message", function(e) {
  // debugger
  if (e.data.type === 'ROUTER_VIEW_DEVTOOL_REGISTER') {
    chrome.runtime.sendMessage({
      ...e.data,
      type: 'ROUTER_VIEW_DEVTOOL_INIT',
    });
  }

  if (e.data.type === 'ROUTER_VIEW_DEVTOOL_CURRENT_ROUTE') {
    chrome.runtime.sendMessage(e.data);
  }
}, false);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === 'ROUTER_VIEW_DEVTOOL_SWITCH_ROUTER') {
    sendResponse('ROUTER_VIEW_DEVTOOL_SWITCH_ROUTER');
    window.postMessage(request, '*')
  }
});


injectScript();
