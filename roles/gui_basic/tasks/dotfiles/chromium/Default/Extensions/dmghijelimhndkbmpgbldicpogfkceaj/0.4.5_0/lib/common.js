var core = {
  "start": function () {
    core.load();
  },
  "install": function () {
    core.load();
    core.update.storage();
  },
  "load": function () {
    core.update.button(config.addon.state);
    /*  */
    app.contextmenu.create({
      "contexts": ["page"],
      "id": "dark-mode-contextmenu",
      "title": "Exclude from dark mode"
    }, app.error);
  },
  "action": {
    "storage": function (changes) {
      if ("state" in changes) {
        core.update.button(config.addon.state);
      }
    }
  },
  "update": {
    "button": function (state) {
      app.button.icon(null, state);
      app.button.title(null, "Current State: " + state.toUpperCase());
    },
    "page": function (e, reload) {
      app.page.send("storage", {
        "reload": reload,
        "top": e ? e.top : null,
        "uri": e ? e.uri : null,
        "storage": app.storage.local,
        "frameId": e ? e.frameId : null,
        "hostname": e ? e.hostname : null,
        "compatible": website.custom.compatible
      }, e ? e.tabId : null, e ? e.frameId : null);
    },
    "storage": function () {
      chrome.storage.local.get(null, function (data) {
        let tmp = {};
        let cssrules = {};
        const active = "dark_" + 41;
        const cssvariables = website.custom.native.css.variables;
        /*  */
        cssrules.old = data.native;
        cssrules.new = website.custom.native.css.rules.replace(/\n/, '').replace(/          /g, '');
        /*  */
        tmp["open"] = data.open !== undefined ? data.open : false;
        tmp["custom"] = data.custom !== undefined ? data.custom : '';
        tmp["state"] = data.state !== undefined ? data.state : "light";
        tmp["whitelist"] = data.whitelist !== undefined ? data.whitelist : [];
        tmp["cookie"] = data.cookie !== undefined ? data.cookie : config.exception.keys;
        tmp["nativeinline"] = data.nativeinline !== undefined ? data.nativeinline : false;
        tmp["nativeignore"] = data.nativeignore !== undefined ? data.nativeignore : false;
        tmp["nativerespect"] = data.nativerespect !== undefined ? data.nativerespect : false;
        tmp["nativecolorful"] = data.nativecolorful !== undefined ? data.nativecolorful : true;
        tmp["nativepriority"] = data.nativepriority !== undefined ? data.nativepriority : false;
        tmp["nativecontinue"] = data.nativecontinue !== undefined ? data.nativecontinue : false;
        tmp["mapcssvariables"] = data.mapcssvariables !== undefined ? data.mapcssvariables : true;
        tmp["nativecompatible"] = data.nativecompatible !== undefined ? data.nativecompatible : true;
        tmp["nativemediaquery"] = data.nativemediaquery !== undefined ? data.nativemediaquery : false;
        tmp["nativeforceborder"] = data.nativeforceborder !== undefined ? data.nativeforceborder : true;
        tmp["nativedarkenimage"] = data.nativedarkenimage !== undefined ? data.nativedarkenimage : true;
        tmp["nativecssstylesheet"] = data.nativecssstylesheet !== undefined ? data.nativecssstylesheet : false;
        tmp["nativecssvariables"] = data.nativecssvariables !== undefined ? data.nativecssvariables : cssvariables;
        tmp["nativecssrules"] = data.nativecssrules !== undefined ? data.nativecssrules : (cssrules.old !== undefined ? cssrules.old : cssrules.new);
        /*  */
        tmp["section-1"] = data["section-1"] !== undefined ? data["section-1"] : false;
        tmp["section-2"] = data["section-2"] !== undefined ? data["section-2"] : false;
        tmp["section-3"] = data["section-3"] !== undefined ? data["section-3"] : false;
        tmp["section-4"] = data["section-4"] !== undefined ? data["section-4"] : true;
        tmp["section-5"] = data["section-5"] !== undefined ? data["section-5"] : false;
        /*  */
        for (let i = 1; i <= website.total.themes.number; i++) tmp["dark_" + i] = data["dark_" + i] !== undefined ? data["dark_" + i] : false;
        for (let name in website.custom.regex.rules) tmp[name] = data[name] !== undefined ? data[name] : true;
        tmp[active] = data[active] !== undefined ? data[active] : true;
        /*  */
        chrome.storage.local.set(tmp);
      });
    }
  }
};

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
    }).catch(e => {
      //console.error(e);
    });
  }
});

app.button.on.clicked(function () {
  config.addon.state = config.addon.state === "dark" ? "light" : "dark";
});

app.contextmenu.on.clicked(function (e) {
  if (e.menuItemId === "dark-mode-contextmenu") {
    const pageUrl = e.pageUrl;
    chrome.storage.local.get({"whitelist": []}, function (storage) {
      let whitelist = storage.whitelist;
      whitelist.push(config.hostname(pageUrl));
      whitelist = whitelist.filter(function (element, index, array) {return element && array.indexOf(element) === index});
      chrome.storage.local.set({"whitelist": whitelist});
    });
  }
});

app.options.receive("reset-addon", function () {
  app.storage.clear(core.update.storage);
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
app.on.storage(core.action.storage);