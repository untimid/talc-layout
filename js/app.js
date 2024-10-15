import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";

const WHATSAPP_PHONE = "+79104256479";

const swipers = new Swiper(".hero-swiper", {
  // configure Swiper to use modules
  spaceBetween: 0,
  loop: true, // infinite loop from
  initialSlide: 1,
  loopAdditionalSlides: 1,
  breakpoints: {
    // when window width is >= 390px
    390: {
      spaceBetween: 8,
    },
  },
  modules: [Navigation, Pagination],
  navigation: {
    nextEl: ".hero-swiper-next",
    prevEl: ".hero-swiper-previous",
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});
const projectSwipers = swipers.filter((swiper) =>
  swiper.el.classList.contains("project-tab")
);

function handleSlideChangeCheck(swiper) {
  // if slide is from same project - return
  const activeProject = swiper.el.dataset["activeproject"];
  const activeSlide = swiper.slides.find((slide) =>
    slide.classList.contains("swiper-slide-active")
  );
  const activeSlideProject = activeSlide.dataset["projectid"];
  if (activeProject === activeSlideProject) return;

  const projectSelectorContainer = swiper.el
    .closest(".projects-block")
    .querySelector(".project-tabs-controls");
  const projectSelectors = projectSelectorContainer.querySelectorAll(
    ".project-tab-selector"
  );
  // if slide is from new project, fire changes
  projectSelectors.forEach((selector) => {
    if (selector.dataset.projectid === activeSlideProject) {
      selector.classList.add("active");
    } else {
      selector.classList.remove("active");
    }
  });
  swiper.el.dataset["activeproject"] = activeSlideProject;
}

projectSwipers.forEach((swiper) => {
  const readyProjects = {};
  const projectSelectorContainer = swiper.el
    .closest(".projects-block")
    .querySelector(".project-tabs-controls");
  // on slide change check if active project tab change
  const slides = swiper.el.querySelectorAll(".swiper-slide");
  swiper.on("slideChangeTransitionEnd", handleSlideChangeCheck);
  slides.forEach((slide, index) => {
    if (index === 0) return;
    const slideProject = slide.dataset["projectid"];
    // set initial active project for slider
    if (index === 1) {
      swiper.el.dataset.activeproject = slideProject;
    }
    if (!readyProjects.hasOwnProperty(slideProject)) {
      // generate button add handler to swipe to current slide
      const projectSelector = document.createElement("button");
      projectSelector.classList =
        index === 1
          ? "filter-link project-tab-selector active"
          : "filter-link project-tab-selector";
      projectSelector.dataset["projectid"] = slideProject;
      // get text from slide headline
      projectSelector.textContent = slide.querySelector("h2").textContent || "";
      const slideId = slideProject;
      slide.dataset["slideid"] = slideId;
      projectSelector.addEventListener("click", (e) => {
        const targetSlide = swiper.slides.findIndex(
          (slide) => slide.dataset["slideid"] === slideId
        );
        swiper.slideTo(targetSlide);
      });
      // insert button to document
      projectSelectorContainer.appendChild(projectSelector);
      readyProjects[slideProject] = slideId;
    }
  });
});

// Handle anchor link navigation
function scrollTo(e) {
  e.preventDefault();
  // e.stopPropagation();
  const elementId = e.target.dataset.scrollto;
  const targetEl = document.getElementById(elementId);
  window.scrollTo(0, targetEl.offsetTop - 45);
}
// add listeners to portfolio blocks links and menu links
document.querySelectorAll(".custom-anchor-link").forEach((anchorLink) => {
  anchorLink.addEventListener("click", scrollTo);
});

// CTA click handler
function handleCTAClick(e) {
  e.preventDefault();
  e.stopPropagation();
  const projectsBlock = e.target.closest(".projects-block");
  const activeProject = projectsBlock.querySelector(
    ".project-tab-selector.active"
  );
  const projectName = activeProject?.textContent.trim() || null;
  const contactLink = projectName
    ? `https://wa.me/${WHATSAPP_PHONE}?text=Здравствуйте, расскажите пожалуйста подробнее о проекте "${projectName}"`
    : `https://wa.me/${WHATSAPP_PHONE}?text=Здравствуйте, расскажите пожалуйста подробнее о ваших услугах"`;
  window.open(contactLink, "_blank");
}

const ctaButtons = document.querySelectorAll(".project-button");
ctaButtons.forEach((button) =>
  button.addEventListener("click", handleCTAClick)
);

// HANDLING POPUP MENU
const menu = document.querySelector("#mobile-menu");
const body = document.querySelector("body");
const menuItems = document.querySelectorAll(".popup-menu-item");
const hamburger = document.querySelector(".hamburger-button");
const closeIcon = document.querySelector(".popup-menu-cross-button");

function toggleMenu() {
  if (menu.classList.contains("popup-menu-visible")) {
    menu.classList.add("popup-menu-hidden");
    menu.classList.remove("popup-menu-visible");
    body.classList.remove("freeze-body");
  } else {
    menu.classList.add("popup-menu-visible");
    body.classList.add("freeze-body");
    menu.classList.remove("popup-menu-hidden");
  }
}
closeIcon.addEventListener("click", toggleMenu);
hamburger.addEventListener("click", toggleMenu);
menuItems.forEach(function (menuItem) {
  menuItem.addEventListener("click", toggleMenu);
});

// SPOILER LOGIC
// to use spoiler can add 'spoiler' class to div and data-maxheight attr
const CLOSED_TEXT = "Показать еще проекты";
const OPENED_TEXT = "Свернуть";
const CLOSED_CLASS = "spoiler-closed";
const LIMITS = {
  mobile: 150,
  desk: 100,
};
// if height of element greater than MAX_HEIGHT, cut with spoiler
const spoilers = document.querySelectorAll(".spoiler");
spoilers.forEach((spoiler) => {
  const isActiveOnMobile =
    screen.width < 768 && spoiler.offsetHeight > LIMITS.mobile;
  const isActiveOnDesktop =
    screen.width >= 768 && spoiler.offsetHeight > LIMITS.mobile;
  if (isActiveOnMobile || isActiveOnDesktop) {
    if (!spoiler.classList.contains(CLOSED_CLASS)) {
      spoiler.classList.add(CLOSED_CLASS);
    }
    const spoilerActivator = document.createElement("button");
    const spoilerBottomOverlay = document.createElement("div");
    spoilerActivator.textContent = CLOSED_TEXT;
    spoilerBottomOverlay.classList = `spoiler-overlay ${CLOSED_CLASS}`;
    spoilerActivator.classList = `spoiler-activator  ${CLOSED_CLASS}`;
    spoilerActivator.addEventListener("click", (e) => toggleSpoiler(e));
    spoiler.appendChild(spoilerBottomOverlay);
    spoiler.appendChild(spoilerActivator);
  }
});

function toggleSpoiler(e) {
  const toggler = e.target;
  const spoiler = toggler.closest(".spoiler");
  if (spoiler.classList.contains(CLOSED_CLASS)) {
    spoiler.classList.remove(CLOSED_CLASS);
    toggler.classList.remove(CLOSED_CLASS);
    toggler.textContent = OPENED_TEXT;
  } else {
    spoiler.classList.add(CLOSED_CLASS);
    toggler.classList.add(CLOSED_CLASS);
    toggler.textContent = CLOSED_TEXT;
  }
}
