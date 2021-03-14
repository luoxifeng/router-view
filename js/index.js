

function injectCustomJs() {
  var temp = document.createElement('script');
  temp.setAttribute('type', 'text/javascript');
  temp.src = chrome.extension.getURL('js/inject.js');
  temp.onload = function () {
    this.parentNode.removeChild(this);
  };
  (document.head || document.documentElement).appendChild(temp);
}

injectCustomJs();
