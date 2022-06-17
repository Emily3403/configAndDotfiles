var background = (function () {
  var tmp = {};
  chrome.runtime.onMessage.addListener(function (request) {
    for (var id in tmp) {
      if (tmp[id] && (typeof tmp[id] === "function")) {
        if (request.path === "background-to-options") {
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
        "path": "options-to-background"
      });
    }
  }
})();

var config = {
  "elements": {},
  "style": {
    "textarea": {
      "tabSize": 2,
      "fence": false,
      "softTabs": true,
      "autoOpen": true,
      "overwrite": true,
      "autoStrip": true,
      "autoIndent": true,
      "replaceTab": true
    }
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
  "interface": {
    "render": function (changes) {
      const length = changes ? Object.keys(changes).length : 0;
      const inputs = [...document.querySelectorAll("input[type='checkbox']"), ...document.querySelectorAll("input[type='radio']")];
      /*  */
      chrome.storage.local.get(null, function (e) {
        if (length !== 1) {
          const details = [...document.querySelectorAll("details")];
          /*  */
          details[0].open = e["section-" + (0 + 1)];
          details[1].open = e["section-" + (1 + 1)];
          details[2].open = e["section-" + (2 + 1)];
          details[3].open = e["section-" + (3 + 1)];
          details[4].open = e["section-" + (4 + 1)];
          /*  */
          config.elements.support.checked = e.open;
          config.elements.nativeinline.checked = e.nativeinline;
          config.elements.nativeignore.checked = e.nativeignore;
          config.elements.nativerespect.checked = e.nativerespect;
          config.elements.nativecolorful.checked = e.nativecolorful;
          config.elements.nativecontinue.checked = e.nativecontinue;
          config.elements.nativepriority.checked = e.nativepriority;
          config.elements.mapcssvariables.checked = e.mapcssvariables;
          config.elements.nativemediaquery.checked = e.nativemediaquery;
          config.elements.nativecompatible.checked = e.nativecompatible;
          config.elements.nativedarkenimage.checked = e.nativedarkenimage;
          config.elements.nativeforceborder.checked = e.nativeforceborder;
          config.elements.nativecssstylesheet.checked = e.nativecssstylesheet;
          /*  */
          for (let name in website.custom.regex.rules) {
            let element = document.getElementById(name);
            if (element) element.checked = e[name];
          }
          /*  */
          for (let i = 1; i <= website.total.themes.number; i++) {
            let element = document.getElementById("dark_" + i);
            if (element) element.checked = e["dark_" + i];
          }
        }
        /*  */
        config.elements.custom.value = e.custom;
        config.elements.nativecssrules.value = e.nativecssrules;
        config.elements.cookie.value = e.cookie ? e.cookie.join(', ') : '';
        config.elements.whitelist.value = e.whitelist ? e.whitelist.join(', ') : '';
        /*  */
        for (let color in e.nativecssvariables) {
          let element = document.getElementById(color);
          if (element) element.value = e.nativecssvariables[color];
        }
        /*  */
        for (let i = 0; i < inputs.length; i++) {
          const input = inputs[i];
          if (input) {
            const label = input.parentNode;
            if (label) {
              const color = {"normal": "rgb(135, 135, 135)", "highlight": "rgb(193, 193, 193)"};
              label.style.color = input.checked ? color.highlight : color.normal;
            }
            //
            if (input.dataset) {
              if (input.dataset.native !== undefined) {
                const td = input.closest("td");
                if (td) {
                  const div = td.querySelector("div");
                  if (div) {
                    input.checked ? div.removeAttribute("disabled") : div.setAttribute("disabled", '');
                  }
                }
              }
            }
          }
        }
      });
    }
  },
  "handle": {
    "reset": function () {
      config.elements.reset.click();
    },
    "mouseleave": function () {
      var footer = document.querySelector(".footer .title");
      if (footer) footer.textContent = '';
    },
    "mouseenter": function (e) {
      var title = e.target.getAttribute("title");
      var footer = document.querySelector(".footer .title");
      /*  */
      if (footer) footer.textContent = title ? title : '';
    },
    "background": function (e) {
      if (e && e.target) {
        if (e.target.id === "reset-addon") {
          const action = window.confirm("Reset the addon to factory settings?\nPlease note that all changes for custom styles, whitelisted items, selected options, etc. will be lost.");
          if (action) background.send(e.target.id);
        } else {
          background.send(e.target.id);
        }
      }
    },
    "toggle": function (e) {
      var close = e.target.id === "close-overlay";
      var closest = e.target.closest(".container");
      var container = document.querySelector(".container");
      /*  */
      if (close || closest !== container) {
        var status = config.elements.overlay.getAttribute("status");
        config.elements.overlay.setAttribute("status", status === "show" ? "hide": "show");
      }
    },
    "click": function () {
      var tmp = {};
      var id = this.id;
      var checked = this.checked;
      /*  */
      if (id.indexOf("dark_") !== -1) {
        for (var i = 1; i <= website.total.themes.number; i++) {
          var element = document.getElementById("dark_" + i);
          if (element) element.checked = false;
        }
        /*  */
        document.getElementById(id).checked = checked;
      }
      /*  */
      for (var name in website.custom.regex.rules) {
        var element = document.getElementById(name);
        if (element) tmp[name] = element.checked;
      }
      /*  */
      for (var i = 1; i <= website.total.themes.number; i++) {
        var element = document.getElementById("dark_" + i);
        if (element) tmp["dark_" + i] = element.checked;
      }
      /*  */
      chrome.storage.local.set(tmp);
    },
    "store": function (e) {
      const id = e.target.id;
      /*  */
      if (id.startsWith("--native-dark-")) {
        const value = e.target.value;
        chrome.storage.local.get("nativecssvariables", function (e) {
          e.nativecssvariables[id] = value;
          chrome.storage.local.set({
            "nativecssvariables": e.nativecssvariables
          });
        });
      } else {
        let tmp = {};
        /*  */
        tmp[id] = id === "custom" || id === "nativecssrules" ? e.target.value : e.target.checked;
        /*  */
        if (id === "nativeignore" && tmp[id]) {
          tmp["nativerespect"] = false;
          tmp["nativecompatible"] = false;
        }
        /*  */
        if (id === "nativerespect" && tmp[id]) {
          tmp["nativeignore"] = false;
          tmp["nativecompatible"] = false;
        }
        /*  */
        if (id === "nativecompatible" && tmp[id]) {
          tmp["nativeignore"] = false;
          tmp["nativerespect"] = false;
        }
        /*  */
        chrome.storage.local.set(tmp);
      }
    }
  },
  "load": function () {
    var test = document.getElementById("test-dark-mode");
    var reset = document.getElementById("reset-dark-mode");
    var summary = [...document.querySelectorAll("summary")];
    var pack = document.getElementById("dark-browsing-pack");
    var donation = document.getElementById("make-a-donation");
    var tutorial = document.getElementById("youtube-tutorial");
    var support = document.getElementById("open-support-page");
    var items = [...document.querySelectorAll("td[id*='-item']")];
    /*  */
    config.elements.support = document.getElementById("open");
    config.elements.custom = document.getElementById("custom");
    config.elements.cookie = document.getElementById("cookie");
    config.elements.overlay = document.querySelector(".overlay");
    config.elements.reset = document.getElementById("reset-addon");
    config.elements.whitelist = document.getElementById("whitelist");
    config.elements.nativeinline = document.getElementById("nativeinline");
    config.elements.nativeignore = document.getElementById("nativeignore");
    config.elements.nativerespect = document.getElementById("nativerespect");
    config.elements.nativecssrules = document.getElementById("nativecssrules");
    config.elements.nativecontinue = document.getElementById("nativecontinue");
    config.elements.nativepriority = document.getElementById("nativepriority");
    config.elements.nativecolorful = document.getElementById("nativecolorful");
    config.elements.mapcssvariables = document.getElementById("mapcssvariables");
    config.elements.nativemediaquery = document.getElementById("nativemediaquery");
    config.elements.nativecompatible = document.getElementById("nativecompatible");
    config.elements.nativedarkenimage = document.getElementById("nativedarkenimage");
    config.elements.nativeforceborder = document.getElementById("nativeforceborder");
    config.elements.nativecssstylesheet = document.getElementById("nativecssstylesheet");
    config.elements.nativecssvariables = [...document.querySelectorAll(".cssvariables input")];
    /*  */
    reset.addEventListener("click", config.handle.reset);
    pack.addEventListener("click", config.handle.toggle);
    test.addEventListener("click", config.handle.background);
    support.addEventListener("click", config.handle.background);
    tutorial.addEventListener("click", config.handle.background);
    donation.addEventListener("click", config.handle.background);
    /*  */
    config.elements.custom.addEventListener("keyup", config.handle.store);
    config.elements.support.addEventListener("change", config.handle.store);
    config.elements.overlay.addEventListener("click", config.handle.toggle);
    config.elements.reset.addEventListener("click", config.handle.background);
    config.elements.nativeinline.addEventListener("change", config.handle.store);
    config.elements.nativeignore.addEventListener("change", config.handle.store);
    config.elements.nativerespect.addEventListener("change", config.handle.store);
    config.elements.nativecssrules.addEventListener("keyup", config.handle.store);
    config.elements.nativecontinue.addEventListener("change", config.handle.store);
    config.elements.nativepriority.addEventListener("change", config.handle.store);
    config.elements.nativecolorful.addEventListener("change", config.handle.store);
    config.elements.mapcssvariables.addEventListener("change", config.handle.store);
    config.elements.nativemediaquery.addEventListener("change", config.handle.store);
    config.elements.nativecompatible.addEventListener("change", config.handle.store);
    config.elements.nativedarkenimage.addEventListener("change", config.handle.store);
    config.elements.nativeforceborder.addEventListener("change", config.handle.store);
    config.elements.nativecssstylesheet.addEventListener("change", config.handle.store);
    config.elements.nativecssvariables.map(function (e) {e.addEventListener("change", config.handle.store)});
    /*  */
    items.map(function (e) {e.addEventListener("click", config.handle.background)});
    items.map(function (e) {e.addEventListener("mouseenter", config.handle.mouseenter)});
    items.map(function (e) {e.addEventListener("mouseleave", config.handle.mouseleave)});
    /*  */
    config.style.textarea["textarea"] = config.elements.custom;
    new Behave(config.style.textarea);
    /*  */
    config.style.textarea["textarea"] = config.elements.nativecssrules;
    new Behave(config.style.textarea);
    /*  */
    for (var name in website.custom.regex.rules) {
      var element = document.getElementById(name);
      if (element) {
        element.addEventListener("click", config.handle.click);
      }
    }
    /*  */
    for (var i = 1; i <= website.total.themes.number; i++) {
      var element = document.getElementById("dark_" + i);
      if (element) {
        element.addEventListener("click", config.handle.click);
      }
    }
    /*  */
    for (var i = 0; i < website.custom.compatible.length; i++) {
      var name = website.custom.compatible[i];
      var element = document.getElementById(name);
      if (element) {
        element.closest("label").setAttribute("compatible", '');
      }
    }
    /*  */
    config.elements.cookie.addEventListener("change", function () {
      var tmp = [];
      var cookie = config.elements.cookie.value || '';
      var splitted = cookie.split(/\s*\,\s*/);
      /*  */
      for (var i = 0; i < splitted.length; i++) tmp.push(splitted[i]);
      tmp = tmp.filter(function (element, index, array) {return element && array.indexOf(element) === index});
      chrome.storage.local.set({"cookie": tmp});
    });
    /*  */
    config.elements.whitelist.addEventListener("change", function () {
      var tmp = [];
      var whitelist = config.elements.whitelist.value || '';
      var splitted = whitelist.split(/\s*\,\s*/);
      /*  */
      for (var i = 0; i < splitted.length; i++) tmp.push(config.hostname(splitted[i]));
      tmp = tmp.filter(function (element, index, array) {return element && array.indexOf(element) === index});
      chrome.storage.local.set({"whitelist": tmp});
    });
    /*  */
    summary.map(function (element) {
      element.addEventListener("click", function (e) {
        var tmp = {};
        var value = !e.target.closest("details").open;
        var name = e.target.closest("details").className;
        /*  */
        tmp[name] = value;
        chrome.storage.local.set(tmp);
      });
    });
    /*  */
    config.interface.render();
    window.removeEventListener("load", config.load, false);
  }
};

window.addEventListener("load", config.load, false);
chrome.storage.onChanged.addListener(config.interface.render);
