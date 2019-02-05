'use strict';

(function () {
  var template = document.querySelector('#picture');
  var pictureTemplate = template.content.querySelector('.picture');
  var picturesDOM = document.querySelector('.pictures');
  var pictures = [];

  var getPicture = function (picture) {
    var pictureElement = pictureTemplate.cloneNode(true);

    pictureElement.querySelector('.picture__img').src = picture.url;
    pictureElement.querySelector('.picture__likes').textContent = picture.likes;
    pictureElement.querySelector('.picture__comments').textContent = picture.comments.length;

    return pictureElement;
  };

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

  var onSuccessDownload = function (arr) {
    pictures = arr.slice();

    renderPictures(arr);
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

})();
