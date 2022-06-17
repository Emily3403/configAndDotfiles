var native = {
  "dark": {
    "class": {
      "cloned": "native-dark-class-cloned",
      "modified": "native-dark-class-modified",
      "original": "native-dark-class-original",
      "processed": "native-dark-class-processed"
    },
    "regexp": {
      "url": /url\(['"]?((?:\S*?\(\S*?\))*\S*?)['"]?\)/,
      "check": /(?:-|_)(\d+[\/\d. ]*|\d)x|(\d+[\/\d. ]*|\d)x(?:-|_)/,
      "relative": /url\((?!['"]?(?:data:|https?:|\/\/))(['"]?)([^'")]*)\1\)/g
    },
    "theme": {
      "number": 41,
      "attribute": "native-dark-active",
      "css": {
        "base": {
          "url": "native-dark-base-url"
        },
        "variable": {
          "prefix": "--native-dark-"
        }
      }
    },
    "observer": {
      "map": {},
      "delay": 0,
      "options": {
        "subtree": true,
        "childList": true
      },
      "timeout": {
        'a': null, 
        'b': null, 
        'c': null
      },
      "mutation": new MutationObserver(function (mutations) {
        for (let mutation of mutations) {
          for (let node of mutation.addedNodes) {
            const tagname = node.tagName ? node.tagName.toLowerCase() : '';
            const nodename = node.nodeName ? node.nodeName.toLowerCase() : '';
            const htmlname = tagname || nodename;
            //
            if (config.native.inline) {
              native.dark.engine.insert.rule.inline(node, htmlname);
            }
            //
            const cond_1 = htmlname === "link" || htmlname === "style";
            const cond_2 = htmlname === "iframe" || htmlname === "script";
            //
            if (cond_1) {
              var cloned = native.dark.engine.is.node.cloned(node);
              if (!cloned) {
                if (config.log) console.error("process", htmlname);
                native.dark.engine.analyze.document.node(node, node.sheet, "process", 0);
                //
                if (native.dark.observer.timeout.a) window.clearTimeout(native.dark.observer.timeout.a);
                native.dark.observer.timeout.a = window.setTimeout(function () {
                  try {
                    let stylemap = document.documentElement.computedStyleMap();
                    if (stylemap) {
                      for (const item of stylemap) {
                        if (item) {
                          if (item[0]) {
                            if (item[1]) {
                              if (item[1][0]) {
                                if (item[1][0][0]) {
                                  if (item[0].indexOf(native.dark.theme.css.variable.prefix) === -1) {
                                    native.dark.engine.map.css.object["var(" + item[0] + ")"] = item[1][0][0];
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  } catch (e) {}
                }, native.dark.observer.delay);
              }
            }
            //
            if (cond_2) {
              if (native.dark.observer.timeout.b) window.clearTimeout(native.dark.observer.timeout.b);
              native.dark.observer.timeout.b = window.setTimeout(function () {
                if (config.log) console.error("process", htmlname);
                native.dark.engine.analyze.document.sheets("process", 1);
              }, native.dark.observer.delay);
            }
            //
            if (config.native.continue) {
              try {
                const cond_3 = !cond_1 && !cond_2;
                const cond_4 = document.readyState === "complete";
                const cond_5 = node.nodeType === Node.ELEMENT_NODE;
                //
                if (cond_3 && cond_4 && cond_5) {
                  const id = node.id;
                  const name = node.className;
                  //
                  if (id || name) {
                    const cond_6 = id ? native.dark.observer.map[id] === undefined : true;
                    const cond_7 = name ? native.dark.observer.map[name] === undefined : true;
                    //
                    if (cond_6 && cond_7) {
                      if (id) native.dark.observer.map[id] = true;
                      if (name) native.dark.observer.map[name] = true;
                      //
                      if (native.dark.observer.timeout.c) window.clearTimeout(native.dark.observer.timeout.c);
                      native.dark.observer.timeout.c = window.setTimeout(function () {
                        if (config.log) console.error("process", htmlname);
                        native.dark.engine.analyze.document.sheets("process", 2);
                      }, native.dark.observer.delay);
                    }
                  }
                }
              } catch (e) {}
            }
          }
        }
      })
    },
    "engine": {
      "map": {
        "css": {
          "rules": {},
          "object": {},
          "sheets": {},
          "variables": async function (style) {
            try {
              [...style].map((name) => [name.trim(), style.getPropertyValue(name).trim()]).filter(([e]) => e.startsWith("--")).forEach((item) => {
                if (item) {
                  if (item[0]) {
                    if (item[1]) {
                      if (item[0].indexOf(native.dark.theme.css.variable.prefix) === -1) {
                        native.dark.engine.map.css.object["var(" + item[0] + ")"] = item[1];
                      }
                    }
                  }
                }
              });
            } catch (e) {}
          }
        }
      },
      "add": {
        "class": {
          "modified": function (node, sheet) {
            const local = native.dark.engine.is.node.local(node);
            if (!local) {
              const cloned = native.dark.engine.is.node.cloned(node);
              if (!cloned) {
                const original = native.dark.engine.is.node.original(node);
                if (!original) {
                  const modified = native.dark.engine.is.node.modified(node);
                  if (!modified) {
                    const tagname = node.tagName ? node.tagName.toLowerCase() : '';
                    const nodename = node.nodeName ? node.nodeName.toLowerCase() : '';
                    const htmlname = tagname || nodename;
                    /*  */
                    if (htmlname === "style") {
                      node.classList.add(native.dark.class.modified);
                      native.dark.engine.process.stylesheet(sheet, 3);
                    }
                  }
                }
              }
            }
          }
        }
      },
      "fetch": {
        "stack": {},
        "remote": {
          "css": async function (href, node) {
            if (href) {
              try {
                if (href.startsWith("http") === false) {
                  href = (new URL(href, document.location.href)).href;
                }
              } catch (e) {}
              //
              const cond_1 = href.startsWith("http");
              const cond_2 = href.indexOf("font.") === -1 && href.indexOf("font-") === -1 && href.indexOf("/font") === -1;
              const cond_3 = href.indexOf("fonts.") === -1 && href.indexOf("fonts-") === -1 && href.indexOf("/fonts") === -1;
              //
              if (cond_1 && cond_2 && cond_3) {
                if (node) {
                  var original = native.dark.engine.is.node.original(node);
                  if (!original) {
                    node.classList.add(native.dark.class.original);
                  }
                }
                //
                const origin_1 = (new URL(href)).origin;
                const origin_2 = document.location.origin;
                native.dark.engine.fetch.stack[href] = node;
                //
                if (origin_1 === origin_2) {
                  try {
                    let response = await fetch(href);
                    if (response) {
                      if (response.ok) {
                        let cloned = response.clone();
                        //
                        let content = await response.text();
                        if (content) {
                          if (content.includes("\x00")) {
                            let decoder = new TextDecoder("utf-16");
                            let buffer = await cloned.arrayBuffer();
                            content = buffer ? decoder.decode(buffer) : content;
                          }
                          //
                          native.dark.engine.insert.remote.style(href, content);
                        }
                      }
                    }
                  } catch (e) {
                    background.send("native-dark-fetch-remote-style", {"href": href});
                  }
                } else {
                  background.send("native-dark-fetch-remote-style", {"href": href});
                }
              }
            }
          }
        }
      },
      "process": {
        "cssstylesheet": async function () { // Constructable Stylesheets
          script = document.createElement("script");
          script.type = "text/javascript";
          script.onload = function () {script.remove()};
          script.src = chrome.runtime.getURL("data/content_script/page_context/inject.js");
          /*  */
          document.documentElement.appendChild(script);
        },
        "color": function (code, rule, ease, fallback) {
          if (code === fallback) return code;
          /*  */
          if (config.native.colorful) {
            try {
              if (chroma) {
                let color = code;
                //
                if (config.native.mapcssvariables) {
                  if (color.indexOf("--") !== -1) {
                    color = native.dark.engine.map.css.object[color];
                  }
                }
                //
                if (color) {
                  if (color.indexOf("--") === -1) {
                    if (color === "transparent") return "var(--native-dark-transparent-color)";
                    /*  */
                    const hsl = chroma(color).hsl();
                    const opacity = ease ? 0.90 : 0.75;
                    const darker = chroma(color).darker().hex();
                    const text = rule ? rule.selectorText : '';
                    /*  */
                    const cond_1 = hsl[2] > opacity;
                    const cond_2 = ((hsl[1] + hsl[2]) / 2) > opacity;
                    const cond_3 = isNaN(hsl[1]) === false && isNaN(hsl[2]) === false && isNaN(hsl[3]) === false;
                    const cond_4 = hsl[3] !== undefined ? (hsl[3] > opacity) || (hsl[1] < 0.10 && hsl[2] > 0.90) : true;
                    const cond_5 = text ? text.indexOf('.') === -1 && text.split(',').map(e => e.trim()).filter(e => (e === "html" || e === "body")).length > 0 : false;
                    /*  */
                    return cond_3 && cond_4 && (cond_1 || cond_2 || cond_5) ? fallback : darker;
                  }
                }
              }
            } catch (e) {
              return fallback;
            }
          }
          /*  */
          return fallback;
        },
        "stylesheet": async function (sheet, loc) { // Internal & External Stylesheets
          try {
            if (sheet) {
              if (sheet.cssRules) {
                for (let rule of sheet.cssRules) {
                  if (rule.href) {
                    native.dark.engine.fetch.remote.css(rule.href, sheet.ownerNode);
                  } else if (rule.style) {
                    if (config.native.mapcssvariables) {
                      native.dark.engine.map.css.variables(rule.style);
                    }
                    //
                    native.dark.engine.process.action(rule, sheet);
                  } else if (rule.cssRules) { // i.e. @media, @support
                    for (let key of rule.cssRules) {
                      if (key.style) {
                        native.dark.engine.process.action(key, sheet);
                      }
                    }
                  } else if (rule.styleSheet) {
                    native.dark.engine.process.stylesheet(rule.styleSheet, 1);
                  } else {
                    /*  */
                  }
                }
              } else {
                if (config.log) {
                  console.error(rule);
                }
              }
            } else {
              if (config.log) {
                console.error(sheet);
              }
            }
          } catch (e) {
            if (config.log) {
              console.error(e);
            }
          }
        },
        "action": async function (rule, sheet) {
          if (rule) {
            if (sheet) {
              if (rule.style) {
                const current = rule.style.length;
                const processed = rule[native.dark.class.processed] === current;
                //
                if (!processed) {
                  let property = {};
                  let base = sheet[native.dark.theme.css.base.url];
                  //
                  rule[native.dark.class.processed] = current;
                  if (base) rule[native.dark.theme.css.base.url] = base;
                  sheet[native.dark.class.processed] = sheet.cssRules.length;
                  //
                  property.color = rule.style.getPropertyValue("color");
                  property.backgroundonly = rule.style.getPropertyValue("background");
                  property.svg = rule.style.getPropertyValue("fill") || rule.style.getPropertyValue("stroke");        
                  property.image = rule.style.getPropertyValue("background-image") || rule.style.backgroundImage;
                  property.backgroundcolor = rule.style.getPropertyValue("background-color") || rule.style.backgroundColor;
                  //
                  property.outline = rule.style.getPropertyValue("outline") || 
                                     rule.style.getPropertyValue("outline-color") || rule.style.outlineColor;
                  //
                  property.shadow = rule.style.getPropertyValue("box-shadow") || rule.style.boxShadow || 
                                    rule.style.getPropertyValue("text-shadow") || rule.style.textShadow;
                  //
                  property.border = rule.style.getPropertyValue("border") || 
                                    rule.style.getPropertyValue("border-top") || rule.style.borderTop || 
                                    rule.style.getPropertyValue("border-left") || rule.style.borderLeft || 
                                    rule.style.getPropertyValue("border-color") || rule.style.borderColor || 
                                    rule.style.getPropertyValue("border-right") || rule.style.borderRight || 
                                    rule.style.getPropertyValue("border-bottom") || rule.style.borderBottom || 
                                    rule.style.getPropertyValue("border-top-color") || rule.style.borderTopColor || 
                                    rule.style.getPropertyValue("border-left-color") || rule.style.borderLeftColor || 
                                    rule.style.getPropertyValue("border-right-color") || rule.style.borderRightColor || 
                                    rule.style.getPropertyValue("border-bottom-color") || rule.style.borderBottomColor;         
                  //
                  if (property.color) native.dark.engine.apply.style.for["color"](rule);
                  if (property.shadow) native.dark.engine.apply.style.for["shadow"](rule);
                  if (property.image) native.dark.engine.apply.style.for["background-image"](rule);
                  if (property.backgroundonly) native.dark.engine.apply.style.for["background-only"](rule);
                  if (property.backgroundcolor) native.dark.engine.apply.style.for["background-color"](rule);
                  if (property.border || property.outline) native.dark.engine.apply.style.for["border"](rule);
                }
              }
            }
          }
        }
      },
      "analyze": {
        "document": {
          "sheets": async function (key, loc) {
            if (key) {
              let sheets = [...document.styleSheets];
              if (sheets) {
                for (let sheet of sheets) {
                  let node = sheet.ownerNode;
                  native.dark.engine.analyze.document.node(node, sheet, key, loc);
                }
              }
            }
          },
          "node": function (node, sheet, key, loc) {
            if (node) {
              let local = native.dark.engine.is.node.local(node);
              if (!local) {
                let original = native.dark.engine.is.node.original(node);
                if (!original) {
                  let tagname = node.tagName.toLowerCase();
                  let nodename = node.nodeName.toLowerCase();
                  let cond_1 = tagname === "link" || nodename === "link";
                  let cond_2 = tagname === "style" || nodename === "style";
                  /*  */
                  if (cond_1 || cond_2) {
                    let cloned = native.dark.engine.is.node.cloned(node);
                    let modified = native.dark.engine.is.node.modified(node);
                    let processed = native.dark.engine.is.sheet.processed(sheet);
                    /*  */
                    if (key === "clean") {
                      if (cloned) {
                        if (sheet) sheet.disabled = true;
                        node.setAttribute("disabled", '');
                      }
                    }
                    /*  */
                    if (key === "process") {
                      if (cloned) {
                        if (sheet) sheet.disabled = false;
                        node.removeAttribute("disabled");
                      }
                      /*  */
                      if (!processed) {
                        if (cond_1) {
                          let href = {};
                          href.a = sheet && sheet.href ? sheet.href : '';
                          href.b = node.type === "text/css" || node.rel === "stylesheet" ? node.href : '';
                          href.c = href.a || href.b;
                          //
                          native.dark.engine.fetch.remote.css(href.c, node);
                        }
                        /*  */
                        if (cond_2) {
                          if (cloned || modified) {
                            native.dark.engine.process.stylesheet(sheet, 2);
                          } else {
                            native.dark.engine.add.class.modified(node, sheet);
                          }
                        }
                      }
                    }
                  } else {
                    if (config.log) {
                      console.error(sheet);
                    }
                  }
                }
              }
            } else {
              if (config.log) {
                console.error(sheet);
              }
            }
          }
        }
      },
      "is": {
        "active": false,
        "sheet": {
          "processed": function (sheet) {
            try {
              return sheet && sheet.cssRules ? sheet[native.dark.class.processed] === sheet.cssRules.length : false;
            } catch (e) {}
            //
            return false;
          }
        },
        "node": {
          "cloned": function (node) {
            return node && node.classList.contains(native.dark.class.cloned);
          },          
          "modified": function (node) {
            return node && node.classList.contains(native.dark.class.modified);
          },
          "original": function (node) {
            return node && node.classList.contains(native.dark.class.original);
          },
          "local": function (node) {
            var cond_a = node && node.id && node.id === "dark-mode-custom-link";
            var cond_b = node && node.id && node.id === "dark-mode-general-link";
            var cond_c = node && node.id && node.id === "dark-mode-custom-style";
            var cond_d = node && node.id && node.id === "dark-mode-native-style";
            var cond_e = node && node.id && node.id === "dark-mode-native-sheet";
            /*  */
            return cond_a || cond_b || cond_c || cond_d || cond_e;
          }
        },
        "color": {
          "valid": {
            "for": {
              "font": {
                "color": function (e) {
                  if (e) {
                    try {
                      e = e.toLowerCase();
                      /*  */
                      if (e.indexOf("--") !== -1) return true;
                      //
                      if (e.indexOf("inherit") === -1) {
                        if (e.indexOf("window") === -1) {
                          if (e.indexOf("windowtext") === -1) {
                            return true;
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
              },
              "border": function (e) {
                if (e) {
                  try {
                    e = e.toLowerCase();
                    /*  */
                    if (e.indexOf("--") !== -1) return true;
                    //
                    if (e.indexOf("none") === -1) {
                      if (e.indexOf("unset") === -1) {
                        if (e.indexOf("inherit") === -1) {
                          if (e.indexOf("initial") === -1) {
                            if (e.indexOf("window") === -1) {
                              if (e.indexOf("windowtext") === -1) {
                                if (e.indexOf("transparent") === -1) {
                                  return true;
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
              },
              "background": {
                "url": function (e) {
                  if (e) {
                    try {
                      e = e.toLowerCase();
                      /*  */
                      if (e.indexOf("url(") !== -1) {
                        return true;
                      }
                    } catch (e) {
                      return false;
                    }
                  }
                  /*  */
                  return false;
                },
                "color": function (e) {
                  if (e) {
                    try {
                      e = e.toLowerCase();
                      /*  */
                      if (e.indexOf("-gradient") !== -1) return false;
                      if (e.indexOf("--") !== -1) return true;
                      //
                      if (e.indexOf("none") === -1) {
                        if (e.indexOf("unset") === -1) {
                          if (e.indexOf("black") === -1) {
                            if (e.indexOf("url(") === -1) {
                              if (e.indexOf("inherit") === -1) {
                                if (e.indexOf("initial") === -1) {
                                  if (e.indexOf("window") === -1) {
                                    if (e.indexOf("windowtext") === -1) {
                                      if (e.indexOf("-gradient") === -1) {
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
        }
      },
      "apply": {
        "style": {
          "for": {
            "svg": function (rule) {
              if (rule.style) {
                var tmp = rule.style.getPropertyValue("fill") || rule.style.fill;
                if (tmp && tmp !== "var(--native-dark-fill-color)") {
                  native.dark.engine.insert.rule.custom(rule, "fill", "var(--native-dark-fill-color)", '');
                }
                //
                var tmp = rule.style.getPropertyValue("stroke");
                if (tmp && tmp !== "var(--native-dark-fill-color)") {
                  native.dark.engine.insert.rule.custom(rule, "stroke", "var(--native-dark-fill-color)", '');
                }
              }
            },
            "shadow": function (rule) {
              if (rule.style) {
                var tmp = rule.style.getPropertyValue("text-shadow") || rule.style.textShadow;
                if (tmp && tmp !== "var(--native-dark-text-shadow)") {
                  native.dark.engine.insert.rule.custom(rule, "text-shadow", "var(--native-dark-text-shadow)", '');
                }
                //
                var tmp = rule.style.getPropertyValue("box-shadow") || rule.style.boxShadow;
                if (tmp && tmp !== "none" && tmp.indexOf("transparent") === -1 && tmp !== "var(--native-dark-box-shadow)") {
                  native.dark.engine.insert.rule.custom(rule, "box-shadow", "var(--native-dark-box-shadow)", '');
                }
              }
            },
            "color": function (rule) {
              if (rule.style) {
                var tmp = rule.style.getPropertyValue("color") || rule.style.color;
                if (native.dark.engine.is.color.valid.for.font.color(tmp)) {
                  if (tmp && tmp !== "var(--native-dark-font-color)") {
                    if (tmp.indexOf("transparent") === -1) {
                      native.dark.engine.insert.rule.custom(rule, "color", "var(--native-dark-font-color)", '');
                    } else {
                      native.dark.engine.insert.rule.custom(rule, "font-size", "0", '');
                    }
                  }
                }
              }
            },
            "background-image": function (rule) {
              if (rule.style) {
                var tmp = rule.style.getPropertyValue("background-image") || rule.style.backgroundImage;
                if (tmp && tmp !== "none") {
                  if (tmp.indexOf("url(") === -1) {
                    if (tmp.indexOf("-gradient") !== -1) {
                      native.dark.engine.insert.rule.custom(rule, "background-image", "none", '');
                    }
                  } else {
                    if (config.native.darken.background.image) {
                      native.dark.engine.insert.rule.for.image(rule, "background-image", tmp);
                    }
                  }
                }
              }
            },
            "background-color": function (rule) {
              if (rule.style) {
                var tmp = rule.style.getPropertyValue("background-color") || rule.style.backgroundColor;
                if (tmp) {
                  if (native.dark.engine.is.color.valid.for.background.color(tmp)) {
                    const value = native.dark.engine.process.color(tmp, rule, false, "var(--native-dark-bg-color)");
                    if (tmp !== value || tmp === "transparent") {
                      native.dark.engine.insert.rule.custom(rule, "background-color", value, '');
                    }
                  }
                }
              }
            },
            "background-only": function (rule) { 
              if (rule.style) {
                var tmp = rule.style.getPropertyValue("background");
                if (tmp) {
                  if (native.dark.engine.is.color.valid.for.background.color(tmp)) {
                    const value = native.dark.engine.process.color(tmp, rule, false, "var(--native-dark-bg-color)");
                    if (tmp !== value || tmp === "transparent") {
                      native.dark.engine.insert.rule.custom(rule, "background", value, '');
                    }
                  }
                  //
                  if (native.dark.engine.is.color.valid.for.background.url(tmp)) {
                    if (config.native.darken.background.image) {
                      native.dark.engine.insert.rule.for.image(rule, "background", tmp);
                    }
                  }
                }
              }
            },
            "border": function (rule) {
              if (rule.style) {
                var a = rule.style.getPropertyValue("outline");
                var c = rule.style.getPropertyValue("outline-color") || rule.style.outlineColor;
                var b = rule.style.getPropertyValue("outline-width") || rule.style.outlineWidth || config.native.force.color.border;
                if ((a && b) || c) {
                  var tmp = c ? c : a;
                  if (tmp && tmp !== "var(--native-dark-border-color)") {
                    if (native.dark.engine.is.color.valid.for.border(tmp)) {
                      native.dark.engine.insert.rule.custom(rule, "outline-color", "var(--native-dark-border-color)", '');
                    }
                  }
                }
                /*  */
                var a = rule.style.getPropertyValue("border");
                var c = rule.style.getPropertyValue("border-color") || rule.style.borderColor;
                var b = rule.style.getPropertyValue("border-width") || rule.style.borderWidth || config.native.force.color.border;
                if ((a && b) || c) {
                  var tmp = c ? c : a;
                  if (tmp && tmp !== "var(--native-dark-border-color)") {
                    if (native.dark.engine.is.color.valid.for.border(tmp)) {
                      native.dark.engine.insert.rule.custom(rule, "border-color", "var(--native-dark-border-color)", '');
                    }
                  }
                }
                /*  */
                var a = rule.style.getPropertyValue("border-top") || rule.style.borderTop;
                var c = rule.style.getPropertyValue("border-top-color") || rule.style.borderTopColor;
                var b = rule.style.getPropertyValue("border-top-width") || rule.style.borderTopWidth || config.native.force.color.border;
                if ((a && b) || c) {
                  var tmp = c ? c : a;
                  if (tmp && tmp !== "var(--native-dark-border-color)") {
                    if (native.dark.engine.is.color.valid.for.border(tmp)) {
                      native.dark.engine.insert.rule.custom(rule, "border-top-color", "var(--native-dark-border-color)", '');
                    }
                  }
                }
                /*  */
                var a = rule.style.getPropertyValue("border-left") || rule.style.borderLeft;
                var c = rule.style.getPropertyValue("border-left-color") || rule.style.borderLeftColor;
                var b = rule.style.getPropertyValue("border-left-width") || rule.style.borderLeftWidth || config.native.force.color.border;
                if ((a && b) || c) {
                  var tmp = c ? c : a;
                  if (tmp && tmp !== "var(--native-dark-border-color)") {
                    if (native.dark.engine.is.color.valid.for.border(tmp)) {
                      native.dark.engine.insert.rule.custom(rule, "border-left-color", "var(--native-dark-border-color)", '');
                    }
                  }
                }
                /*  */
                var a = rule.style.getPropertyValue("border-right") || rule.style.borderRight;
                var c = rule.style.getPropertyValue("border-right-color") || rule.style.borderRightColor;
                var b = rule.style.getPropertyValue("border-right-width") || rule.style.borderRightWidth || config.native.force.color.border;
                if ((a && b) || c) {
                  var tmp = c ? c : a;
                  if (tmp && tmp !== "var(--native-dark-border-color)") {
                    if (native.dark.engine.is.color.valid.for.border(tmp)) {
                      native.dark.engine.insert.rule.custom(rule, "border-right-color", "var(--native-dark-border-color)", '');
                    }
                  }
                }
                /*  */
                var a = rule.style.getPropertyValue("border-bottom") || rule.style.borderBottom;
                var c = rule.style.getPropertyValue("border-bottom-color") || rule.style.borderBottomColor;
                var b = rule.style.getPropertyValue("border-bottom-width") || rule.style.borderBottomWidth || config.native.force.color.border;
                if ((a && b) || c) {
                  var tmp = c ? c : a;
                  if (tmp && tmp !== "var(--native-dark-border-color)") {
                    if (native.dark.engine.is.color.valid.for.border(tmp)) {
                      native.dark.engine.insert.rule.custom(rule, "border-bottom-color", "var(--native-dark-border-color)", '');
                    }
                  }
                }
              }
            }
          }
        }
      },
      "insert": {
        "remote": {
          "style": function (href, content) {
            let style = document.createElement("style");
            /*  */
            try {
              content = content.replace(native.dark.regexp.relative, function (match, paran1, paran2) {
                try {
                  return "url('" + (new URL(paran2, href)).href + "')";
                } catch (e) {
                  //console.error(e);
                }
                //
                return match;
              });
            } catch (e) {
              //console.error(e);
            }
            //
            style.textContent = content;
            style.setAttribute("lang", "en");
            style.setAttribute("type", "text/css");
            style.classList.add(native.dark.class.cloned);
            /*  */
            let node = native.dark.engine.fetch.stack[href];
            if (node) {
              if (node.media) style.setAttribute("media", node.media);
              node.after(style);
            } else {
              document.head.appendChild(style);
            }
            /*  */
            style.sheet[native.dark.theme.css.base.url] = href;
            native.dark.engine.process.stylesheet(style.sheet, 4);
          }
        },
        "rule": {
          "for": {
            "node": function (node, name, value) {
              try {
                node.classList.add("native-dark-inline-style-" + Math.floor(Math.random() * 1e7));
                //
                const selector = "html[" + native.dark.theme.attribute + "]" + ' ' + node.className.trim().split(' ').map(e => '.' + e.trim()).join('');
                const cssrulestring = selector + ' ' + "{" + name + ": " + value + " !important}";
                //
                if (native.dark.engine.map.css.rules[cssrulestring] === undefined) {
                  let sheet = config.native.stylesheet;
                  index = sheet.insertRule(cssrulestring, 0);
                  native.dark.engine.map.css.rules[selector] = index;
                  native.dark.engine.map.css.rules[cssrulestring] = index;
                }
              } catch (e) {}
            },
            "image": function (rule, name, value) {
              try {
                if (native.dark.regexp.check.test(value) === false) {
                  const item = name === "background" ? 'b' : 'c';
                  const bgurl = native.dark.regexp.url.exec(value)[0].trim();
                  const option = {
                    'a': ["filter", "var(--native-dark-bg-image-filter)"],
                    'b': ["background", "linear-gradient(var(--native-dark-bg-image-color), var(--native-dark-bg-image-color)), " + value],
                    'c': ["background-image", "linear-gradient(var(--native-dark-bg-image-color), var(--native-dark-bg-image-color)), " + bgurl]
                  };
                  //
                  if (rule) {
                    const text = rule.selectorText;
                    const ishtml = text.startsWith("html");
                    const isbody = text.startsWith("body");
                    const pseudo = text.indexOf("::") !== -1;
                    //
                    if (ishtml && pseudo) {
                      native.dark.engine.insert.rule.custom(rule, option.a[0], option.a[1], "html");
                    } else if (isbody && pseudo) {
                      native.dark.engine.insert.rule.custom(rule, option.a[0], option.a[1], "body");
                    } else {
                      native.dark.engine.insert.rule.custom(rule, option[item][0], option[item][1], '');
                    }
                  } else {
                    return option[item][1];
                  }
                } else {
                  return value;
                }
              } catch (e) {
                return value;
              }
            }
          },
          "inline": async function (node, name) {
            if (node) {
              if (node.nodeType) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                  if (node.style) {
                    if (node.style.length) {
                      for (let i = 0; i < node.style.length; i++) {
                        try {
                          let value = '';
                          const key = node.style[i];
                          //
                          if (key.startsWith("--")) {
                            if (key.indexOf(native.dark.theme.css.variable.prefix) === -1) {
                              value = node.style.getPropertyValue(key);
                              native.dark.engine.map.css.object["var(" + key + ")"] = value;
                            }
                          }
                          //
                          if (key === "color") {
                            value = node.style.getPropertyValue(key);
                            value = native.dark.engine.process.color(value, '', true, "var(--native-dark-font-color)");
                            native.dark.engine.insert.rule.for.node(node, key, value);
                          }
                          //
                          if (key === "border-color") {
                            value = node.style.getPropertyValue(key);
                            value = native.dark.engine.process.color(value, '', false, "var(--native-dark-border-color)");
                            native.dark.engine.insert.rule.for.node(node, key, value);
                          }
                          //
                          if (key === "background" || key === "background-color") {
                            value = node.style.getPropertyValue(key);
                            value = native.dark.engine.process.color(value, '', false, "var(--native-dark-bg-color)");
                            native.dark.engine.insert.rule.for.node(node, key, value);
                          }
                          //
                          if (key === "background-image") {
                            if (config.native.darken.background.image) {
                              value = node.style.getPropertyValue(key);
                              value = native.dark.engine.insert.rule.for.image(null, "background-image", value);
                              native.dark.engine.insert.rule.for.node(node, key, value);
                            }
                          }
                        } catch (e) {
                          if (config.log) {
                            console.error(e);
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "custom": async function (rule, name, value, match) {
            try {
              const text = rule.selectorText;
              if (text) {
                if (name) {
                  let list = {};
                  const key = "html[" + native.dark.theme.attribute + "]";
                  //
                  list.a = document.documentElement.id ? ["#" + document.documentElement.id] : [];
                  list.b = document.documentElement.classList.length ? [...document.documentElement.classList].map(e => "." + e) : [];
                  list.c = [...list.a, ...list.b];
                  //
                  const selector = text.split(',').map(e => {
                    const cond_1 = e.trim().startsWith("*");
                    const cond_7 = e.trim().startsWith("[");
                    const cond_2 = e.trim().startsWith("::");
                    const cond_3 = e.trim().startsWith("html");
                    const cond_9 = e.trim().startsWith(":root");
                    const cond_8 = e.trim().indexOf(">") === -1;
                    const cond_4 = e.trim().startsWith(".") && e.trim().endsWith("body");
                    const cond_6 = e.trim().indexOf("-body") === -1 && e.trim().indexOf("body-") === -1;
                    const cond_5 = list.c.length ? list.c.indexOf(e.trim().split(' ')[0]) !== -1 : false;
                    //
                    return cond_1 || cond_2 ? '' : (cond_3 ? e.trim().replace("html", key) : key + (cond_5 || cond_7 || cond_9 ? (cond_8 ? '' : " ") : " ") + e.trim());
                  }).filter(e => e).join(", ");
                  //
                  if (selector) {
                    let hasmediaquery = false;
                    const priority = rule.style.getPropertyPriority(name);
                    const cssrulebody = name + ": " + (value ? value : "var(--native-dark-bg-color)");
                    const postfix = config.native.priority ? " !important" : (priority ? " !" + priority : '');
                    //
                    let cssrulestring = selector + " " + "{" + cssrulebody + postfix + "}";
                    let cssrulechecksum = selector + " " + "{" + cssrulebody + " !important" + "}";
                    //
                    if (config.native.mediaquery) {
                      if (rule.parentRule) {
                        if ("media" in rule.parentRule) {
                          if (rule.parentRule.conditionText) {
                            hasmediaquery = true;
                            cssrulestring = "@media " + rule.parentRule.conditionText + " {" + cssrulestring + "}";
                          }
                        }
                      }
                    }
                    //
                    if (native.dark.engine.map.css.rules[cssrulestring] === undefined) {
                      const cond_1 = text.indexOf(".") === -1;
                      const cond_2 = text.indexOf(",") === -1;
                      const cond_3 = match ? text.startsWith(match) : false;
                      //
                      if (match === '' || (cond_1 && cond_2 && cond_3)) {
                        try {
                          let index = native.dark.engine.map.css.rules[selector];
                          let sheet = config.native.stylesheet; // rule.parentStyleSheet;
                          //
                          if (index === undefined || hasmediaquery === true) {
                            index = sheet.insertRule(cssrulestring, 0);
                            native.dark.engine.map.css.rules[selector] = index;
                            native.dark.engine.map.css.rules[cssrulestring] = index;
                          } else {
                            try {
                              for (let i = 0; i < sheet.cssRules.length; i++) {
                                if (sheet.cssRules[i].selectorText === selector) {
                                  const checksum = native.dark.engine.map.css.rules[cssrulechecksum];
                                  //
                                  native.dark.engine.map.css.rules[selector] = i;
                                  native.dark.engine.map.css.rules[cssrulestring] = i;
                                  return checksum === undefined ? sheet.cssRules[i].style.setProperty(name, value, config.native.priority ? "important" : priority) : '';
                                }
                              }
                              //
                              index = sheet.insertRule(cssrulestring, 0);
                              native.dark.engine.map.css.rules[selector] = index;
                              native.dark.engine.map.css.rules[cssrulestring] = index;
                            } catch (e) {
                              index = sheet.insertRule(cssrulestring, 0);
                              native.dark.engine.map.css.rules[selector] = index;
                              native.dark.engine.map.css.rules[cssrulestring] = index;
                            }
                          }
                        } catch (e) {
                          // console.error(e);
                        }
                      }
                    }
                  }
                }
              }
            } catch (e) {
              // console.error(e);
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
        native.dark.engine.insert.remote.style(e.href, e.content);
      }
    }
  }
});