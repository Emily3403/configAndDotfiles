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

  // src/popup/options.ts
  var port = chrome.runtime.connect({name: "popup"}), deadNameCounter = 0, counter = 0, settings = null;
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
  function isSettingsReady() {
    return settings != null;
  }
  var readyStateListeners = new Set();
  function addSettingsListener(listener) {
    readyStateListeners.add(listener);
  }
  getData().then(($settings) => {
    settings = $settings, readyStateListeners.forEach((listener) => listener()), readyStateListeners.clear();
  });
  function saveCurrentDeadName(index) {
    let deadName = {
      first: document.getElementById("txtFirstDeadname").value.trim(),
      middle: document.getElementById("txtMidDeadname").value.trim(),
      last: document.getElementById("txtLastDeadname").value.trim()
    };
    deadName.first || deadName.middle || deadName.last ? settings.deadname[index] = deadName : settings.deadname.splice(index, 1);
  }
  function loadDOM() {
    document.getElementById("txtFirstName").value = settings.name.first, document.getElementById("txtMidName").value = settings.name.middle, document.getElementById("txtLastName").value = settings.name.last, document.getElementById("txtFirstDeadname").value = settings.deadname[deadNameCounter].first, document.getElementById("txtMidDeadname").value = settings.deadname[deadNameCounter].middle, document.getElementById("txtLastDeadname").value = settings.deadname[deadNameCounter].last, document.getElementById("stealth-option").checked = settings.stealthMode, document.getElementById("highlight-option").checked = settings.highlight, renderDeadName(0, 0);
  }
  function changeSettings($settings) {
    port.postMessage({type: "save-data", data: $settings});
  }
  document.addEventListener("DOMContentLoaded", () => {
    isSettingsReady() ? loadDOM() : addSettingsListener(() => loadDOM());
  });
  var saveSettings = () => {
    let name = {
      first: document.getElementById("txtFirstName").value.trim(),
      middle: document.getElementById("txtMidName").value.trim(),
      last: document.getElementById("txtLastName").value.trim()
    };
    saveCurrentDeadName(deadNameCounter);
    let $settings = {
      name,
      deadname: settings.deadname,
      stealthMode: settings.stealthMode,
      highlight: settings.highlight
    };
    changeSettings($settings), document.getElementById("deadnames").classList.add("hide");
  };
  document.getElementById("btnSave").addEventListener("click", saveSettings);
  var coll = document.getElementsByClassName("hide");
  for (let i = 0, len = coll.length; i < len; i++)
    coll[i].addEventListener("click", (event) => {
      let content = event.target.nextElementSibling;
      content.style.maxHeight ? content.style.maxHeight = null : content.style.maxHeight = "max-content";
    });
  var leftArrow = document.querySelector(".leftArrow"), rightArrow = document.querySelector(".rightArrow");
  leftArrow.addEventListener("click", () => {
    renderDeadName(deadNameCounter, --deadNameCounter);
  });
  rightArrow.addEventListener("click", () => {
    renderDeadName(deadNameCounter, ++deadNameCounter);
  });
  document.getElementById("stealth-option").addEventListener("change", (e) => {
    settings.stealthMode = e.target.checked;
  });
  document.getElementById("highlight-option").addEventListener("change", (e) => {
    settings.highlight = e.target.checked;
  });
  function onChangeInput() {
    function changeInput() {
      let deadName = {
        first: document.getElementById("txtFirstDeadname").value.trim(),
        middle: document.getElementById("txtMidDeadname").value.trim(),
        last: document.getElementById("txtLastDeadname").value.trim()
      };
      deadName.first || deadName.middle || deadName.last ? rightArrow.classList.toggle("active", !0) : (saveCurrentDeadName(deadNameCounter), renderDeadName(deadNameCounter, deadNameCounter, {disableSave: !0}));
    }
    document.getElementById("txtFirstDeadname").addEventListener("change", changeInput), document.getElementById("txtMidDeadname").addEventListener("change", changeInput), document.getElementById("txtLastDeadname").addEventListener("change", changeInput);
  }
  onChangeInput();
  function renderDeadName(oldIndex, newIndex, options = {disableSave: !1}) {
    options.disableSave || saveCurrentDeadName(oldIndex), newIndex === 0 ? leftArrow.classList.toggle("active", !1) : leftArrow.classList.toggle("active", !0), newIndex === settings.deadname.length ? (settings.deadname.push(DEFAULT_SETTINGS.deadname[0]), rightArrow.classList.toggle("active", !1)) : rightArrow.classList.toggle("active", !0), document.getElementById("txtFirstDeadname").value = settings.deadname[newIndex].first, document.getElementById("txtMidDeadname").value = settings.deadname[newIndex].middle, document.getElementById("txtLastDeadname").value = settings.deadname[newIndex].last;
  }
})();
