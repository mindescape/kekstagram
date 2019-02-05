'use strict';

(function () {

  var Filter = {
    POPULAR: 'filter-popular',
    NEW: 'filter-new',
    DISCUSSED: 'filter-discussed'
  };

  var NEW_PICTURES_COUNT = 10;

  var template = document.querySelector('#picture');
  var pictureTemplate = template.content.querySelector('.picture');
  var picturesDOM = document.querySelector('.pictures');
  var imgFilters = document.querySelector('.img-filters');
  var imgFiltersForm = imgFilters.querySelector('.img-filters__form');
  var pictures = [];


  // Get picture DOM
  var getPicture = function (picture) {
    var pictureElement = pictureTemplate.cloneNode(true);

    pictureElement.querySelector('.picture__img').src = picture.url;
    pictureElement.querySelector('.picture__likes').textContent = picture.likes;
    pictureElement.querySelector('.picture__comments').textContent = picture.comments.length;

    return pictureElement;
  };


  // Sort pictures by comments number
  var sortByComments = function (pics) {
    pics = pics.concat([]);

    pics.sort(function (a, b) {
      if (a.comments.length > b.comments.length) {
        return -1;
      } else if (a.comments.length < b.comments.length) {
        return 1;
      }

      return 0;
    });

    return pics;
  };


  // Render pictures on page
  var renderPictures = function (photos) {
    var fragment = document.createDocumentFragment();

    photos.forEach(function (picture, index) {
      var currentPicture = getPicture(picture);

      currentPicture.dataset.id = index;
      fragment.appendChild(currentPicture);

      currentPicture.addEventListener('click', function (evt) {
        evt.preventDefault();
        window.preview.fillOverlay(photos[evt.currentTarget.dataset.id]);
      });
    });

    picturesDOM.appendChild(fragment);
  };


  // Remove pictures
  var removePictures = function () {
    var photos = picturesDOM.querySelectorAll('.picture');

    photos.forEach(function (elem) {
      picturesDOM.removeChild(elem);
    });
  };

  var onSuccessDownload = function (arr) {
    pictures = arr.slice();
    renderPictures(arr);
    imgFilters.classList.remove('img-filters--inactive');
  };

  var onErrorDownload = function (errorMessage) {
    var message = window.form.error.cloneNode(true);

    window.form.main.appendChild(message);
    document.querySelector('.error__inner').removeChild(document.querySelector('.error__buttons'));
    document.querySelector('.error__title').textContent = errorMessage;

    document.addEventListener('keydown', onErrorEscPress);
    document.addEventListener('click', onErrorClick);
  };

  var onErrorEscPress = function (evt) {
    window.util.checkActionCode(evt, window.util.Keycode.ESC, hideErrorModal);
  };

  var onErrorClick = function () {
    hideErrorModal();
  };

  var hideErrorModal = function () {
    window.form.main.removeChild(document.querySelector('.error'));
    document.removeEventListener('keydown', onErrorEscPress);
    document.removeEventListener('click', onErrorClick);
  };

  window.backend.downloadData(onSuccessDownload, onErrorDownload);


  // Filters
  var showPopularPictures = function (pics) {
    removePictures();
    renderPictures(pics);
  };

  var showNewPictures = function (pics) {
    pics = pics.concat([]);
    pics.sort(function () {
      return Math.random() - 0.5;
    });

    removePictures();
    renderPictures(pics.slice(0, NEW_PICTURES_COUNT));
  };

  var showDiscussedPictures = function (pics) {
    var sortedPics = sortByComments(pics);

    removePictures();
    renderPictures(sortedPics);
  };

  var addActiveClass = function (evt) {
    var activeButton = document.querySelector('.img-filters__button--active');
    activeButton.classList.toggle('img-filters__button--active');

    evt.target.classList.add('img-filters__button--active');
  };

  var switchFilter = window.debounce(function (effect) {
    switch (effect.id) {
      case Filter.POPULAR:
        showPopularPictures(pictures);
        break;
      case Filter.NEW:
        showNewPictures(pictures);
        break;
      case Filter.DISCUSSED:
        showDiscussedPictures(pictures);
        break;
      default:
        break;
    }
  });

  var onFilterClick = function (evt) {
    if (evt.target.type === 'button') {
      addActiveClass(evt);
      switchFilter(evt.target);
    }
  };

  imgFiltersForm.addEventListener('click', onFilterClick);

})();
