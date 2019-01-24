'use strict';

// Upload overlay handrers
(function () {
  var form = document.querySelector('.img-upload__form');
  var uploadButton = document.querySelector('#upload-file');
  var closeUploadButton = document.querySelector('#upload-cancel');
  var uploadOverlay = document.querySelector('.img-upload__overlay');
  var hashtagsInput = document.querySelector('.text__hashtags');
  var descriptionInput = document.querySelector('.text__description');

  var onUploadEscPress = function (evt) {
    if (evt.keyCode === window.util.keycode.ESC) {
      hideUploadOverlay();
    }
  };

  var showUploadOverlay = function () {
    uploadOverlay.classList.remove('hidden');
    document.addEventListener('keydown', onUploadEscPress);
  };

  var hideUploadOverlay = function () {
    if (document.activeElement !== hashtagsInput && document.activeElement !== descriptionInput) {
      uploadOverlay.classList.add('hidden');
      form.reset();
      document.removeEventListener('keydown', onUploadEscPress);
      document.querySelector('body').classList.remove('modal-open');
    }
  };

  uploadButton.addEventListener('change', function () {
    showUploadOverlay();
    document.querySelector('body').classList.add('modal-open');
  });

  closeUploadButton.addEventListener('click', function () {
    hideUploadOverlay();
  });
})();
