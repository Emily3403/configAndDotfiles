var config = {};

config.addon = {
  set state (val) {app.storage.write("state", val)},
  get state () {return app.storage.read("state") !== undefined ? app.storage.read("state") : "light"}
};

config.page = {
  "test": "https://webbrowsertools.com/darkmode/",
  "theme": "https://mybrowseraddon.com/dark-theme.html",
  "tutorial": "https://www.youtube.com/watch?v=-QmU-qxT8GY",
  "newtab": "https://mybrowseraddon.com/blank-new-tab.html"
};

config.welcome = {
  set open (val) {app.storage.write("supportpage", val)},
  set lastupdate (val) {app.storage.write("lastupdate", val)},
  get open () {return app.storage.read("supportpage") !== undefined ? app.storage.read("supportpage") : true},
  get lastupdate () {return app.storage.read("lastupdate") !== undefined ? app.storage.read("lastupdate") : 0}
};

config.hostname = function (url) {
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
};

config.exception = {
  "keys": [
    "ae=d",
    "f6=400",
    "darkmode=1",
    "theme:dark",
    "theme:night",
    "dark_mode=1",
    "nightmode=1",
    "night_mode=1",
    "theme:darkmode",
    "theme:nightmode",
    "twilight.theme:1"
  ]
};