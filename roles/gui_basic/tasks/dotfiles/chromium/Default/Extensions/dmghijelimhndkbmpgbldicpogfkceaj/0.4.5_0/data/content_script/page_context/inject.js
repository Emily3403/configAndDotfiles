{
  const _page = {
    "action": {
      "change": {
        "style": function (css) {
          try {
            const limit = 1;
            const rules = {};
            const check = {};
            const result = {};
            //
            rules.a = new RegExp("color\\:(.*)\\;", "gi");
            rules.b = new RegExp("background\\:(.*)\\;", "gi");
            rules.c = new RegExp("background\\-color\\:(.*)\\;", "gi");
            //
            for (let i = 0; i < limit; i++) {
              result.a = rules.a.exec(css);
              check.a = _page.action.is.color.valid.for.font(result.a);
              if (check.a) css = css.replace(rules.a, "color: #fff;");
              //
              result.b = rules.b.exec(css);
              check.b = _page.action.is.color.valid.for.background(result.b);
              if (check.b) css = css.replace(rules.b, "background: #383838;");
              //
              result.c = rules.c.exec(css);
              check.c = _page.action.is.color.valid.for.background(result.c);
              if (check.c) css = css.replace(rules.c, "background-color: #383838;");
            }
          } catch (e) {}
          //
          return css;
        }
      },
      "is": {
        "color": {
          "valid": {
            "for": {
              "font": function (matched) {
                if (matched) {
                  if (matched.length) {
                    var e = matched[1];
                    if (e) {
                      e = e.toLowerCase();
                      /*  */
                      if (e.indexOf("--") !== -1) return true;
                      /*  */
                      if (e.indexOf("transparent") === -1) {
                        return true;
                      }
                    }
                  }
                }
                /*  */
                return false;
              },
              "background": function (matched) {
                if (matched) {
                  if (matched.length) {
                    var e = matched[1];
                    if (e) {
                      e = e.toLowerCase();
                      /*  */
                      if (e.indexOf("--") !== -1) return true;
                      /*  */
                      if (e.indexOf("none") === -1) {
                        if (e.indexOf("unset") === -1) {
                          if (e.indexOf("black") === -1) {
                            if (e.indexOf("url(") === -1) {
                              if (e.indexOf("inherit") === -1) {
                                if (e.indexOf("initial") === -1) {
                                  if (e.indexOf("transparent") === -1) {
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
                  }
                }
                /*  */
                return false;
              }
            }
          }
        }
      }
    }
  };
  
  CSSStyleSheet.prototype.replace = new Proxy(CSSStyleSheet.prototype.replace, {
    apply(target, self, args) {
      let css = args[0];
      if (typeof css === "string") {
        args[0] = _page.action.change.style(css);
      }
      //
      return Reflect.apply(target, self, args);
    }
  });

  CSSStyleSheet.prototype.replaceSync = new Proxy(CSSStyleSheet.prototype.replaceSync, {
    apply(target, self, args) {
      let css = args[0];
      if (typeof css === "string") {
        args[0] = _page.action.change.style(css);
      }
      //
      return Reflect.apply(target, self, args);
    }
  });
}