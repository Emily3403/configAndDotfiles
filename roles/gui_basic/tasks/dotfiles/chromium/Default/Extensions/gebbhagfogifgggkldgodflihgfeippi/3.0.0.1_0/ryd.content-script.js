/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./Extensions/combined/src/utils.js


function roundDown(num) {
  if (num < 1000) return num;
  const int = Math.floor(Math.log10(num) - 2);
  const decimal = int + (int % 3 ? 1 : 0);
  const value = Math.floor(num / 10 ** decimal);
  return value * 10 ** decimal;
}

function numberFormat(numberState) {
  let userLocales;
  try {
    userLocales = new URL(
      Array.from(document.querySelectorAll("head > link[rel='search']"))
        ?.find((n) => n?.getAttribute("href")?.includes("?locale="))
        ?.getAttribute("href")
    )?.searchParams?.get("locale");
  } catch {}

  let numberDisplay;
  if (extConfig.numberDisplayRoundDown === false) {
    numberDisplay = numberState;
  } else {
    numberDisplay = roundDown(numberState);
  }
  return getNumberFormatter(extConfig.numberDisplayFormat).format(
    numberDisplay
  );
}

function localize(localeString) {
  return chrome.i18n.getMessage(localeString);
}

function getNumberFormatter(optionSelect) {
  let formatterNotation;
  let formatterCompactDisplay;
  let userLocales;
  try {
    userLocales = new URL(
      Array.from(document.querySelectorAll("head > link[rel='search']"))
      ?.find((n) => n?.getAttribute("href")?.includes("?locale="))
      ?.getAttribute("href")
    )?.searchParams?.get("locale");
  } catch {}

  switch (optionSelect) {
    case "compactLong":
      formatterNotation = "compact";
      formatterCompactDisplay = "long";
      break;
    case "standard":
      formatterNotation = "standard";
      formatterCompactDisplay = "short";
      break;
    case "compactShort":
    default:
      formatterNotation = "compact";
      formatterCompactDisplay = "short";
  }

  const formatter = Intl.NumberFormat(
    document.documentElement.lang || userLocales || navigator.language,
    {
      notation: formatterNotation,
      compactDisplay: formatterCompactDisplay,
    }
  );
  return formatter;
}

function getBrowser() {
  if (typeof chrome !== "undefined" && typeof chrome.runtime !== "undefined") {
    return chrome;
  } else if (
    typeof browser !== "undefined" &&
    typeof browser.runtime !== "undefined"
  ) {
    return browser;
  } else {
    console.log("browser is not supported");
    return false;
  }
}

function getVideoId(url) {
  const urlObject = new URL(url);
  const pathname = urlObject.pathname;
  if (pathname.startsWith("/clip")) {
    return document.querySelector("meta[itemprop='videoId']").content;
  } else {
    if (pathname.startsWith("/shorts")) {
      return pathname.slice(8);
    }
    return urlObject.searchParams.get("v");
  }
}

function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  const height = innerHeight || document.documentElement.clientHeight;
  const width = innerWidth || document.documentElement.clientWidth;
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= height &&
    rect.right <= width
  );
}

function isVideoLoaded() {
  const videoId = getVideoId(window.location.href);
  return (
    document.querySelector(`ytd-watch-flexy[video-id='${videoId}']`) !== null ||
    // mobile: no video-id attribute
    document.querySelector('#player[loading="false"]:not([hidden])') !== null
  );
}

function cLog(message, writer) {
  message = `[return youtube dislike]: ${message}`;
  if (writer) {
    writer(message);
  } else {
    console.log(message);
  }
}

function getColorFromTheme(voteIsLike) {
  let colorString;
  switch (extConfig.colorTheme) {
    case "accessible":
      if (voteIsLike === true) {
        colorString = "dodgerblue";
      } else {
        colorString = "gold";
      }
      break;
    case "neon":
      if (voteIsLike === true) {
        colorString = "aqua";
      } else {
        colorString = "magenta";
      }
      break;
    case "classic":
    default:
      if (voteIsLike === true) {
        colorString = "lime";
      } else {
        colorString = "red";
      }
  }
  return colorString;
}



