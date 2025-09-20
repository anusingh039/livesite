var ticking = false;
var isFirefox = /Firefox/i.test(navigator.userAgent);
var isIe =
  /MSIE/i.test(navigator.userAgent) ||
  /Trident.*rv\:11\./i.test(navigator.userAgent);
var scrollSensitivitySetting = 30;
var slideDurationSetting = 800;
var currentSlideNumber = 0;
var totalSlideNumber = $(".background").length;
function parallaxScroll(evt) {
  if (isFirefox) {
    delta = evt.detail * -120;
  } else if (isIe) {
    delta = -evt.deltaY;
  } else {
    delta = evt.wheelDelta;
  }
  if (ticking != true) {
    if (delta <= -scrollSensitivitySetting) {
      ticking = true;
      if (currentSlideNumber !== totalSlideNumber - 1) {
        currentSlideNumber++;
        nextItem();
      }
      slideDurationTimeout(slideDurationSetting);
    }
    if (delta >= scrollSensitivitySetting) {
      ticking = true;
      if (currentSlideNumber !== 0) {
        currentSlideNumber--;
      }
      previousItem();
      slideDurationTimeout(slideDurationSetting);
    }
  }
}
function slideDurationTimeout(slideDuration) {
  setTimeout(function () {
    ticking = false;
  }, slideDuration);
}
var mousewheelEvent = isFirefox ? "DOMMouseScroll" : "wheel";
window.addEventListener(mousewheelEvent, _.throttle(parallaxScroll, 60), false);
function nextItem() {
  var $previousSlide = $(".background").eq(currentSlideNumber - 1);
  $previousSlide
    .css("transform", "translate3d(0,-130vh,0)")
    .find(".content-wrapper")
    .css("transform", "translateY(40vh)");
  currentSlideTransition();
}
function previousItem() {
  var $previousSlide = $(".background").eq(currentSlideNumber + 1);
  $previousSlide
    .css("transform", "translate3d(0,30vh,0)")
    .find(".content-wrapper")
    .css("transform", "translateY(30vh)");
  currentSlideTransition();
}
function currentSlideTransition() {
  var $currentSlide = $(".background").eq(currentSlideNumber);
  $currentSlide
    .css("transform", "translate3d(0,-15vh,0)")
    .find(".content-wrapper")
    .css("transform", "translateY(15vh)");
}

// Improved ID-based navigation: map nav IDs to actual .background section indexes
$(document).ready(function () {
  // Only include the 5 sections you want to navigate
  var navSectionIds = ["homepage", "aboutpage", "productspage", "faqpage", "contactpage"];
  // Build a mapping from navSectionIds to their index in the DOM
  var backgroundSections = $(".background");
  var idToIndex = {};
  backgroundSections.each(function (i, el) {
    var id = $(el).attr("id");
    if (navSectionIds.includes(id)) {
      idToIndex[id] = i;
    }
  });

  $(".navbar-nav a, .d-flex a[href^='#']").on("click", function (e) {
    var targetId = $(this).attr("href").replace("#", "");
    // If on mobile (parallax disabled), allow default anchor scroll
    if (window.innerWidth <= 991) {
      // Let browser handle anchor navigation
      return;
    }
    // Desktop: use parallax slide logic
    if (idToIndex.hasOwnProperty(targetId)) {
      e.preventDefault();
      var targetIndex = idToIndex[targetId];
      if (targetIndex > currentSlideNumber) {
        while (currentSlideNumber < targetIndex) {
          currentSlideNumber++;
          nextItem();
        }
      } else if (targetIndex < currentSlideNumber) {
        while (currentSlideNumber > targetIndex) {
          currentSlideNumber--;
          previousItem();
        }
      }
    }
  });
});