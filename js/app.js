import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";

const WHATSAPP_PHONE = "+79104256479";

const swipers = new Swiper(".hero-swiper", {
  // configure Swiper to use modules
  spaceBetween: 0,
  loop: true, // infinite loop from
  initialSlide: 1,
  loopAdditionalSlides: 3,
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

function openTab(
  tabId,
  tabClass,
  elementActivator,
  elementActivatorClass,
  closeSiblings = true
) {
  const targetTab = document.getElementById(tabId);
  if (!targetTab) {
    console.warn("укажите id для выбора проекта");
    return;
  }
  const tabs =
    [...targetTab.parentNode.childNodes].filter((node) =>
      node?.classList?.contains(tabClass)
    ) || [];
  tabs.forEach((tab) => {
    // if got active class, remove it
    if (closeSiblings && tab.id !== tabId && tab.classList.contains("active")) {
      tab.classList.remove("active");
    }
    // if got same id as target, set active class
    if (tab.id === tabId) {
      if (!tab.classList.contains("active")) {
        tab.classList.add("active");
      }
      // reset buttons active status
      const buttons = [...elementActivator.parentNode.childNodes].filter((el) =>
        el?.classList?.contains(elementActivatorClass)
      );
      buttons.forEach((button) => {
        if (button?.classList?.contains("active")) {
          button.classList.remove("active");
        }
      });
      // set new active button after changing tab success
      elementActivator.classList.add("active");
    }
  });
}

// handle tab selectors for project types
const PORTFOLIO_OPTIONS = {
  all: ["banyas", "saunas", "hammams", "camins"],
  banyas: ["banyas"],
  saunas: ["saunas"],
  hammams: ["hammams"],
  camins: ["camins"],
};
// on switch we should:
// - sync filter and selector
// - if "all" selected, activate all tabs
// - if explicit tab selected, activate it
const portfolioSelector = document.getElementById("filter-select");
const options = [...portfolioSelector.options];
options.forEach((option) =>
  option.addEventListener("click", (e) => {
    const value = e.target.value;
    const selectors = [...document.querySelectorAll(".portfolio-tab-selector")];
    const targetSelector = selectors.find((sel) => sel.dataset.tabid === value);
    targetSelector.click();
  })
);

document.querySelectorAll(".portfolio-tab-selector")?.forEach((button) => {
  const option = button.dataset.tabid;
  if (PORTFOLIO_OPTIONS.hasOwnProperty(option)) {
    button.addEventListener("click", (e) => {
      // sync with select
      console.log(e);
      const mobileSelect = document.getElementById("filter-select");
      const mobileOption = [...mobileSelect.options]?.find(
        (op) => op.value === option
      );
      const optionIndex = mobileOption.index || 0;
      const customOption = mobileSelect
        .closest(".custom-select")
        .querySelectorAll(`[data-index="${optionIndex}"]`);
      customOption?.[0]?.click();

      PORTFOLIO_OPTIONS[option].forEach((op) => {
        option === "all"
          ? openTab(
              op,
              "portfolio-tab",
              e.target,
              "portfolio-tab-selector",
              false
            )
          : openTab(op, "portfolio-tab", e.target, "portfolio-tab-selector");
      });
    });
  }
});

// HANDLING POPUP MENU
const menu = document.querySelector("#mobile-menu");
const body = document.querySelector("body");
const menuItems = document.querySelectorAll(".popup-menu-item");
const hamburger = document.querySelector(".hamburger-button");
const closeIcon = document.querySelector(".popup-menu-cross-button");

/* If the user clicks anywhere outside the select box,
then close all select boxes: */
document.addEventListener("click", closeAllSelect);

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

// CUSTOM SELECT LOGIC
let customSelectsArr,
  htmlSelect,
  selectedOption,
  customOptionsContainer,
  customOption;
/* Look for any elements with the class "custom-select": */
customSelectsArr = document.getElementsByClassName("custom-select");

for (let i = 0; i < customSelectsArr.length; i++) {
  htmlSelect = customSelectsArr[i].getElementsByTagName("select")[0];
  /* For each element, create a new DIV that will act as the selected item: */
  selectedOption = document.createElement("DIV");
  selectedOption.setAttribute("class", "select-selected");
  selectedOption.innerHTML =
    htmlSelect.options[htmlSelect.selectedIndex].innerHTML;
  customSelectsArr[i].appendChild(selectedOption);
  /* For each element, create a new DIV that will contain the option list: */
  customOptionsContainer = document.createElement("DIV");
  customOptionsContainer.setAttribute("class", "select-items select-hide");
  for (let j = 0; j < htmlSelect.length; j++) {
    /* For each option in the original select element,
    create a new DIV that will act as an option item: */
    customOption = document.createElement("DIV");
    customOption.innerHTML = htmlSelect.options[j].innerHTML;
    customOption.dataset.index = j;

    customOptionsContainer.appendChild(customOption);

    customOption.addEventListener("click", function (e) {
      const targetEl = e.target;
      /* When an item is clicked, update the original select box,
        and the selected item: */
      let y, k, htmlSelectUpdate, customSelectedOption, yl;
      htmlSelectUpdate =
        targetEl.parentNode.parentNode.getElementsByTagName("select")[0];

      let optionsAmount = htmlSelectUpdate.length;

      customSelectedOption = targetEl.parentNode.previousSibling;
      for (let i = 0; i < optionsAmount; i++) {
        if (htmlSelectUpdate.options[i].innerHTML == targetEl.innerHTML) {
          htmlSelectUpdate.selectedIndex = i;
          htmlSelectUpdate[i].click();
          customSelectedOption.innerHTML = targetEl.innerHTML;
          y = targetEl.parentNode.getElementsByClassName("same-as-selected");
          yl = y.length;
          for (k = 0; k < yl; k++) {
            y[k].removeAttribute("class");
          }
          targetEl.setAttribute("class", "same-as-selected");
          break;
        }
      }
      customSelectedOption.click();
    });
  }
  customSelectsArr[i].appendChild(customOptionsContainer);

  selectedOption.addEventListener("click", function (e) {
    /* When the select box is clicked, close any other select boxes,
    and open/close the current select box: */
    const targetEl = e.target;
    e.stopPropagation();
    closeAllSelect(targetEl);
    targetEl.nextSibling.classList.toggle("select-hide");
    targetEl.classList.toggle("select-arrow-active");
  });
}

function closeAllSelect(elmnt) {
  /* A function that will close all select boxes in the document,
  except the current select box: */
  var x,
    y,
    i,
    xl,
    yl,
    arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  xl = x.length;
  yl = y.length;
  for (i = 0; i < yl; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i);
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < xl; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}

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
