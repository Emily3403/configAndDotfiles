var core = {
  "start": function () {
    core.load();
  },
  "install": function (e) {
    core.load();
    core.init.storage(e);
  },
  "load": function () {
    core.update.button(config.addon.state)
    /*  */
    app.contextmenu.create({
      "contexts": ["page"],
      "id": "dark-mode-contextmenu",
      "title": "Exclude from dark mode"
    }, app.error);
  },
  "update": {
    "button": function (state) {
      app.button.title("Current State: " + state.toUpperCase());
      app.button.icon({
        "16": "../../data/icons/" + (state ? state + '/' : '') + "16.png",
        "32": "../../data/icons/" + (state ? state + '/' : '') + "32.png",
        "48": "../../data/icons/" + (state ? state + '/' : '') + "48.png",
        "64": "../../data/icons/" + (state ? state + '/' : '') + "64.png"
      });
    },
    "page": function (e, reload) {
      app.page.send("storage", {
        "reload": reload,
        "top": e ? e.top : null,
        "uri": e ? e.uri : null,
        "storage": app.storage.local,
        "frameId": e ? e.frameId : null,
        "hostname": e ? e.hostname : null
      }, e ? e.tabId : null, e ? e.frameId : null);
    }
  },
  "init": {
    "storage": function () {
      chrome.storage.local.get(null, function (data) {
        var tmp = {};
        var active = "dark_" + 41;
        /*  */
        tmp["custom"] = data.custom !== undefined ? data.custom : '';
        tmp["state"] = data.state !== undefined ? data.state : "light";
        tmp["whitelist"] = data.whitelist !== undefined ? data.whitelist : [];
        tmp["cookie"] = data.cookie !== undefined ? data.cookie : config.exception.keys;
        tmp["nativeignore"] = data.nativeignore !== undefined ? data.nativeignore : false;
        tmp["nativeforceborder"] = data.nativeforceborder !== undefined ? data.nativeforceborder : true;
        tmp["native"] = data.native !== undefined ? data.native : website.custom.native.css.replace(/        /g, '');
        tmp["supportpage"] = data.supportpage !== undefined ? data.supportpage : navigator.userAgent.toLowerCase().indexOf("firefox") === -1;
        /*  */
        tmp["section-1"] = data["section-1"] !== undefined ? data["section-1"] : false;
        tmp["section-2"] = data["section-2"] !== undefined ? data["section-2"] : false;
        tmp["section-3"] = data["section-3"] !== undefined ? data["section-3"] : false;
        tmp["section-4"] = data["section-4"] !== undefined ? data["section-4"] : true;
        tmp["section-5"] = data["section-5"] !== undefined ? data["section-5"] : false;
        /*  */
        for (var i = 1; i <= website.total.themes.number; i++) tmp["dark_" + i] = data["dark_" + i] !== undefined ? data["dark_" + i] : false;
        for (var name in website.custom.regex.rules) tmp[name] = data[name] !== undefined ? data[name] : true;
        tmp[active] = data[active] !== undefined ? data[active] : true;
        /*  */
        chrome.storage.local.set(tmp, function () {});
      });
    }
  }
};

app.button.on.clicked(function () {
  config.addon.state = config.addon.state === "dark" ? "light" : "dark";
  core.update.button(config.addon.state);
});

app.page.receive("load", function (e) {core.update.page(e, false)});
app.page.receive("reload", function (e) {core.update.page(e, true)});

app.page.receive("native-dark-fetch-remote-style", function (e) {
  if (e.href) {
    fetch(e.href).then(r => r.text()).then(function (content) {
      if (content) {
        app.page.send("native-dark-content-remote-style", {
          "href": e.href,
          "content": content
        }, e ? e.tabId : null, e ? e.frameId : null);
      }
    }).catch(e => {});
  }
});

app.contextmenu.on.clicked(function (e) {
  if (e.menuItemId === "dark-mode-contextmenu") {
    var pageUrl = e.pageUrl;
    chrome.storage.local.get({"whitelist": []}, function (storage) {
      var whitelist = storage.whitelist;
      whitelist.push(config.hostname(pageUrl));
      whitelist = whitelist.filter(function (element, index, array) {return element && array.indexOf(element) === index});
      chrome.storage.local.set({"whitelist": whitelist}, function () {});
    });
  }
});

app.options.receive("dark-mode-item", function () {app.tab.open(app.homepage())});
app.options.receive("test-dark-mode", function () {app.tab.open(config.page.test)});
app.options.receive("open-support-page", function () {app.tab.open(app.homepage())});
app.options.receive("dark-theme-item", function () {app.tab.open(config.page.theme)});
app.options.receive("dark-new-tab-item", function () {app.tab.open(config.page.newtab)});
app.options.receive("youtube-tutorial", function () {app.tab.open(config.page.tutorial)});
app.options.receive("make-a-donation", function () {app.tab.open(app.homepage() + "?reason=support")});

app.on.startup(core.start);
app.on.installed(core.install);