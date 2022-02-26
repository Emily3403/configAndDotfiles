var website = {
  "total": {
    "themes": {
      "number": 41
    }
  },
  "theme": {
    "number": {
      "custom": 38,
      "native": 41,
      "active": null
    }
  },
  "exclude": {
    "from": {
      "custom": {
        "dark": {
          "mode": [
            "maps",
            "amazon",
            "youtube",
            "facebook"
          ]
        }
      }
    }
  },
  "custom": {
    "native": {
      "css": `
        html, body {
          color: #dcdcdc;
          background-color: #292929;
        }

        html *:not(input) {
          color: #dcdcdc !important;
        }
        
        a[ping]:link,
        :link:not(cite) {
          color: #8db2e5 !important;
        }
        
        html a:visited {
          color: #d248ea !important;
        }
        
        html cite,
        html cite a:link,
        html cite a:visited {
          color: #92de92 !important;
        }

        /* inline styles */

        [style*='background: #'], [style*='background:#'],
        [style*='background: rgb'], [style*='background:rgb'],
        [style*='background: var('], [style*='background:var('],
        [style*='background-color: #'], [style*='background-color:#'],
        [style*='background-color: rgb'], [style*='background-color:rgb'],
        [style*='background-color: var('], [style*='background-color:var('] {
          background-color: #292929 !important;
        }
      `
    },
    "regex": {
      "rules": {
        "twitch": "^http(s)?\:\/\/(www\.)?twitch\.tv",
        "bing": "^http(s)?\:\/\/(www\.)?bing\.([a-zA-Z]+)",
        "reddit": "^http(s)?\:\/\/(www\.)?reddit\.([a-zA-Z]+)",
        "amazon": "^http(s)?\:\/\/(www\.)?amazon\.([a-zA-Z]+)",
        "github": "^http(s)?\:\/\/(www\.)?github\.([a-zA-Z]+)",
        "tumblr": "^http(s)?\:\/\/(www\.)?tumblr\.([a-zA-Z]+)",
        "youtube": "^http(s)?\:\/\/(www\.)?youtube\.([a-zA-Z]+)",
        "dropbox": "^http(s)?\:\/\/(www\.)?dropbox\.([a-zA-Z]+)",
        "twitter": "^http(s)?\:\/\/(www\.)?twitter\.([a-zA-Z]+)",
        "ebay": "^http(s)?\:\/\/([a-zA-Z.]*\.)?ebay\.([a-zA-Z]+)",
        "play": "^http(s)?\:\/\/(www\.)?play\.google\.([a-zA-Z]+)",
        "facebook": "^http(s)?\:\/\/(www\.)?facebook\.([a-zA-Z]+)",
        "maps": "^http(s)?\:\/\/(www\.)?google\.([a-zA-Z]+)\/maps",
        "docs": "^http(s)?\:\/\/(www\.)?docs\.google\.([a-zA-Z]+)",
        "wikipedia": "^http(s)?\:\/\/([a-zA-Z.]*\.)?wikipedia\.org",
        "yahoo": "^http(s)?\:\/\/([a-zA-Z.]*\.)?yahoo\.([a-zA-Z]+)",
        "gmail": "^http(s)?\:\/\/(www\.)?mail\.google\.([a-zA-Z]+)",
        "drive": "^http(s)?\:\/\/(www\.)?drive\.google\.([a-zA-Z]+)",
        "sites": "^http(s)?\:\/\/(www\.)?sites\.google\.([a-zA-Z]+)",
        "instagram": "^http(s)?\:\/\/(www\.)?instagram\.([a-zA-Z]+)",
        "w3schools": "^http(s)?\:\/\/(www\.)?w3schools\.([a-zA-Z]+)",
        "yandex": "^http(s)?\:\/\/([a-zA-Z.]*\.)?yandex\.([a-zA-Z]+)",
        "duckduckgo": "^http(s)?\:\/\/(www\.)?duckduckgo\.([a-zA-Z]+)",
        "telegram": "^http(s)?\:\/\/(www\.)?web\.telegram\.([a-zA-Z]+)",
        "whatsapp": "^http(s)?\:\/\/(www\.)?web\.whatsapp\.([a-zA-Z]+)",
        "support": "^http(s)?\:\/\/(www\.)?support\.google\.([a-zA-Z]+)",
        "accounts": "^http(s)?\:\/\/(www\.)?accounts\.google\.([a-zA-Z]+)",
        "myaccount": "^http(s)?\:\/\/(www\.)?myaccount\.google\.([a-zA-Z]+)",
        "stackoverflow": "^http(s)?\:\/\/(www\.)?stackoverflow\.([a-zA-Z]+)",
        "translate": "^http(s)?\:\/\/(www\.)?translate\.google\.([a-zA-Z]+)",
        "google": "^http(s)?\:\/\/(www\.)?google\.([a-zA-Z]+)\/(search|travel|flights)"
      }
    }
  }
};