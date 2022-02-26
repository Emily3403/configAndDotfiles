var native = {
  "dark": {
    "theme": {"number": 41},
    "class": {
      "cloned": "dark-mode-native-dark-cloned",
      "original": "dark-mode-native-dark-original",
      "processed": "dark-mode-native-dark-processed"
    },
    "observer": {
      "options": {
        "subtree": true,
        "childList": true
      },
      "mutation": new MutationObserver(function (mutations) {
        for (var mutation of mutations) {
          for (var node of mutation.addedNodes) {
            var cond_1 = node.nodeType === Node.ELEMENT_NODE;
            var cond_2 = node.nodeType === Node.TEXT_NODE && mutation.target;
            if (cond_1 || cond_2) {
              return native.dark.engine.analyze.document.sheets("process");
            }
          }
        }
      })
    },
    "engine": {
      "clone": {
        "node": function (node) {
          var local = native.dark.engine.is.node.local(node);
          if (!local) {
            var original = native.dark.engine.is.node.original(node);
            if (!original) {
              var cloned = native.dark.engine.is.node.cloned(node);
              if (!cloned) {
                var tagname = node.tagName.toLowerCase();
                var nodename = node.nodeName.toLowerCase();
                /*  */
                if (tagname === "style" || nodename === "style") {
                  var tmp = node.cloneNode(true);
                  var attributes = [...tmp.attributes];
                  /*  */
                  if (attributes && attributes.length) {
                    attributes.forEach(function (attribute) {
                      if (attribute.name === "id") {
                        tmp.removeAttribute(attribute.name);
                      }
                    });
                  }
                  /*  */
                  tmp.classList.add(native.dark.class.cloned);
                  node.classList.add(native.dark.class.original);
                  node.after(tmp);
                }
              }
            }
          }
        }
      },
      "fetch": {
        "stack": {},
        "remote": {
          "sheet"(sheet) {
            if (sheet) {
              if (sheet.href) {
                if (sheet.href.indexOf("http") === 0) {
                  var node = sheet.ownerNode;
                  if (node) {
                    var original = native.dark.engine.is.node.original(node);
                    if (!original) {
                      node.classList.add(native.dark.class.original);
                      native.dark.engine.fetch.stack[sheet.href] = sheet;
                      /*  */
                      try {
                        fetch(sheet.href).then(r => r.text()).then(function (content) {
                          if (content) {
                            var style = document.createElement("style");
                            /*  */
                            style.textContent = content;
                            style.setAttribute("lang", "en");
                            style.setAttribute("type", "text/css");
                            style.classList.add(native.dark.class.cloned);
                            /*  */
                            sheet.ownerNode.after(style);
                          }
                        }).catch(function (e) {
                          background.send("native-dark-fetch-remote-style", {
                            "href": sheet.href
                          });
                        });
                      } catch (e) {
                        background.send("native-dark-fetch-remote-style", {
                          "href": sheet.href
                        });
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "process": {
        "sheet": function (sheet) {
          try {
            if (sheet) {
              if (sheet.rules) {
                for (var rule of sheet.rules) {
                  if (rule.style) {
                    native.dark.engine.process.action(rule, sheet);
                  } else if (rule.cssRules) {
                    for (var key of rule.cssRules) {
                      if (key.style) {
                        native.dark.engine.process.action(key, sheet);
                      }
                    }
                  } else if (rule.styleSheet) {
                    native.dark.engine.process.sheet(rule.styleSheet);
                  }
                }
              }
            }
          } catch (e) {}
        },
        "action": function (rule, sheet) {
          if (rule) {
            if (sheet) {
              var is = {};
              sheet[native.dark.class.processed] = null;
              /*  */
              is.color = rule.style.getPropertyValue("color");
              is.image = rule.style.getPropertyValue("background-image");
              is.svg = rule.style.getPropertyValue("fill") || rule.style.getPropertyValue("stroke");
              is.outline = rule.style.getPropertyValue("outline") || rule.style.getPropertyValue("outline-color");
              is.shadow = rule.style.getPropertyValue("box-shadow") || rule.style.getPropertyValue("text-shadow");
              is.background = rule.style.getPropertyValue("background") || rule.style.getPropertyValue("background-color");
              is.border = rule.style.getPropertyValue("border") || rule.style.getPropertyValue("border-color") || 
                          rule.style.getPropertyValue("border-top") || rule.style.getPropertyValue("border-top-color") || 
                          rule.style.getPropertyValue("border-left") || rule.style.getPropertyValue("border-left-color") || 
                          rule.style.getPropertyValue("border-right") || rule.style.getPropertyValue("border-right-color") ||
                          rule.style.getPropertyValue("border-bottom") || rule.style.getPropertyValue("border-bottom-color");
              /*  */
              //if (is.svg) native.dark.engine.apply.style.for["svg"](rule);
              if (is.color) native.dark.engine.apply.style.for["color"](rule);
              if (is.shadow) native.dark.engine.apply.style.for["shadow"](rule);
              if (is.background) native.dark.engine.apply.style.for["background"](rule);
              if (is.image) native.dark.engine.apply.style.for["background-image"](rule);
              if (is.border || is.outline) native.dark.engine.apply.style.for["border"](rule);
            }
          }
        }
      },
      "analyze": {
        "document": {
          "sheets": function (key) {
            if (key) {
              if (document.styleSheets) {
                for (var sheet of document.styleSheets) {
                  var node = sheet.ownerNode;
                  if (node) {
                    var local = native.dark.engine.is.node.local(node);
                    if (!local) {
                      var original = native.dark.engine.is.node.original(node);
                      if (!original) {
                        var tagname = node.tagName.toLowerCase();
                        var nodename = node.nodeName.toLowerCase();
                        var cond_1 = tagname === "link" || nodename === "link";
                        var cond_2 = tagname === "style" || nodename === "style";
                        /*  */
                        if (cond_1 || cond_2) {
                          var cloned = native.dark.engine.is.node.cloned(node);
                          var processed = native.dark.engine.is.sheet.processed(sheet);
                          /*  */
                          if (key === "clean") {
                            if (cloned) {
                              sheet.disabled = true;
                              node.setAttribute("disabled", '');
                            }
                          }
                          /*  */
                          if (key === "process") {
                            if (cloned) {
                              sheet.disabled = false;
                              node.removeAttribute("disabled");
                            }
                            /*  */
                            if (!processed) {
                              if (cond_1) {
                                native.dark.engine.fetch.remote.sheet(sheet);
                              }
                              /*  */
                              if (cond_2) {
                                if (cloned) {
                                  native.dark.engine.process.sheet(sheet);
                                } else {
                                  native.dark.engine.clone.node(node);
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "is": {
        "active": false,
        "sheet": {
          "processed": function (sheet) {
            return sheet && (native.dark.class.processed in sheet);
          }
        },
        "node": {
          "cloned": function (node) {
            return node && node.classList.contains(native.dark.class.cloned);
          },
          "original": function (node) {
            return node && node.classList.contains(native.dark.class.original);
          },
          "local": function (node) {
            var cond_a = node && node.id && node.id === "dark-mode-custom-link";
            var cond_b = node && node.id && node.id === "dark-mode-general-link";
            var cond_c = node && node.id && node.id === "dark-mode-custom-style";
            var cond_d = node && node.id && node.id === "dark-mode-native-style";
            /*  */
            return cond_a || cond_b || cond_c || cond_d;
          }
        },
        "color": {
          "valid": {
            "for": {
              "border": function (e) {
                if (e) {
                  try {
                    e = e.toLowerCase();
                    /*  */
                    if (e.indexOf("none") === -1) {
                      if (e.indexOf("unset") === -1) {
                        if (e.indexOf("inherit") === -1) {
                          if (e.indexOf("initial") === -1) {
                            if (e.indexOf("transparent") === -1) {
                              return true;
                            }
                          }
                        }
                      }
                    }
                  } catch (e) {
                    return false;
                  }
                }
                /*  */
                return false;
              },
              "background": function (e) {
                if (e) {
                  try {
                    e = e.toLowerCase();
                    /*  */
                    if (e.indexOf("none") === -1) {
                      if (e.indexOf("unset") === -1) {
                        if (e.indexOf("black") === -1) {
                          if (e.indexOf("url(") === -1) {
                            if (e.indexOf("inherit") === -1) {
                              if (e.indexOf("initial") === -1) {
                                if (e.indexOf("transparent") === -1) {
                                  if (e.indexOf("-gradient") === -1) {
                                    var tmp = e.replace(/^rgba?\(|\s+|\)$/g,'').split(',');
                                    var opacity = tmp && tmp.length ? tmp[tmp.length - 1] : null;
                                    /*  */
                                    var cond_1 = e.indexOf("rgba") === -1;
                                    var cond_2 = e.indexOf("rgba") !== -1 && (opacity ? Number(opacity) >= 0.9 : false);
                                    if (cond_1 || cond_2) {
                                      return true;
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  } catch (e) {
                    return false;
                  }
                }
                /*  */
                return false;
              }
            }
          }
        }
      },
      "apply": {
        "style": {
          "for": {
            "color": function (rule) {
              if (rule.style) {
                if (rule.style.getPropertyValue("color")) {
                  rule.style.setProperty("color", "#dcdcdc", rule.style.getPropertyPriority("color"));
                }
              }
            },
            "shadow": function (rule) {
              if (rule.style) {
                if (rule.style.getPropertyValue("text-shadow")) rule.style.setProperty("text-shadow", "none", rule.style.getPropertyPriority("text-shadow"));
                if (rule.style.getPropertyValue("box-shadow")) rule.style.setProperty("box-shadow", "0 0 0 1px rgb(255 255 255 / 10%)", rule.style.getPropertyPriority("box-shadow"));
              }
            },
            "svg": function (rule) {
              if (rule.style) {
                if (rule.style.getPropertyValue("fill")) rule.style.setProperty("fill", "#7d7d7d", rule.style.getPropertyPriority("fill"));
                if (rule.style.getPropertyValue("stroke")) rule.style.setProperty("stroke", "#7d7d7d", rule.style.getPropertyPriority("stroke"));
              }
            },
            "background-image": function (rule) {
              if (rule.style) {
                var tmp = rule.style.getPropertyValue("background-image");
                if (tmp) {
                  if (tmp.indexOf("-gradient") !== -1) {
                    if (tmp.indexOf("url(") === -1) {
                      rule.style.setProperty("background-image", "none", rule.style.getPropertyPriority("background-image"));
                    }
                  }
                }
              }
            },
            "background": function (rule) {
              if (rule.style) {
                var tmp = rule.style.getPropertyValue("background");
                if (tmp) {
                  if (native.dark.engine.is.color.valid.for.background(tmp)) {
                    rule.style.setProperty("background", "#292929", rule.style.getPropertyPriority("background"));
                  }
                }
                /*  */
                var tmp = rule.style.getPropertyValue("background-color");
                if (tmp) {
                  if (native.dark.engine.is.color.valid.for.background(tmp)) {
                    rule.style.setProperty("background-color", "#292929", rule.style.getPropertyPriority("background-color"));
                  }
                }
              }
            },
            "border": function (rule) {
              if (rule.style) {
                var a = rule.style.getPropertyValue("outline");
                var b = rule.style.getPropertyValue("outline-width") || config.native.force.color.border;
                var c = rule.style.getPropertyValue("outline-color");
                var d = rule.style.getPropertyPriority("outline-color");
                if ((a && b) || c) {
                  if (native.dark.engine.is.color.valid.for.border(a || c)) {
                    rule.style.setProperty("outline-color", "#555555", d);
                  }
                }
                /*  */
                var a = rule.style.getPropertyValue("border");
                var b = rule.style.getPropertyValue("border-width") || config.native.force.color.border;
                var c = rule.style.getPropertyValue("border-color");
                var d = rule.style.getPropertyPriority("border-color");
                if ((a && b) || c) {
                  if (native.dark.engine.is.color.valid.for.border(a || c)) {
                    rule.style.setProperty("border-color", "#555555", d);
                  }
                }
                /*  */
                var a = rule.style.getPropertyValue("border-top");
                var b = rule.style.getPropertyValue("border-top-width") || config.native.force.color.border;
                var c = rule.style.getPropertyValue("border-top-color");
                var d = rule.style.getPropertyPriority("border-top-color");
                if ((a && b) || c) {
                  if (native.dark.engine.is.color.valid.for.border(a || c)) {
                    rule.style.setProperty("border-top-color", "#555555", d);
                  }
                }
                /*  */
                var a = rule.style.getPropertyValue("border-left");
                var b = rule.style.getPropertyValue("border-left-width") || config.native.force.color.border;
                var c = rule.style.getPropertyValue("border-left-color");
                var d = rule.style.getPropertyPriority("border-left-color");
                if ((a && b) || c) {
                  if (native.dark.engine.is.color.valid.for.border(a || c)) {
                    rule.style.setProperty("border-left-color", "#555555", d);
                  }
                }
                /*  */
                var a = rule.style.getPropertyValue("border-right");
                var b = rule.style.getPropertyValue("border-right-width") || config.native.force.color.border;
                var c = rule.style.getPropertyValue("border-right-color");
                var d = rule.style.getPropertyPriority("border-right-color");
                if ((a && b) || c) {
                  if (native.dark.engine.is.color.valid.for.border(a || c)) {
                    rule.style.setProperty("border-right-color", "#555555", d);
                  }
                }
                /*  */
                var a = rule.style.getPropertyValue("border-bottom");
                var b = rule.style.getPropertyValue("border-bottom-width") || config.native.force.color.border;
                var c = rule.style.getPropertyValue("border-bottom-color");
                var d = rule.style.getPropertyPriority("border-bottom-color");
                if ((a && b) || c) {
                  if (native.dark.engine.is.color.valid.for.border(a || c)) {
                    rule.style.setProperty("border-bottom-color", "#555555", d);
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

background.receive("native-dark-content-remote-style", function (e) {
  if (e) {
    if (e.href) {
      if (e.content) {
        var style = document.createElement("style");
        /*  */
        style.textContent = e.content;
        style.setAttribute("lang", "en");
        style.setAttribute("type", "text/css");
        style.classList.add(native.dark.class.cloned);
        /*  */
        var sheet = native.dark.engine.fetch.stack[e.href];
        if (sheet) {
          sheet.ownerNode.after(style);
        }
      }
    }
  }
});