;// CONCATENATED MODULE: ./Extensions/combined/src/bar.js




function createRateBar(likes, dislikes) {
  if (!isLikesDisabled()) {
    let rateBar = document.getElementById("ryd-bar-container");

    const widthPx =
      getButtons().children[0].clientWidth +
      getButtons().children[1].clientWidth +
      8;

    const widthPercent =
      likes + dislikes > 0 ? (likes / (likes + dislikes)) * 100 : 50;

    if (!rateBar && !isMobile()) {
      let colorLikeStyle = "";
      let colorDislikeStyle = "";
      if (extConfig.coloredBar) {
        colorLikeStyle = "; background-color: " + getColorFromTheme(true);
        colorDislikeStyle = "; background-color: " + getColorFromTheme(false);
      }

      (
        document.getElementById("menu-container") ||
        document.querySelector("ytm-slim-video-action-bar-renderer")
      ).insertAdjacentHTML(
        "beforeend",
        `
            <div class="ryd-tooltip" style="width: ${widthPx}px">
            <div class="ryd-tooltip-bar-container">
               <div
                  id="ryd-bar-container"
                  style="width: 100%; height: 2px;${colorDislikeStyle}"
                  >
                  <div
                     id="ryd-bar"
                     style="width: ${widthPercent}%; height: 100%${colorLikeStyle}"
                     ></div>
               </div>
            </div>
            <tp-yt-paper-tooltip position="top" id="ryd-dislike-tooltip" class="style-scope ytd-sentiment-bar-renderer" role="tooltip" tabindex="-1">
               <!--css-build:shady-->${likes.toLocaleString()}&nbsp;/&nbsp;${dislikes.toLocaleString()}
            </tp-yt-paper-tooltip>
            </div>
    `
      );
    } else {
      document.getElementById("ryd-bar-container").style.width = widthPx + "px";
      document.getElementById("ryd-bar").style.width = widthPercent + "%";
      document.querySelector(
        "#ryd-dislike-tooltip > #tooltip"
      ).innerHTML = `${likes.toLocaleString()}&nbsp;/&nbsp;${dislikes.toLocaleString()}`;
      if (extConfig.coloredBar) {
        document.getElementById("ryd-bar-container").style.backgroundColor =
          getColorFromTheme(false);
        document.getElementById("ryd-bar").style.backgroundColor =
          getColorFromTheme(true);
      }
    }
  } else {
    cLog("removing bar");
    let ratebar = document.getElementById("ryd-bar-container");
    if(ratebar) {
      ratebar.parentNode.removeChild(ratebar);
    }
  }
}



;// CONCATENATED MODULE: ./Extensions/combined/src/state.js





//TODO: Do not duplicate here and in ryd.background.js
const apiUrl = "https://returnyoutubedislikeapi.com";
const LIKED_STATE = "LIKED_STATE";
const DISLIKED_STATE = "DISLIKED_STATE";
const NEUTRAL_STATE = "NEUTRAL_STATE";

let extConfig = {
  disableVoteSubmission: false,
  coloredThumbs: false,
  coloredBar: false,
  colorTheme: "classic",
  numberDisplayFormat: "compactShort",
  numberDisplayRoundDown: true,
  numberDisplayReformatLikes: false,
};

let storedData = {
  likes: 0,
  dislikes: 0,
  previousState: NEUTRAL_STATE,
};

function isMobile() {
  return location.hostname == "m.youtube.com";
}

function isShorts() {
  return location.pathname.startsWith("/shorts");
}

let mutationObserver = new Object();

