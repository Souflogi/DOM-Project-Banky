'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const learnMoreBtn = document.querySelector('.btn--scroll-to');
const header = document.querySelector('.header');
const Section1 = document.querySelector('#section--1');
const navBar = document.querySelector('.nav');
const linksContainer = document.querySelector('.nav__links');
const operationsContainer = document.querySelector('.operations');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => {
  btn.addEventListener('click', openModal);
});

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
// make a button scroll into view

learnMoreBtn.addEventListener('click', () => {
  Section1.scrollIntoView({
    behavior: 'smooth',
  });
});

///////////////////////////////////////
// NAVBAR :  Opacity on mouseover
function ToggleOpacity(event) {
  //this => opacity

  if (!event.target.classList.contains('nav__link')) return;
  const link = event.target;

  //Select Siblings
  const allLinks = link.closest('.nav').querySelectorAll('.nav__link');
  const Siblings = Array.from(allLinks).filter(sibling => sibling !== link);

  //Selecting logo
  const logo = link.closest('.nav').querySelector('img');

  Siblings.forEach(el => (el.style.opacity = this));
  logo.style.opacity = this;
}
navBar.addEventListener('mouseover', ToggleOpacity.bind(0.5));
navBar.addEventListener('mouseout', ToggleOpacity.bind(1));

///////////////////////////////////////
// NAVBAR :  Navigation (Event Propagation)

