var background = (function () {
  var tmp = {};
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    for (var id in tmp) {
      if (tmp[id] && (typeof tmp[id] === "function")) {
        if (request.path === "background-to-options") {
          if (request.method === id) tmp[id](request.data);
        }
      }
    }
  });
  /*  */
  return {
    "receive": function (id, callback) {tmp[id] = callback},
    "send": function (id, data) {chrome.runtime.sendMessage({"path": "options-to-background", "method": id, "data": data})}
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
    "update": function () {
      var arr = [...document.querySelectorAll("input[type='checkbox']")];
      var color = {"normal": "rgb(110, 110, 110)", "highlight": "rgb(193, 193, 193)"};
      /*  */
      chrome.storage.local.get(null, function (e) {
        config.elements.custom.value = e.custom;
        config.elements.native.value = e.native;
        config.elements.cookie.value = e.cookie ? e.cookie.join(', ') : '';
        config.elements.whitelist.value = e.whitelist ? e.whitelist.join(', ') : '';
      });
      /*  */
      for (var i = 0; i < arr.length; i++) {
        var checkbox = arr[i];
        if (checkbox) {
          var label = checkbox.parentNode;
          if (label) {
            label.style.color = checkbox.checked ? color.highlight : color.normal;
          }
        }
      }
    },
    "render": function () {
      var details = [...document.querySelectorAll("details")];
      /*  */
      chrome.storage.local.get(null, function (e) {
        details[0].open = e["section-" + (0 + 1)];
        details[1].open = e["section-" + (1 + 1)];
        details[2].open = e["section-" + (2 + 1)];
        details[3].open = e["section-" + (3 + 1)];
        details[4].open = e["section-" + (4 + 1)];
        /*  */
        config.elements.custom.value = e.custom;
        config.elements.native.value = e.native;
        config.elements.support.checked = e.supportpage;
        config.elements.nativeignore.checked = e.nativeignore;
        config.elements.nativeforceborder.checked = e.nativeforceborder;
        config.elements.cookie.value = e.cookie ? e.cookie.join(', ') : '';
        config.elements.whitelist.value = e.whitelist ? e.whitelist.join(', ') : '';
        /*  */
        for (var name in website.custom.regex.rules) {
          var element = document.getElementById(name);
          if (element) element.checked = e[name];
        }
        /*  */
        for (var i = 1; i <= website.total.themes.number; i++) {
          var element = document.getElementById("dark_" + i);
          if (element) element.checked = e["dark_" + i];
        }
        /*  */
        config.interface.update();
      });
    }
  },
  "handle": {
    "mouseleave": function () {
      var footer = document.querySelector(".footer .title");
      if (footer) footer.textContent = '';
    },
    "background": function (e) {
      if (e && e.target) {
        background.send(e.target.id);
      }
    },
    "store": function (e) {
      var tmp = {};
      var id = e.target.id;
      var value = (id === "custom" || id === "native") ? e.target.value : e.target.checked;
      /*  */
      tmp[id] = value;
      chrome.storage.local.set(tmp, function () {});
    },
    "mouseenter": function (e) {
      var title = e.target.getAttribute("title");
      var footer = document.querySelector(".footer .title");
      /*  */
      if (footer) footer.textContent = title ? title : '';
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
      chrome.storage.local.set(tmp, function () {});
    }
  },
  "load": function () {
    var test = document.getElementById("test-dark-mode");
    var summary = [...document.querySelectorAll("summary")];
    var pack = document.getElementById("dark-browsing-pack");
    var donation = document.getElementById("make-a-donation");
    var tutorial = document.getElementById("youtube-tutorial");
    var support = document.getElementById("open-support-page");
    var items = [...document.querySelectorAll("td[id*='-item']")];
    /*  */
    config.elements.custom = document.getElementById("custom");
    config.elements.native = document.getElementById("native");
    config.elements.cookie = document.getElementById("cookie");
    config.elements.overlay = document.querySelector(".overlay");
    config.elements.whitelist = document.getElementById("whitelist");
    config.elements.support = document.getElementById("supportpage");
    config.elements.nativeignore = document.getElementById("nativeignore");
    config.elements.nativeforceborder = document.getElementById("nativeforceborder");
    /*  */
    pack.addEventListener("click", config.handle.toggle);
    test.addEventListener("click", config.handle.background);
    support.addEventListener("click", config.handle.background);
    tutorial.addEventListener("click", config.handle.background);
    donation.addEventListener("click", config.handle.background);
    /*  */
    config.elements.custom.addEventListener("keyup", config.handle.store);
    config.elements.native.addEventListener("keyup", config.handle.store);
    config.elements.support.addEventListener("change", config.handle.store);
    config.elements.overlay.addEventListener("click", config.handle.toggle);
    config.elements.nativeignore.addEventListener("change", config.handle.store);
    config.elements.nativeforceborder.addEventListener("change", config.handle.store);
    /*  */
    items.map(function (e) {e.addEventListener("click", config.handle.background)});
    items.map(function (e) {e.addEventListener("mouseenter", config.handle.mouseenter)});
    items.map(function (e) {e.addEventListener("mouseleave", config.handle.mouseleave)});
    /*  */
    config.style.textarea["textarea"] = config.elements.custom;
    new Behave(config.style.textarea);
    /*  */
    config.style.textarea["textarea"] = config.elements.native;
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
    config.elements.cookie.addEventListener("change", function () {
      var tmp = [];
      var cookie = config.elements.cookie.value || '';
      var splitted = cookie.split(/\s*\,\s*/);
      /*  */
      for (var i = 0; i < splitted.length; i++) tmp.push(splitted[i]);
      tmp = tmp.filter(function (element, index, array) {return element && array.indexOf(element) === index});
      chrome.storage.local.set({"cookie": tmp}, function () {});
    });
    /*  */
    config.elements.whitelist.addEventListener("change", function () {
      var tmp = [];
      var whitelist = config.elements.whitelist.value || '';
      var splitted = whitelist.split(/\s*\,\s*/);
      /*  */
      for (var i = 0; i < splitted.length; i++) tmp.push(config.hostname(splitted[i]));
      tmp = tmp.filter(function (element, index, array) {return element && array.indexOf(element) === index});
      chrome.storage.local.set({"whitelist": tmp}, function () {});
    });
    /*  */
    summary.map(function (element) {
      element.addEventListener("click", function (e) {
        var tmp = {};
        var value = !e.target.closest("details").open;
        var name = e.target.closest("details").className;
        /*  */
        tmp[name] = value;
        chrome.storage.local.set(tmp, function () {});
      });
    });
    /*  */
    config.interface.render();
    window.removeEventListener("load", config.load, false);
  }
};

window.addEventListener("load", config.load, false);
chrome.storage.onChanged.addListener(config.interface.update);
