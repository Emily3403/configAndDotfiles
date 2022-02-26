(() => {
  // src/inject/dom.ts
  function isDOMReady() {
    return document.readyState === "complete" || document.readyState === "interactive";
  }
  var readyStateListeners = new Set();
  function addDOMReadyListener(listener) {
    readyStateListeners.add(listener);
  }
  var domAction = (callback) => {
    isDOMReady() ? callback() : addDOMReadyListener(callback);
  };
  if (!isDOMReady()) {
    let onReadyStateChange = () => {
      isDOMReady() && (document.removeEventListener("readystatechange", onReadyStateChange), readyStateListeners.forEach((listener) => listener()), readyStateListeners.clear());
    };
    document.addEventListener("readystatechange", onReadyStateChange);
  }

  // src/popup/popup.ts
  var port = chrome.runtime.connect({name: "popup"}), counter = 0;
  function getRequestId() {
    return ++counter;
  }
  function sendRequest(request, executor) {
    let id = getRequestId();
    return new Promise((resolve) => {
      let listener = ({id: responseId, ...response}) => {
        responseId === id && (executor(response, resolve), port.onMessage.removeListener(listener));
      };
      port.onMessage.addListener(listener), port.postMessage({...request, id});
    });
  }
  function getData() {
    return sendRequest({type: "get-data"}, ({data}, resolve) => resolve(data));
  }
  function changeSettings() {
    let settings = {
      enabled: document.querySelector(".onoff-option").checked
    };
    port.postMessage({type: "save-data", data: settings});
  }
  function loadSettings() {
    getData().then((settings) => {
      document.querySelector(".onoff-option").checked = settings.enabled;
    });
  }
  document.addEventListener("DOMContentLoaded", loadSettings);
  var registerEvents = () => {
    document.getElementById("btnOpenNameSettings").addEventListener("click", () => {
      chrome.runtime.openOptionsPage();
    }), document.querySelector(".onoff-option").addEventListener("click", changeSettings);
  };
  domAction(registerEvents);
})();