linksContainer.addEventListener('click', e => {
  e.preventDefault();
  const href = e.target.getAttribute('href');

  if (!href) return;

  document.querySelector(href).scrollIntoView({
    behavior: 'smooth',
  });
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// NAVBAR :  Make the navigation Stick when Scrolling
/* BAAAD! */
// const Section1Cords = Section1.getBoundingClientRect();
// window.addEventListener('scroll', () => {
//   if (window.scrollY > Section1Cords.top) navBar.classList.add('sticky');
//   else navBar.classList.remove('sticky');
// });

// GOOD

const headerObsCallBack = (entries, observer) => {
  //The entries are the element currently intersectioning with the root
  const [headerEntry] = entries;

  if (!headerEntry.isIntersecting) {
    navBar.classList.add('sticky');
  } else navBar.classList.remove('sticky');
};
const headerObsOptions = {
  root: null,
  /* tThe element that is used as the viewport for checking visibility of the target. Must be the ancestor of the target. Defaults to the browser viewport if not specified or if null.*/
  threshold: 0,

  /* Either a single number or an array of numbers which indicate at what percentage of the target's      visibility the observer's callback should be executed
    the callback will tregger when we have 10% visible of the targget inside the root (viewport in this case)
  */
  rootMargin: `-${navBar.clientHeight}px`,
  /*adding a virtual margin to the root not the target (negative margin to the viewport , inset*/
};

const headerObserver = new IntersectionObserver(
  headerObsCallBack,
  headerObsOptions
);
headerObserver.observe(header);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Images Lazy Loading  IntersectionObserver

const ImagesObsCallback = (entries, observer) => {
  const [ImgIntersection] = entries;

  if (!ImgIntersection.isIntersecting) return;

  ImgIntersection.target.src = ImgIntersection.target.dataset.src;

  ImgIntersection.target.addEventListener('load', () => {
    ImgIntersection.target.classList.remove('lazy-img');
  });
  observer.unobserve(ImgIntersection.target);
};

const ImagesObserver = new IntersectionObserver(ImagesObsCallback, {
  root: null,
  threshold: 0.2,
});

document.querySelectorAll('img[data-src]').forEach(lazyImg => {
  ImagesObserver.observe(lazyImg);
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Revealing Sections on Scrolling  IntersectionObserver

const sectionsObsCallback = (entries, observer) => {
  const [SectionIntersection] = entries;

  if (!SectionIntersection.isIntersecting) return;
  SectionIntersection.target.classList.remove('section--hidden');

  observer.unobserve(SectionIntersection.target);
};

const sectionsObserver = new IntersectionObserver(sectionsObsCallback, {
  root: null,
  threshold: 0.15,
});

document.querySelectorAll('section').forEach(section => {
  // hide All sections by default
  section.classList.add('section--hidden');
  //Observe Each Section
  sectionsObserver.observe(section);
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Tabbed Component : Operations
let PreviousTab = 1;
operationsContainer.addEventListener('click', e => {
  const CurrentTab = +e.target.closest('.operations__tab')?.dataset.tab;

  if (!CurrentTab || CurrentTab === PreviousTab) return;

  e.currentTarget
    .querySelector(`.operations__tab--${PreviousTab}`)
    .classList.remove('operations__tab--active');
  e.currentTarget
    .querySelector(`.operations__content--${PreviousTab}`)
    .classList.remove('operations__content--active');

  PreviousTab = CurrentTab;

  e.currentTarget
    .querySelector(`.operations__tab--${CurrentTab}`)
    .classList.add('operations__tab--active');
  e.currentTarget
    .querySelector(`.operations__content--${CurrentTab}`)
    .classList.add('operations__content--active');
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Creating The Slider

const slider = document.querySelector('.slider');
const slideLeftBtn = document.querySelector('.slider__btn--left');
const slideRightBtn = document.querySelector('.slider__btn--right');
const slides = document.querySelectorAll('.slide');
const dotsContainer = document.querySelector('.dots');
let currentSlide = 0;
const slidesAmount = slides.length;

slides.forEach((slide, index) => {
  /* Putting the slides beside each other */
  slide.style.transform = `translateX(${index * 100}%)`;

  /* Adding Dots / active the current dot */
  const dotClasses =
    index === currentSlide ? 'dots__dot dots__dot--active' : 'dots__dot';
  const dot = `<div data-slide = "${index}" class="${dotClasses}"></div>`;
  dotsContainer.insertAdjacentHTML('beforeend', dot);
});

/* Add Event Listner to dots () */
dotsContainer.addEventListener('click', e => {
  if (!e.target.classList.contains('dots__dot')) return;

  currentSlide = +e.target.dataset.slide;
  console.log();
  moveSlide();
});

/*Adding Event Listener To keydwon on slider */

window.addEventListener('keydown', e => {
  if (!isElementInViewport(slider)) return;
  if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;

  if (e.key !== 'ArrowRight') {
    currentSlide--;
    moveSlide();
  } else {
    currentSlide++;
    moveSlide();
  }
});
function isElementInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

const moveSlide = () => {
  if (currentSlide === slidesAmount) currentSlide = 0;
  if (currentSlide < 0) currentSlide = slidesAmount - 1;

  // Adjust the slides
  slides.forEach(
    (slide, index) =>
      (slide.style.transform = `translateX(${(index - currentSlide) * 100}%)`)
  );

  /* Move active class to current slide dot */
  Array.from(dotsContainer.children).forEach((child, index) => {
    if (index !== currentSlide) child.classList.remove('dots__dot--active');
    else child.classList.add('dots__dot--active');
  });
};

slideRightBtn.addEventListener('click', e => {
  currentSlide++;

  moveSlide();
});
slideLeftBtn.addEventListener('click', e => {
  currentSlide--;

  moveSlide();
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Creating Cookie element

const message = document.createElement('div');
message.classList.add('cookie-message');
// message.textContent = 'This message was created using document.createElement.';

message.innerHTML =
  '<p>This message was created using document.createElement.</p> <button class="btn btn--close-cookie">Got it!</button>';

// document.querySelector('.header').prepend(message);
header.append(message);
// document.querySelector('.header').before(message);
// document.querySelector('.header').after(message);

document.querySelector('.btn--close-cookie').addEventListener('click', () => {
  message.classList.add('disappearing');
  setTimeout(() => {
    message.remove();
  }, 500);
});

//////////////////////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////
// Playing with Colors ebent Propagation

// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);

// const randomColor = () =>
//   `rgba(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

// document.body.addEventListener('click', e => {
//   console.log(this);
//   e.currentTarget.style.backgroundColor = randomColor();
// });