if (isShorts() && mutationObserver.exists !== true) {
  cLog("initializing mutation observer");
  mutationObserver.options = {
    childList: false,
    attributes: true,
    subtree: false,
  };
  mutationObserver.exists = true;
  mutationObserver.observer = new MutationObserver(function (
    mutationList,
    observer
  ) {
    mutationList.forEach((mutation) => {
      if (
        mutation.type === "attributes" &&
        mutation.target.nodeName === "TP-YT-PAPER-BUTTON" &&
        mutation.target.id === "button"
      ) {
        // cLog('Short thumb button status changed');
        if (mutation.target.getAttribute("aria-pressed") === "true") {
          mutation.target.style.color =
            mutation.target.parentElement.parentElement.id === "like-button"
              ? getColorFromTheme(true)
              : getColorFromTheme(false);
        } else {
          mutation.target.style.color = "unset";
        }
        return;
      }
      cLog(
        "unexpected mutation observer event: " + mutation.target + mutation.type
      );
    });
  });
}

function isLikesDisabled() {
  // return true if the like button's text doesn't contain any number
  if (isMobile()) {
    return /^\D*$/.test(
      getButtons().children[0].querySelector(".button-renderer-text").innerText
    );
  }
  return /^\D*$/.test(
    getButtons().children[0].querySelector("#text").innerText
  );
}

function isVideoLiked() {
  if (isMobile()) {
    return (
      getLikeButton().querySelector("button").getAttribute("aria-label") ==
      "true"
    );
  }
  return getLikeButton().classList.contains("style-default-active");
}

function isVideoDisliked() {
  if (isMobile()) {
    return (
      getDislikeButton().querySelector("button").getAttribute("aria-label") ==
      "true"
    );
  }
  return getDislikeButton().classList.contains("style-default-active");
}

function getState(storedData) {
  if (isVideoLiked()) {
    return { current: LIKED_STATE, previous: storedData.previousState };
  }
  if (isVideoDisliked()) {
    return { current: DISLIKED_STATE, previous: storedData.previousState };
  }
  return { current: NEUTRAL_STATE, previous: storedData.previousState };
}

//---   Sets The Likes And Dislikes Values   ---//
function setLikes(likesCount) {
  getButtons().children[0].querySelector("#text").innerText = likesCount;
}

function setDislikes(dislikesCount) {
  if (!isLikesDisabled()) {
    if (isMobile()) {
      getButtons().children[1].querySelector(
        ".button-renderer-text"
      ).innerText = dislikesCount;
      return;
    }
    getButtons().children[1].querySelector("#text").innerText = dislikesCount;
  } else {
    cLog("likes count disabled by creator");
    if (isMobile()) {
      getButtons().children[1].querySelector(
        ".button-renderer-text"
      ).innerText = localize("TextLikesDisabled");
      return;
    }
    getButtons().children[1].querySelector("#text").innerText =
      localize("TextLikesDisabled");
  }
}

function getLikeCountFromButton() {
  if (isShorts()) {
    //Youtube Shorts don't work with this query. It's not nessecary; we can skip it and still see the results.
    //It should be possible to fix this function, but it's not critical to showing the dislike count.
    return 0;
  }
  let likesStr = getLikeButton()
    .querySelector("button")
    .getAttribute("aria-label")
    .replace(/\D/g, "");
  return likesStr.length > 0 ? parseInt(likesStr) : false;
}

