'use strict';

(function () {

  var Scale = {
    MIN: 25,
    MAX: 100,
    STEP: 25
  };

  var EffectValue = {
    MIN: 0,
    MAX: 100
  };

  var Effect = {
    NONE: {
      id: 'effect-none',
    },
    CHROME: {
      id: 'effect-chrome',
      class: 'effects__preview--chrome',
      filter: 'grayscale',
      min: 0,
      max: 1,
      unit: ''
    },
    SEPIA: {
      id: 'effect-sepia',
      class: 'effects__preview--sepia',
      filter: 'sepia',
      min: 0,
      max: 1,
      unit: ''
    },
    MARVIN: {
      id: 'effect-marvin',
      class: 'effects__preview--marvin',
      filter: 'invert',
      min: 0,
      max: 100,
      unit: '%'
    },
    PHOBOS: {
      id: 'effect-phobos',
      class: 'effects__preview--phobos',
      filter: 'blur',
      min: 0,
      max: 3,
      unit: 'px'
    },
    HEAT: {
      id: 'effect-heat',
      class: 'effects__preview--heat',
      filter: 'brightness',
      min: 1,
      max: 3,
      unit: ''
    }
  };

  var Hashtag = {
    MIN_LENGTH: 2,
    MAX_LENGTH: 20,
    MAX_NUMBER: 5
  };

  var HashtagMessage = {
    TOO_MANY: 'Нельзя указать больше пяти хэш-тегов. ',
    NO_SPACE: 'Хэш-теги должны разделяться пробелом. ',
    SAME: 'Один и тот же хэш-тег не может быть использован дважды. ',
    NOT_HASH: 'Хэш-тег должен начинаться с символа #. ',
    SHORT: 'Хэш-тег не может состоять только из одного символа. ',
    LONG: 'Максимальная длина одного хэш-тега — 20 символов, включая решётку. '
  };

  var body = document.querySelector('body');
  var form = document.querySelector('.img-upload__form');
  var uploadButton = document.querySelector('#upload-file');
  var uploadCancelButton = document.querySelector('#upload-cancel');
  var uploadOverlay = document.querySelector('.img-upload__overlay');
  var uploadSubmit = uploadOverlay.querySelector('#upload-submit');
  var scaleControlValue = uploadOverlay.querySelector('.scale__control--value');
  var scaleControlSmaller = uploadOverlay.querySelector('.scale__control--smaller');
  var scaleControlBigger = uploadOverlay.querySelector('.scale__control--bigger');
  var effectsList = uploadOverlay.querySelector('.effects__list');
  var effectLevel = uploadOverlay.querySelector('.effect-level');
  var effectLevelLine = effectLevel.querySelector('.effect-level__line');
  var effectLevelPin = effectLevel.querySelector('.effect-level__pin');
  var effectLevelDepth = effectLevel.querySelector('.effect-level__depth');
  var effectLevelValue = effectLevel.querySelector('.effect-level__value');
  var hashtagsInput = uploadOverlay.querySelector('.text__hashtags');
  var descriptionInput = uploadOverlay.querySelector('.text__description');
  var imageUploadPreview = document.querySelector('.img-upload__preview');
  var imagePreview = imageUploadPreview.querySelector('img');
  var main = document.querySelector('main');
  var successTemplate = document.querySelector('#success');
  var success = successTemplate.content.querySelector('.success');
  var errorTemplate = document.querySelector('#error');
  var error = errorTemplate.content.querySelector('.error');
  var modalButton;
  var activeEffect;


  // Hide on ESC keydown
  var onUploadEscPress = function (evt) {
    var focused = document.activeElement;

    if (focused !== hashtagsInput && focused !== descriptionInput) {
      window.util.checkActionCode(evt, window.util.Keycode.ESC, hideUploadOverlay);
    }
  };

  var onHashtagsInputEnterPress = function (evt) {
    if (evt.keycode === window.util.Keycode.ENTER) {
      evt.preventDefault();
    }
  };

  var onHashtagsInput = function () {
    hashtagsInput.setCustomValidity('');
    hashtagsInput.style.outline = null;
  };


  // Hide form
  var hideUploadOverlay = function () {
    uploadOverlay.classList.add('hidden');
    body.classList.remove('modal-open');
    window.util.resetValue(uploadButton);
    hashtagsInput.style.outline = null;
    form.reset();

    document.removeEventListener('keydown', onUploadEscPress);
    uploadCancelButton.removeEventListener('click', hideUploadOverlay);
    scaleControlSmaller.removeEventListener('click', onScaleControlSmallerClick);
    scaleControlBigger.removeEventListener('click', onScaleControlBiggerClick);
    effectsList.removeEventListener('click', setEffect);
    effectLevel.removeEventListener('click', onEffectLevelClick);
    uploadSubmit.removeEventListener('click', onUploadSubmitClick);
    form.removeEventListener('submit', onFormSubmit);
    hashtagsInput.removeEventListener('input', onHashtagsInput);
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

    imagePreview.style.filter = null;
    effectLevelPin.style.left = '100%';
    effectLevelDepth.style.width = '100%';
    effectLevelValue.value = '100';
    effectLevel.classList.add('hidden');
  };


  // Open form
  var onUploadButtonClick = function () {
    uploadOverlay.classList.remove('hidden');
    body.classList.add('modal-open');
    window.photo.readFile();
    resetScale();
    resetEffect();

    uploadCancelButton.addEventListener('click', hideUploadOverlay);
    document.addEventListener('keydown', onUploadEscPress);
    scaleControlSmaller.addEventListener('click', onScaleControlSmallerClick);
    scaleControlBigger.addEventListener('click', onScaleControlBiggerClick);
    effectsList.addEventListener('click', setEffect);
    effectLevel.addEventListener('click', onEffectLevelClick);
    uploadSubmit.addEventListener('click', onUploadSubmitClick);
    form.addEventListener('submit', onFormSubmit);
    hashtagsInput.addEventListener('input', onHashtagsInput);
    hashtagsInput.addEventListener('keydown', onHashtagsInputEnterPress);
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
      setFilterValue(activeEffect, activeEffect.max);
    }
  };


  // Set filter value
  var setFilterValue = function (effect, value) {
    imagePreview.style.filter = effect.filter + '(' + value + effect.unit + ')';
  };


  // Set effect
  var getFilterValue = function (coordinate) {
    var effectLevelPinLeft = Math.floor((coordinate - effectLevelLine.getBoundingClientRect().left) / effectLevelLine.offsetWidth * 100);

    if (effectLevelPinLeft < EffectValue.MIN || effectLevelPinLeft > EffectValue.MAX) {
      return;
    }

    setStyle(effectLevelPinLeft);
  };

  var setStyle = function (value) {
    effectLevelPin.style.left = value + '%';
    effectLevelDepth.style.width = value + '%';

    var filterValue = activeEffect.min + (value / EffectValue.MAX) * (activeEffect.max - activeEffect.min);

    effectLevelValue.value = value;
    setFilterValue(activeEffect, filterValue);
  };


  // Move pin
  effectLevelPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      getFilterValue(moveEvt.clientX);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  var onEffectLevelClick = function (evt) {
    getFilterValue(evt.clientX);
  };


  // Validation
  var showValidationError = function (message) {
    hashtagsInput.setCustomValidity(message);
    hashtagsInput.style.outline = '1px solid red';
  };

  var onUploadSubmitClick = function () {
    var userHashtags = document.querySelector('.text__hashtags').value.toLowerCase().replace(/\s+/g, ' ').trim();

    if (userHashtags) {
      var splitHashtags = userHashtags.split(' ');
      var errorMessages = [];
      var isDuplicate = false;

      if (splitHashtags.length > Hashtag.MAX_NUMBER) {
        errorMessages.push(HashtagMessage.TOO_MANY);
      }

      splitHashtags.forEach(function (el) {
        var hashtagSymbols = el.trim().split('');
        var sameHashtags = window.util.searchDuplicate(el, splitHashtags);
        var symbolCount = window.util.searchDuplicate('#', hashtagSymbols);

        if (symbolCount > 1) {
          errorMessages.push(HashtagMessage.NO_SPACE);
        }
        if (sameHashtags > 1) {
          isDuplicate = true;
        }
        if (el[0] !== '#') {
          errorMessages.push(HashtagMessage.NOT_HASH);
        }
        if (el.length < Hashtag.MIN_LENGTH) {
          errorMessages.push(HashtagMessage.SHORT);
        }
        if (el.length > Hashtag.MAX_LENGTH) {
          errorMessages.push(HashtagMessage.LONG);
        }
      });

      if (isDuplicate) {
        errorMessages.push(HashtagMessage.SAME);
      }

      showValidationError(errorMessages.join('\n'));
    }
  };


  // Show modal
  var showModal = function (modal) {
    hideUploadOverlay();

    var popup = modal.cloneNode(true);
    main.appendChild(popup);
  };

  var showSuccessModal = function () {
    showModal(success);

    modalButton = document.querySelector('.success__button');
    modalButton.addEventListener('click', onSuccessButtonClick);
    document.addEventListener('keydown', onSuccessEscPress);
    document.addEventListener('click', onSuccessClick);
  };

  var showErrorModal = function () {
    showModal(error);

    modalButton = document.querySelector('.error__button');
    modalButton.addEventListener('click', onErrorButtonClick);
    document.addEventListener('keydown', onErrorEscPress);
    document.addEventListener('click', onErrorClick);
  };


  // Hide modal
  var hideSuccessModal = function () {
    modalButton = document.querySelector('.success__button');
    modalButton.removeEventListener('click', onSuccessButtonClick);

    main.removeChild(document.querySelector('.success'));
    document.removeEventListener('keydown', onSuccessEscPress);
    document.removeEventListener('click', onSuccessClick);
  };

  var hideErrorModal = function () {
    modalButton = document.querySelector('.error__button');
    modalButton.removeEventListener('click', onErrorButtonClick);

    main.removeChild(document.querySelector('.error'));
    document.removeEventListener('keydown', onErrorEscPress);
    document.removeEventListener('click', onErrorClick);
  };

  var onSuccessButtonClick = function () {
    hideSuccessModal();
  };

  var onErrorButtonClick = function () {
    hideErrorModal();
  };

  var onSuccessEscPress = function (evt) {
    window.util.checkActionCode(evt, window.util.Keycode.ESC, hideSuccessModal);
  };

  var onErrorEscPress = function (evt) {
    window.util.checkActionCode(evt, window.util.Keycode.ESC, hideErrorModal);
  };

  var onSuccessClick = function () {
    hideSuccessModal();
  };

  var onErrorClick = function () {
    hideErrorModal();
  };


  // Send form
  var onSuccessUpload = function () {
    showSuccessModal();
  };

  var onErrorUpload = function () {
    showErrorModal();
  };

  var onFormSubmit = function (evt) {
    onUploadSubmitClick();

    window.backend.uploadData(new FormData(form), onSuccessUpload, onErrorUpload);
    evt.preventDefault();
  };


  // Event handlers
  uploadButton.addEventListener('change', onUploadButtonClick);

  window.form = {
    fileUpload: uploadButton,
    imagePreview: imagePreview,
    main: main,
    success: success,
    error: error
  };

})();
