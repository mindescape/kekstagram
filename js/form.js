'use strict';

(function () {
  var Scale = {
    MIN: 25,
    MAX: 100,
    STEP: 25
  };

  var Effect = {
    NONE: {
      id: 'effect-none',
    },
    CHROME: {
      id: 'effect-chrome',
      class: 'effects__preview--chrome'
    },
    SEPIA: {
      id: 'effect-sepia',
      class: 'effects__preview--sepia'
    },
    MARVIN: {
      id: 'effect-marvin',
      class: 'effects__preview--marvin'
    },
    PHOBOS: {
      id: 'effect-phobos',
      class: 'effects__preview--phobos'
    },
    HEAT: {
      id: 'effect-heat',
      class: 'effects__preview--heat'
    }
  };

  var uploadButton = document.querySelector('#upload-file');
  var uploadCancelButton = document.querySelector('#upload-cancel');
  var uploadOverlay = document.querySelector('.img-upload__overlay');
  var scaleControlValue = uploadOverlay.querySelector('.scale__control--value');
  var scaleControlSmaller = uploadOverlay.querySelector('.scale__control--smaller');
  var scaleControlBigger = uploadOverlay.querySelector('.scale__control--bigger');
  var effectsList = uploadOverlay.querySelector('.effects__list');
  var effectLevel = uploadOverlay.querySelector('.effect-level');
  var effectLevelPin = effectLevel.querySelector('.effect-level__pin');
  var effectLevelDepth = effectLevel.querySelector('.effect-level__depth');
  var effectLevelValue = effectLevel.querySelector('.effect-level__value');
  var hashtagsInput = uploadOverlay.querySelector('.text__hashtags');
  var descriptionInput = uploadOverlay.querySelector('.text__description');
  var imageUploadPreview = document.querySelector('.img-upload__preview');
  var imagePreview = imageUploadPreview.querySelector('img');
  var activeEffect;

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
    effectsList.removeEventListener('click', setEffect);
  };

  // Default form settings
  var resetScale = function () {
    imagePreview.style.transform = null;
    scaleControlValue.value = '100%';
  };

  var resetEffect = function () {
    if (activeEffect) {
      imagePreview.classList.remove(activeEffect.class);
    }

    effectLevelPin.style.left = '100%';
    effectLevelDepth.style.width = '100%';
    effectLevelValue.value = '100';
    effectLevel.classList.add('hidden');
  };

  // Open form
  var onUploadButtonClick = function () {
    uploadOverlay.classList.remove('hidden');
    window.photo.readFile();
    resetScale();
    resetEffect();

    uploadCancelButton.addEventListener('click', hideUploadOverlay);
    document.addEventListener('keydown', onUploadEscPress);
    scaleControlSmaller.addEventListener('click', onScaleControlSmallerClick);
    scaleControlBigger.addEventListener('click', onScaleControlBiggerClick);
    effectsList.addEventListener('click', setEffect);
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

  // Set effect to image
  var getEffect = function (evt) {
    activeEffect = evt.target;

    switch (activeEffect.id) {
      case Effect.CHROME.id:
        return Effect.CHROME;
      case Effect.SEPIA.id:
        return Effect.SEPIA;
      case Effect.MARVIN.id:
        return Effect.MARVIN;
      case Effect.PHOBOS.id:
        return Effect.PHOBOS;
      case Effect.HEAT.id:
        return Effect.HEAT;
      default:
        return '';
    }
  };

  var setEffect = function (evt) {
    resetEffect();

    activeEffect = getEffect(evt);

    if (activeEffect !== '') {
      effectLevel.classList.remove('hidden');
      imagePreview.classList.add(activeEffect.class);
    }
  };

  // Event handlers
  uploadButton.addEventListener('change', onUploadButtonClick);

  window.form = {
    fileUpload: uploadButton,
    imagePreview: imagePreview
  };

})();
