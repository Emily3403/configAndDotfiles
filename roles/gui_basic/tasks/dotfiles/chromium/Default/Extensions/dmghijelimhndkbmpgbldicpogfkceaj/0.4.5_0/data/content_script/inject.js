var background = (function () {
  var tmp = {};
  /*  */
  chrome.runtime.onMessage.addListener(function (request) {
    for (var id in tmp) {
      if (tmp[id] && (typeof tmp[id] === "function")) {
        if (request.path === "background-to-page") {
          if (request.method === id) {
            tmp[id](request.data);
          }
        }
      }
    }
  });
  /*  */
  return {
    "receive": function (id, callback) {
      tmp[id] = callback;
    },
    "send": function (id, data) {
      chrome.runtime.sendMessage({
        "method": id, 
        "data": data,
        "path": "page-to-background"
      });
    }
  }
})();

var config = {
  "log": false,
  "general": {
    "link": document.getElementById("dark-mode-general-link")
  },
  "custom": {
    "link": document.getElementById("dark-mode-custom-link"),
    "style": document.getElementById("dark-mode-custom-style")
  },
  "native": {
    "inline": false,
    "ignore": false,
    "respect": false,
    "colorful": true,
    "continue": false,
    "selected": false,
    "priority": false,
    "compatible": true,
    "stylesheet": null,
    "mediaquery": false,
    "mapcssvariables": true,
    "style": document.getElementById("dark-mode-native-style"),
    "sheet": document.getElementById("dark-mode-native-sheet"),
    "css": {
      "rules": '',
      "variables": ''
    },
    "force": {
      "color": {
        "border": true
      }
    },
    "darken": {
      "background": {
        "image": true
      }
    }
  },
  "load": function () {
    config.observer.head.disconnect();
    //
    if (config.native.selected) {
      if (native.dark.engine.is.active) {
        native.dark.engine.analyze.document.sheets("process", 3);
      }
    }
    //
    window.removeEventListener("load", config.load, false);
  },
  "hostname": function (url) {
    url = url.replace("www.", '');
    var s = url.indexOf("//") + 2;
    if (s > 1) {
      var o = url.indexOf('/', s);
      if (o > 0) return url.substring(s, o);
      else {
        o = url.indexOf('?', s);
        if (o > 0) return url.substring(s, o);
        else return url.substring(s);
      }
    } else return url;
  },
  "temporarily": {
    "timeout": undefined,
    "id": "temporarily-dark-style",
    "add": function () {
      if (document.documentElement) {
        document.documentElement.setAttribute(config.temporarily.id, '');
      }
    },
    "remove": function (delay) {
      if (document.documentElement) {
        if (delay) {
          if (config.temporarily.timeout) window.clearTimeout(config.temporarily.timeout);
          config.temporarily.timeout = window.setTimeout(function () {
            document.documentElement.removeAttribute(config.temporarily.id);
          }, delay);
        } else {
          document.documentElement.removeAttribute(config.temporarily.id);
        }
      }
    }
  },
  "observer": {
    "storage": function () {
      chrome.storage.onChanged.addListener(function () {
        chrome.storage.local.get(null, function () {
          window.setTimeout(function () {
            background.send("reload");
          }, 0);
        });
      });
    },
    "head": new MutationObserver(function () {
      var tmp = {};
      /*  */
      if (document.documentElement) {
        tmp.a = document.getElementById("dark-mode-general-link");
        if (!tmp.a) document.documentElement.appendChild(config.general.link);
        /*  */
        tmp.b = document.getElementById("dark-mode-custom-link");
        if (!tmp.b) document.documentElement.appendChild(config.custom.link);
        /*  */
        tmp.c = document.getElementById("dark-mode-custom-style");
        if (!tmp.c) document.documentElement.appendChild(config.custom.style);
        /*  */
        tmp.d = document.getElementById("dark-mode-native-style");
        if (!tmp.d) document.documentElement.appendChild(config.native.style);        
        /*  */
        tmp.d = document.getElementById("dark-mode-native-sheet");
        if (!tmp.d) document.documentElement.appendChild(config.native.sheet);
        /*  */
        config.observer.head.disconnect();
      }
    })
  },
  "check": {
    "darkness": function (e) {
      try {
        if (e && e.length) {
          for (var i = 0; i < e.length; i++) {
            if (document.cookie) {
              if (document.cookie.indexOf(e[i]) !== -1) {
                return true;
              }
            }
            /*  */
            if (localStorage) {
              var keys = JSON.stringify(localStorage).replace(/\\/g, '').replace(/\"/g, '');
              if (keys) {
                if (keys.indexOf(e[i]) !== -1) {
                  return true;
                }
              }
            }
            /*  */
            if (sessionStorage) {
              var keys = JSON.stringify(sessionStorage).replace(/\\/g, '').replace(/\"/g, '');
              if (keys) {
                if (keys.indexOf(e[i]) !== -1) {
                  return true;
                }
              }
            }
          }
        }
      } catch (e) {
        return false;
      }
      /*  */
      return false;
    }
  },
  "apply": {
    "style": function (e) {
      var loc = e.loc;
      var href_g = e.href_g;
      var href_c = e.href_c;
      var text_c = e.text_c;
      var text_n = e.text_n;
      var options = e.options;
      /*  */
      if (options.frameId === 0) {
        if (options.reload === false) {
          if (href_g === '' && href_c === '' && text_c === '' && text_n === '') {
            config.temporarily.remove(0);
          } else {
            config.temporarily.add();
            config.temporarily.remove(200);
          }
        } else {
          config.temporarily.remove(0);
        }
      } else {
        config.temporarily.remove(0);
      }
      /*  */
      config.custom.style.textContent = text_c;
      config.native.style.textContent = text_n;
      /*  */
      href_c ? config.custom.link.setAttribute("href", href_c) : config.custom.link.removeAttribute("href");
      href_g ? config.general.link.setAttribute("href", href_g) : config.general.link.removeAttribute("href");
      /*  */
      if (text_n) {
        native.dark.observer.mutation.observe(document.documentElement, native.dark.observer.options);
        document.documentElement.setAttribute(native.dark.theme.attribute, '');
        if (options.cssstylesheet) native.dark.engine.process.cssstylesheet();
        config.native.sheet.disabled = false;
        native.dark.engine.is.active = true;
        //
        native.dark.engine.analyze.document.sheets("process", 4);
      } else {
        if (native.dark.engine.is.active) {
          document.documentElement.removeAttribute(native.dark.theme.attribute);
          native.dark.observer.mutation.disconnect();
          native.dark.engine.is.active = false;
          config.native.sheet.disabled = true;
          //
          native.dark.engine.analyze.document.sheets("clean", 5);
        }
      }
    }
  },
  "start": function () {
    background.send("load");
    config.observer.storage();
    /*  */
    if (!config.general.link) {
      config.general.link = document.createElement("link");
      config.general.link.setAttribute("type", "text/css");
      config.general.link.setAttribute("rel", "stylesheet");
      config.general.link.setAttribute("id", "dark-mode-general-link");
    }
    /*  */
    if (!config.custom.link) {
      config.custom.link = document.createElement("link");
      config.custom.link.setAttribute("type", "text/css");
      config.custom.link.setAttribute("rel", "stylesheet");
      config.custom.link.setAttribute("id", "dark-mode-custom-link");
    }
    /*  */
    if (!config.custom.style) {
      config.custom.style = document.createElement("style");
      config.custom.style.setAttribute("lang", "en");
      config.custom.style.setAttribute("type", "text/css");
      config.custom.style.setAttribute("id", "dark-mode-custom-style");
    }
    /*  */
    if (!config.native.style) {
      config.native.style = document.createElement("style");
      config.native.style.setAttribute("lang", "en");
      config.native.style.setAttribute("type", "text/css");
      config.native.style.setAttribute("id", "dark-mode-native-style");
    }    
    /*  */
    if (!config.native.sheet) {
      config.native.sheet = document.createElement("style");
      config.native.sheet.setAttribute("lang", "en");
      config.native.sheet.setAttribute("type", "text/css");
      config.native.sheet.setAttribute("id", "dark-mode-native-sheet");
    }
    /*  */
    if (document.documentElement) {
      document.documentElement.appendChild(config.custom.link);
      document.documentElement.appendChild(config.general.link);
      document.documentElement.appendChild(config.custom.style);
      document.documentElement.appendChild(config.native.style);
      document.documentElement.appendChild(config.native.sheet);
      //
      config.native.stylesheet = config.native.sheet.sheet;
    } else {
      config.observer.head.observe(document, {
        "subtree": true,
        "childList": true,
      });
    }
  },
  "render": function (e) {
    var top = e.top ? e.top : document.location.href;
    var uri = e.uri ? e.uri : decodeURIComponent(top);
    var darkness = config.check.darkness(e.storage.cookie);
    var hostname = e.hostname ? e.hostname : config.hostname(top);
    var options = {"reload": e.reload, "frameId": e.frameId, "cssstylesheet": e.storage.nativecssstylesheet};
    /*  */
    if (darkness) {
      return config.apply.style({"loc": 0, "href_g": '', "href_c": '', "text_c": '', "text_n": '', "options": options});
    }
    /*  */
    if (top.indexOf("/chrome/newtab") !== -1) {
      return config.apply.style({"loc": 1, "href_g": '', "href_c": '', "text_c": '', "text_n": '', "options": options});
    }
    /*  */
    for (var i = 0; i < e.storage.whitelist.length; i++) {
      if (e.storage.whitelist[i] === hostname) {
        return config.apply.style({"loc": 2, "href_g": '', "href_c": '', "text_c": '', "text_n": '', "options": options});
      }
    }
    /*  */
    website.theme.number.active = null;
    for (var i = 1; i <= website.total.themes.number; i++) {
      if (e.storage["dark_" + i]) {
        website.theme.number.active = i;
        break;
      }
    }
    /*  */
    config.native.selected = website.theme.number.active === website.theme.number.native;
    config.native.compatible = e.storage.nativecompatible && config.native.selected;
    config.native.respect = e.storage.nativerespect && config.native.selected;
    config.native.ignore = e.storage.nativeignore && config.native.selected;
    config.native.darken.background.image = e.storage.nativedarkenimage;
    config.native.force.color.border = e.storage.nativeforceborder;
    config.native.css.variables = e.storage.nativecssvariables;
    config.native.mapcssvariables = e.storage.mapcssvariables;
    config.native.mediaquery = e.storage.nativemediaquery;
    config.native.css.rules = e.storage.nativecssrules;
    config.native.colorful = e.storage.nativecolorful;
    config.native.priority = e.storage.nativepriority;
    config.native.continue = e.storage.nativecontinue;
    config.native.inline = e.storage.nativeinline;
    /*  */
    for (var name in website.custom.regex.rules) {
      const cond_1 = config.native.ignore === false;
      const cond_2 = config.native.compatible === false;
      const cond_3 = config.native.compatible && e.compatible.indexOf(name) === -1;
      /*  */
      var usecustom = cond_1 && (cond_2 || cond_3);
      if (usecustom) {
        if (e.storage[name]) {
          var rule = new RegExp(website.custom.regex.rules[name]);
          if (rule.test(uri)) {
            var href_g = e.storage.state === "dark" ? chrome.runtime.getURL("data/content_script/custom/dark.css") : '';
            var href_c = e.storage.state === "dark" ? chrome.runtime.getURL("data/content_script/custom/" + name + ".css") : '';
            /*  */
            href_g = website.exclude.from.custom.dark.mode.indexOf(name) === -1 ? href_g : '';
            config.apply.style({"loc": 3, "href_g": href_g, "href_c": href_c, "text_c": '', "text_n": '', "options": options});
            return;
          }
        }
      }
    }
    /*  */
    if (e.storage.state === "dark") {
      if (website.theme.number.active) {
        if (website.theme.number.active === website.theme.number.custom) {
          config.apply.style({"loc": 4, "href_g": '', "href_c": '', "text_c": e.storage.custom, "text_n": '', "options": options});
        } else if (config.native.selected) {
          const rules = config.native.css.rules;
          const variables = JSON.stringify(config.native.css.variables, null, 2).replace(/\"/g, '').replace(/\,\n/g, ";\n");
          const nativecss = ":root, ::after, ::before, ::backdrop " + variables + "\n\n" + rules;
          //
          config.apply.style({"loc": 5, "href_g": '', "href_c": '', "text_c": '', "text_n": nativecss, "options": options});
        } else {
          var href_g = chrome.runtime.getURL("data/content_script/general/dark_" + website.theme.number.active + ".css");
          config.apply.style({"loc": 6, "href_g": href_g, "href_c": '', "text_c": '', "text_n": '', "options": options});
        }
      } else {
        config.apply.style({"loc": 7, "href_g": '', "href_c": '', "text_c": '', "text_n": '', "options": options});
      }
    } else {
      config.apply.style({"loc": 8, "href_g": '', "href_c": '', "text_c": '', "text_n": '', "options": options});
    }
  }
};

config.start();

//if (window === window.top) config.temporarily.add();

background.receive("storage", config.render);
window.addEventListener("load", config.load, false);