function processResponse(response, storedData) {
  const formattedDislike = numberFormat(response.dislikes);
  setDislikes(formattedDislike);
  if (extConfig.numberDisplayReformatLikes === true) {
    const nativeLikes = getLikeCountFromButton();
    if (nativeLikes !== false) {
      setLikes(numberFormat(nativeLikes));
    }
  }
  storedData.dislikes = parseInt(response.dislikes);
  storedData.likes = getLikeCountFromButton() || parseInt(response.likes);
  createRateBar(storedData.likes, storedData.dislikes);
  if (extConfig.coloredThumbs === true) {
    if (isShorts()) {
      // for shorts, leave deactived buttons in default color
      let shortLikeButton = getLikeButton().querySelector(
        "tp-yt-paper-button#button"
      );
      let shortDislikeButton = getDislikeButton().querySelector(
        "tp-yt-paper-button#button"
      );
      if (shortLikeButton.getAttribute("aria-pressed") === "true") {
        shortLikeButton.style.color = getColorFromTheme(true);
      }
      if (shortDislikeButton.getAttribute("aria-pressed") === "true") {
        shortDislikeButton.style.color = getColorFromTheme(false);
      }
      mutationObserver.observer.observe(
        shortLikeButton,
        mutationObserver.options
      );
      mutationObserver.observer.observe(
        shortDislikeButton,
        mutationObserver.options
      );
    } else {
      getLikeButton().style.color = getColorFromTheme(true);
      getDislikeButton().style.color = getColorFromTheme(false);
    }
  }
}

// Tells the user if the API is down
function displayError(error) {
  getButtons().children[1].querySelector("#text").innerText = localize(
    "textTempUnavailable"
  );
}

