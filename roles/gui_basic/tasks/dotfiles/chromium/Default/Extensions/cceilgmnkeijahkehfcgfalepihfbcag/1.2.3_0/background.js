(() => {
  // src/types.ts
  var DEFAULT_SETTINGS = {
    name: {
      first: "",
      middle: "",
      last: ""
    },
    deadname: [{
      first: "",
      middle: "",
      last: ""
    }],
    enabled: !0,
    stealthMode: !1,
    highlight: !1
  };

  // src/background/background.ts
  var settings = null;
  loadSettings().then(($setting) => {
    settings = $setting, $setting.stealthMode && enableStealth();
  });
  chrome.runtime.onInstalled.addListener(() => {
    chrome.runtime.openOptionsPage();
  });
  var ports = new Map();
  chrome.runtime.onConnect.addListener((port) => {
    if (port.name === "tab") {
      let reply = () => {
        let message = getSettings();
        message instanceof Promise ? message.then((asyncMessage) => asyncMessage && port.postMessage(asyncMessage)) : message && port.postMessage(message);
      }, tabId = port.sender.tab.id, {frameId} = port.sender, senderURL = port.sender.url, framesPorts;
      ports.has(tabId) ? framesPorts = ports.get(tabId) : (framesPorts = new Map(), ports.set(tabId, framesPorts)), framesPorts.set(frameId, {url: senderURL, port}), port.onDisconnect.addListener(() => {
        framesPorts.delete(frameId), framesPorts.size === 0 && ports.delete(tabId);
      }), reply();
    }
  });
  chrome.runtime.onConnect.addListener((port) => {
    port.name === "popup" && port.onMessage.addListener((message) => onUIMessage(port, message));
  });
  function changeSettings($settings) {
    $settings.stealthMode !== settings.stealthMode && ($settings.stealthMode ? enableStealth() : disableStealth()), saveSettings($settings), sendMessage(getTabMessage);
  }
  function getAllTabs(query) {
    return new Promise((resolve) => {
      chrome.tabs.query(query, (tabs) => resolve(tabs));
    });
  }
  var getTabMessage = (url, frameURL) => getSettings();
  async function sendMessage(getMessage) {
    (await getAllTabs({})).filter((tab) => ports.has(tab.id)).forEach((tab) => {
      ports.get(tab.id).forEach(({url, port}, frameId) => {
        let message = getMessage(tab.url, frameId === 0 ? null : url);
        tab.active && frameId === 0 ? port.postMessage(message) : setTimeout(() => port.postMessage(message));
      });
    });
  }
  function loadSettings() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(DEFAULT_SETTINGS, (settings2) => {
        Array.isArray(settings2.deadname) || (settings2.deadname = [settings2.deadname], saveSettings(settings2)), resolve(settings2);
      });
    });
  }
  function saveSettings($settings) {
    return settings = {...settings, ...$settings}, new Promise((resolve, reject) => {
      chrome.storage.sync.set($settings, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
          return;
        }
        resolve();
      });
    });
  }
  function getSettings() {
    return settings;
  }
  function enableStealth() {
    !chrome.browserAction.setIcon || (chrome.browserAction.setIcon({path: "icons/stealth.svg"}), chrome.browserAction.setPopup({popup: "popup/stealth-popup.html"}), chrome.browserAction.setTitle({title: "An experimental adblocker"}));
  }
  function disableStealth() {
    !chrome.browserAction.setIcon || (chrome.browserAction.setIcon({path: "icons/icon19.png"}), chrome.browserAction.setPopup({popup: "popup/popup.html"}), chrome.browserAction.setTitle({title: "Deadname Remover Options"}));
  }
  function onUIMessage(port, {type, data, id}) {
    switch (type) {
      case "get-data": {
        let data2 = getSettings();
        port.postMessage({id, data: data2});
        break;
      }
      case "save-data": {
        changeSettings(data);
        break;
      }
      case "enable-stealth-mode": {
        enableStealth();
        break;
      }
      case "disable-stealth-mode": {
        disableStealth();
        break;
      }
    }
  }
})();
