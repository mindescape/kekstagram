'use strict';

(function () {
  // Constants
  var Scale = {
    MIN: 25,
    MAX: 100,
    STEP: 25
  };

  var uploadButton = document.querySelector('#upload-file');
  var uploadCancelButton = document.querySelector('#upload-cancel');
  var uploadOverlay = document.querySelector('.img-upload__overlay');
  var scaleControlValue = uploadOverlay.querySelector('.scale__control--value');
  var scaleControlSmaller = uploadOverlay.querySelector('.scale__control--smaller');
  var scaleControlBigger = uploadOverlay.querySelector('.scale__control--bigger');
  var hashtagsInput = uploadOverlay.querySelector('.text__hashtags');
  var descriptionInput = uploadOverlay.querySelector('.text__description');
  var imageUploadPreview = document.querySelector('.img-upload__preview');
  var imagePreview = imageUploadPreview.querySelector('img');

  // Hide on ESC keydown
  var onUploadEscPress = function (evt) {
    var focused = document.activeElement;

    if (focused !== hashtagsInput && focused !== descriptionInput) {
      window.util.checkActionCode(evt, window.util.keycode.ESC, hideUploadOverlay);
    }
  };

  // Hide form
  var hideUploadOverlay = function () {
    uploadOverlay.classList.add('hidden');
    window.util.resetValue(uploadButton);

    document.removeEventListener('keydown', onUploadEscPress);
    scaleControlSmaller.removeEventListener('click', onScaleControlSmallerClick);
    scaleControlBigger.removeEventListener('click', onScaleControlBiggerClick);
  };

  // Default form settings
  var resetEffects = function () {
    imagePreview.style.transform = null;
    scaleControlValue.value = '100%';
  };

  // Open form
  var onUploadButtonClick = function () {
    uploadOverlay.classList.remove('hidden');
    window.photo.readFile();
    resetEffects();

    uploadCancelButton.addEventListener('click', hideUploadOverlay);
    document.addEventListener('keydown', onUploadEscPress);
    scaleControlSmaller.addEventListener('click', onScaleControlSmallerClick);
    scaleControlBigger.addEventListener('click', onScaleControlBiggerClick);
  };

  // Change image scale
  var setScale = function (value) {
    imagePreview.style.transform = 'scale(' + value / 100 + ')';
    scaleControlValue.value = value + '%';
  };

  var onScaleControlSmallerClick = function () {
    var value = parseInt(scaleControlValue.value, 10);

    if (value > Scale.MIN) {
      value -= Scale.STEP;
      setScale(value);
    }
  };

  var onScaleControlBiggerClick = function () {
    var value = parseInt(scaleControlValue.value, 10);

    if (value < Scale.MAX) {
      value += Scale.STEP;
      setScale(value);
    }
  };

  // Event handlers
  uploadButton.addEventListener('change', onUploadButtonClick);

  window.form = {
    fileUpload: uploadButton,
    imagePreview: imagePreview
  };

})();