async function setState(storedData) {
  storedData.previousState = isVideoDisliked()
    ? DISLIKED_STATE
    : isVideoLiked()
    ? LIKED_STATE
    : NEUTRAL_STATE;
  let statsSet = false;

  let videoId = getVideoId(window.location.href);
  let likeCount = getLikeCountFromButton() || null;

  let response = await fetch(
    `${apiUrl}/votes?videoId=${videoId}&likeCount=${likeCount || ""}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  )
    .then((response) => {
      if (!response.ok) displayError(response.error);
      return response;
    })
    .then((response) => response.json())
    .catch(displayError);
  cLog("response from api:");
  cLog(JSON.stringify(response));
  if (response !== undefined && !("traceId" in response) && !statsSet) {
    processResponse(response, storedData);
  }
}

function setInitialState() {
  setState(storedData);
}

function initExtConfig() {
  initializeDisableVoteSubmission();
  initializeColoredThumbs();
  initializeColoredBar();
  initializeColorTheme();
  initializeNumberDisplayFormat();
  initializeNumberDisplayRoundDown();
  initializeNumberDisplayReformatLikes();
}

function initializeDisableVoteSubmission() {
  getBrowser().storage.sync.get(["disableVoteSubmission"], (res) => {
    if (res.disableVoteSubmission === undefined) {
      getBrowser().storage.sync.set({ disableVoteSubmission: false });
    } else {
      extConfig.disableVoteSubmission = res.disableVoteSubmission;
    }
  });
}

function initializeColoredThumbs() {
  getBrowser().storage.sync.get(["coloredThumbs"], (res) => {
    if (res.coloredThumbs === undefined) {
      getBrowser().storage.sync.set({ coloredThumbs: false });
    } else {
      extConfig.coloredThumbs = res.coloredThumbs;
    }
  });
}

function initializeColoredBar() {
  getBrowser().storage.sync.get(["coloredBar"], (res) => {
    if (res.coloredBar === undefined) {
      getBrowser().storage.sync.set({ coloredBar: false });
    } else {
      extConfig.coloredBar = res.coloredBar;
    }
  });
}

function initializeNumberDisplayRoundDown() {
  getBrowser().storage.sync.get(["numberDisplayRoundDown"], (res) => {
    if (res.numberDisplayRoundDown === undefined) {
      getBrowser().storage.sync.set({ numberDisplayRoundDown: true });
    } else {
      extConfig.numberDisplayRoundDown = res.numberDisplayRoundDown;
    }
  });
}

function initializeColorTheme() {
  getBrowser().storage.sync.get(["colorTheme"], (res) => {
    if (res.colorTheme === undefined) {
      getBrowser().storage.sync.set({ colorTheme: false });
    } else {
      extConfig.colorTheme = res.colorTheme;
    }
  });
}

function initializeNumberDisplayFormat() {
  getBrowser().storage.sync.get(["numberDisplayFormat"], (res) => {
    if (res.numberDisplayFormat === undefined) {
      getBrowser().storage.sync.set({ numberDisplayFormat: "compactShort" });
    } else {
      extConfig.numberDisplayFormat = res.numberDisplayFormat;
    }
  });
}

function initializeNumberDisplayReformatLikes() {
  getBrowser().storage.sync.get(["numberDisplayReformatLikes"], (res) => {
    if (res.numberDisplayReformatLikes === undefined) {
      getBrowser().storage.sync.set({ numberDisplayReformatLikes: false });
    } else {
      extConfig.numberDisplayReformatLikes = res.numberDisplayReformatLikes;
    }
  });
}



;// CONCATENATED MODULE: ./Extensions/combined/src/buttons.js



function getButtons() {
  //---   If Watching Youtube Shorts:   ---//
  if (isShorts()) {
    let elements = document.querySelectorAll(
      isMobile()
        ? "ytm-like-button-renderer"
        : "#like-button > ytd-like-button-renderer"
    );
    for (let element of elements) {
      //Youtube Shorts can have multiple like/dislike buttons when scrolling through videos
      //However, only one of them should be visible (no matter how you zoom)
      if (isInViewport(element)) {
        return element;
      }
    }
  }
  //---   If Watching On Mobile:   ---//
  if (isMobile()) {
    return document.querySelector(".slim-video-action-bar-actions");
  }
  //---   If Menu Element Is Displayed:   ---//
  if (document.getElementById("menu-container")?.offsetParent === null) {
    return document.querySelector("ytd-menu-renderer.ytd-watch-metadata > div");
    //---   If Menu Element Isnt Displayed:   ---//
  } else {
    return document
      .getElementById("menu-container")
      ?.querySelector("#top-level-buttons-computed");
  }
}

function getLikeButton() {
  return getButtons().children[0];
}

function getDislikeButton() {
  return getButtons().children[1];
}

function checkForSignInButton() {
  if (
    document.querySelector(
      "a[href^='https://accounts.google.com/ServiceLogin']"
    )
  ) {
    return true;
  } else {
    return false;
  }
}



;// CONCATENATED MODULE: ./Extensions/combined/src/events.js





function sendVote(vote) {
  if (extConfig.disableVoteSubmission !== true) {
    getBrowser().runtime.sendMessage({
      message: "send_vote",
      vote: vote,
      videoId: getVideoId(window.location.href),
    });
  }
}

function likeClicked() {
  if (checkForSignInButton() === false) {
    if (storedData.previousState === DISLIKED_STATE) {
      sendVote(1);
      if (storedData.dislikes > 0) storedData.dislikes--;
      storedData.likes++;
      createRateBar(storedData.likes, storedData.dislikes);
      setDislikes(numberFormat(storedData.dislikes));
      storedData.previousState = LIKED_STATE;
    } else if (storedData.previousState === NEUTRAL_STATE) {
      sendVote(1);
      storedData.likes++;
      createRateBar(storedData.likes, storedData.dislikes);
      storedData.previousState = LIKED_STATE;
    } else if ((storedData.previousState = LIKED_STATE)) {
      sendVote(0);
      if (storedData.likes > 0) storedData.likes--;
      createRateBar(storedData.likes, storedData.dislikes);
      storedData.previousState = NEUTRAL_STATE;
    }
  }
}

function dislikeClicked() {
  if (checkForSignInButton() == false) {
    if (storedData.previousState === NEUTRAL_STATE) {
      sendVote(-1);
      storedData.dislikes++;
      setDislikes(numberFormat(storedData.dislikes));
      createRateBar(storedData.likes, storedData.dislikes);
      storedData.previousState = DISLIKED_STATE;
    } else if (storedData.previousState === DISLIKED_STATE) {
      sendVote(0);
      if (storedData.dislikes > 0) storedData.dislikes--;
      setDislikes(numberFormat(storedData.dislikes));
      createRateBar(storedData.likes, storedData.dislikes);
      storedData.previousState = NEUTRAL_STATE;
    } else if (storedData.previousState === LIKED_STATE) {
      sendVote(-1);
      if (storedData.likes > 0) storedData.likes--;
      storedData.dislikes++;
      setDislikes(numberFormat(storedData.dislikes));
      createRateBar(storedData.likes, storedData.dislikes);
      storedData.previousState = DISLIKED_STATE;
    }
  }
}

function addLikeDislikeEventListener() {
  const buttons = getButtons();
  if (!window.returnDislikeButtonlistenersSet) {
    buttons.children[0].addEventListener("click", likeClicked);
    buttons.children[1].addEventListener("click", dislikeClicked);
    buttons.children[0].addEventListener("touchstart", likeClicked);
    buttons.children[1].addEventListener("touchstart", dislikeClicked);
    window.returnDislikeButtonlistenersSet = true;
  }
}

function storageChangeHandler(changes, area) {
  if (changes.disableVoteSubmission !== undefined) {
    handleDisableVoteSubmissionChangeEvent(
      changes.disableVoteSubmission.newValue
    );
  }
  if (changes.coloredThumbs !== undefined) {
    handleColoredThumbsChangeEvent(changes.coloredThumbs.newValue);
  }
  if (changes.coloredBar !== undefined) {
    handleColoredBarChangeEvent(changes.coloredBar.newValue);
  }
  if (changes.colorTheme !== undefined) {
    handleColorThemeChangeEvent(changes.colorTheme.newValue);
  }

  if (changes.numberDisplayRoundDown !== undefined) {
    handleNumberDisplayRoundDownChangeEvent(
      changes.numberDisplayRoundDown.newValue
    );
  }
  if (changes.numberDisplayFormat !== undefined) {
    handleNumberDisplayFormatChangeEvent(changes.numberDisplayFormat.newValue);
  }
  if (changes.numberDisplayReformatLikes !== undefined) {
    handleNumberDisplayReformatLikesChangeEvent(changes.numberDisplayReformatLikes.newValue);
  }
}

function handleDisableVoteSubmissionChangeEvent(value) {
  extConfig.disableVoteSubmission = value;
}

function handleColoredThumbsChangeEvent(value) {
  extConfig.coloredThumbs = value;
}

function handleColoredBarChangeEvent(value) {
  extConfig.coloredBar = value;
}

function handleColorThemeChangeEvent(value) {
  if (!value) value = "classic";
  extConfig.colorTheme = value;
}

function handleNumberDisplayFormatChangeEvent(value) {
  extConfig.numberDisplayFormat = value;
}

function handleNumberDisplayRoundDownChangeEvent(value) {
  extConfig.numberDisplayRoundDown = value;
}

function handleNumberDisplayReformatLikesChangeEvent(value) {
  extConfig.numberDisplayReformatLikes = value;
}



;// CONCATENATED MODULE: ./Extensions/combined/ryd.content-script.js
//---   Import Button Functions   ---//


//---   Import State Functions   ---//


//---   Import Video & Browser Functions   ---//




initExtConfig();

let jsInitChecktimer = null;

function setEventListeners(evt) {
  function checkForJS_Finish() {
    if (isShorts() || (getButtons()?.offsetParent && isVideoLoaded())) {
      addLikeDislikeEventListener();
      setInitialState();
      getBrowser().storage.onChanged.addListener(storageChangeHandler);
      clearInterval(jsInitChecktimer);
      jsInitChecktimer = null;
    }
  }

  jsInitChecktimer = setInterval(checkForJS_Finish, 111);
}

setEventListeners();

document.addEventListener("yt-navigate-finish", function (event) {
  if (jsInitChecktimer !== null) clearInterval(jsInitChecktimer);
  window.returnDislikeButtonlistenersSet = false;
  setEventListeners();
});

/******/ })()
;