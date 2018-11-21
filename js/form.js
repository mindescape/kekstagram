'use strict';

// Uploading picture
(function () {
  var uploadButton = document.querySelector('#upload-file');
  var cancelUploadButton = document.querySelector('#upload-cancel');
  var imgUploadOverlay = document.querySelector('.img-upload__overlay');
  var hashtagsInput = document.querySelector('.text__hashtags');
  var descriptionInput = document.querySelector('.text__description');
  var resetValue = window.util.resetValue;

  var onUploadEscPress = function (evt) {
    if (document.activeElement !== hashtagsInput && document.activeElement !== descriptionInput) {
      window.util.isEventEsc(evt, hideImgUploadOverlay);
      resetValue(uploadButton);
      document.querySelector('body').classList.remove('modal-open');
    }
  };

  var showImgUploadOverlay = function () {
    imgUploadOverlay.classList.remove('hidden');
    document.addEventListener('keydown', onUploadEscPress);
  };

  var hideImgUploadOverlay = function () {
    imgUploadOverlay.classList.add('hidden');
    document.removeEventListener('keydown', onUploadEscPress);
  };

  uploadButton.addEventListener('change', function () {
    showImgUploadOverlay();
    document.querySelector('body').classList.add('modal-open');
  });

  cancelUploadButton.addEventListener('click', function () {
    hideImgUploadOverlay();
    resetValue(uploadButton);
    document.querySelector('body').classList.remove('modal-open');
  });
})();


// Picture scale settings
(function () {
  var img = document.querySelector('.img-upload__preview').querySelector('img');
  var scaleControlSmaller = document.querySelector('.scale__control--smaller');
  var scaleControlBigger = document.querySelector('.scale__control--bigger');

  var changeImgScale = function (type) {
    var scaleInput = document.querySelector('.scale__control--value');
    var scaleValue = parseInt(scaleInput.value, 10);
    var MIN_VALUE = 25;
    var MAX_VALUE = 100;
    var VALUE_STEP = 25;
    if (type === 1) {
      if (scaleValue + VALUE_STEP <= MAX_VALUE) {
        scaleValue += VALUE_STEP;
      }
    } else {
      if (scaleValue - VALUE_STEP >= MIN_VALUE) {
        scaleValue -= VALUE_STEP;
      }
    }
    if (scaleValue !== MAX_VALUE) {
      img.style.transform = 'scale(0.' + scaleValue + ')';
    } else {
      img.style.transform = 'scale(1)';
    }
    scaleInput.value = scaleValue + '%';
  };

  scaleControlSmaller.addEventListener('click', function () {
    changeImgScale(0);
  });

  scaleControlBigger.addEventListener('click', function () {
    changeImgScale(1);
  });
})();


// Control effects
(function () {
  var img = document.querySelector('.img-upload__preview').querySelector('img');
  var effectsList = document.querySelector('.effects__list');
  var effectLevel = document.querySelector('.effect-level');
  var effectLevelPin = document.querySelector('.effect-level__pin');
  var effectLevelDepth = document.querySelector('.effect-level__depth');
  var effectLevelLine = document.querySelector('.effect-level__line');
  var effectLevelValue = document.querySelector('.effect-level__value');

  var effectsInputs = {
    none: effectsList.querySelector('#effect-none'),
    chrome: effectsList.querySelector('#effect-chrome'),
    sepia: effectsList.querySelector('#effect-sepia'),
    marvin: effectsList.querySelector('#effect-marvin'),
    phobos: effectsList.querySelector('#effect-phobos'),
    heat: effectsList.querySelector('#effect-heat')
  };

  var onEffectClick = function (evt) {
    var removeEffects = function () {
      for (var i = img.classList.length; i >= 0; i--) {
        img.classList.remove(img.classList[i]);
      }
    };

    var resetStyle = function () {
      img.style = '';
    };

    var applyEffect = function () {

      var setupLevels = function (value) {
        if (value === 'min') {
          effectLevelPin.style.left = '0';
          effectLevelDepth.style.width = '0';
        } else if (value === 'max') {
          effectLevelPin.style.left = effectLevelLine.offsetWidth + 'px';
          effectLevelDepth.style.width = effectLevelLine.offsetWidth + 'px';
        }
      };

      if (evt.target === effectsInputs.none) {
        effectLevel.style.display = 'none';
        resetStyle();
      } else if (evt.target === effectsInputs.chrome) {
        effectLevel.style.display = 'block';
        setupLevels('max');
        resetStyle();
        img.classList.add('effects__preview--chrome');
      } else if (evt.target === effectsInputs.sepia) {
        effectLevel.style.display = 'block';
        setupLevels('max');
        resetStyle();
        img.classList.add('effects__preview--sepia');
      } else if (evt.target === effectsInputs.marvin) {
        effectLevel.style.display = 'block';
        setupLevels('max');
        resetStyle();
        img.classList.add('effects__preview--marvin');
      } else if (evt.target === effectsInputs.phobos) {
        effectLevel.style.display = 'block';
        setupLevels('max');
        resetStyle();
        img.classList.add('effects__preview--phobos');
      } else if (evt.target === effectsInputs.heat) {
        effectLevel.style.display = 'block';
        setupLevels('max');
        resetStyle();
        img.classList.add('effects__preview--heat');
      }
    };

    removeEffects();
    applyEffect();
  };

  var changeEffectValue = function () {
    var CURRENT_VALUE = effectLevelPin.offsetLeft;
    var MAX_VALUE = effectLevelLine.offsetWidth;
    var currentEffect = img.className;
    var computed;

    if (currentEffect === 'effects__preview--chrome') {
      computed = Math.floor((CURRENT_VALUE * 100) / MAX_VALUE) / 100;
      img.style.filter = 'grayscale(' + computed + ')';
    } else if (currentEffect === 'effects__preview--sepia') {
      computed = Math.floor((CURRENT_VALUE * 100) / MAX_VALUE) / 100;
      img.style.filter = 'sepia(' + computed + ')';
    } else if (currentEffect === 'effects__preview--marvin') {
      computed = Math.floor((CURRENT_VALUE / MAX_VALUE) * 100);
      img.style.filter = 'invert(' + computed + '%)';
    } else if (currentEffect === 'effects__preview--phobos') {
      computed = (CURRENT_VALUE * 5) / MAX_VALUE;
      img.style.filter = 'blur(' + computed + 'px)';
    } else if (currentEffect === 'effects__preview--heat') {
      computed = (CURRENT_VALUE * 2) / MAX_VALUE + 1;
      img.style.filter = 'brightness(' + computed + ')';
    }

    effectLevelValue.value = parseInt(computed, 10);
  };

  effectsList.addEventListener('click', onEffectClick);

  effectLevelPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX
    };

    var onMouseMove = function (moveEvt) {

      var shift = {
        x: startCoords.x - moveEvt.clientX
      };

      startCoords = {
        x: moveEvt.clientX
      };

      effectLevelPin.style.left = (effectLevelPin.offsetLeft - shift.x) + 'px';
      effectLevelDepth.style.width = effectLevelPin.offsetLeft + 'px';

      if (effectLevelPin.offsetLeft <= 0) {
        effectLevelPin.style.left = '0';
        effectLevelDepth.style.width = '0';
        effectLevelValue.value = '0';
      } else if (effectLevelPin.offsetLeft >= effectLevelLine.offsetWidth) {
        effectLevelPin.style.left = effectLevelLine.offsetWidth + 'px';
        effectLevelDepth.style.width = effectLevelLine.offsetWidth + 'px';
        effectLevelValue.value = effectLevelLine.offsetWidth;
      }

      changeEffectValue();

    };

    var onMouseUp = function () {
      document.removeEventListener('mousemove', onMouseMove);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
})();


// Validation
(function () {
  var hashtagsInput = document.querySelector('.text__hashtags');
  var submitButton = document.querySelector('#upload-submit');
  var invalidities = [];

  var checkHashtagsValidity = function (hashtags) {
    var splitHashtags = function () {
      return hashtags.value.split(' ');
    };
    var hashtagsArr = splitHashtags();

    var noPound = [];
    var onlyPound = [];
    var noSpace;
    var hasDuplicates = [];
    var tooManyHashtags;
    var lengthTooLarge = [];

    var checkIfNoPound = function (index) {
      if (hashtagsArr[index][0].indexOf('#') === -1) {
        return true;
      } else {
        return false;
      }
    };

    var checkIfOnlyPound = function (index) {
      if (hashtagsArr[index].indexOf('#') === 0 && hashtagsArr[index].length === 1) {
        return true;
      } else {
        return false;
      }
    };

    var checkIfNoSpace = function () {
      if (hashtags.value.match(/#\w+#/g)) {
        return true;
      } else {
        return false;
      }
    };

    var checkIfDuplicates = function () {
      var isDuplicate = false;
      for (var i = 0; i < hashtagsArr.length; i++) {
        for (var k = i + 1; k < hashtagsArr.length; k++) {
          if (hashtagsArr[i].toLowerCase() === hashtagsArr[k].toLowerCase()) {
            isDuplicate = true;
          }
        }
      }
      return isDuplicate;
    };

    var checkIfTooMany = function () {
      var ALLOWED_HASHTAGS_NUMBER = 5;
      if (hashtagsArr.length > ALLOWED_HASHTAGS_NUMBER) {
        return true;
      } else {
        return false;
      }
    };

    var checkIfLengthToolarge = function (index) {
      var HASHTAG_MAX_LENGTH = 20;
      if (hashtagsArr[index].length > HASHTAG_MAX_LENGTH) {
        return true;
      } else {
        return false;
      }
    };

    var getValidityStatuses = function () {
      for (var i = 0; i < hashtagsArr.length; i++) {
        noPound.push(checkIfNoPound(i));
        onlyPound.push(checkIfOnlyPound(i));
        lengthTooLarge.push(checkIfLengthToolarge(i));
      }
      noSpace = checkIfNoSpace();
      hasDuplicates = checkIfDuplicates();
      tooManyHashtags = checkIfTooMany();
    };

    var getMessages = function () {
      invalidities = [];
      var message;
      if (noPound.indexOf(true) !== -1) {
        message = 'Хэш-тег должен начинаться с символа \"#\"';
        invalidities.push(message);
      }
      if (onlyPound.indexOf(true) !== -1) {
        message = 'Хэш-тег не может состоять только из одной решётки';
        invalidities.push(message);
      }
      if (noSpace) {
        message = 'Хэштеги разделяются пробелами';
        invalidities.push(message);
      }
      if (hasDuplicates) {
        message = 'Один и тот же хэш-тег не может быть использован дважды';
        invalidities.push(message);
      }
      if (tooManyHashtags) {
        message = 'Нельзя указывать больше пяти хэш-тегов';
        invalidities.push(message);
      }
      if (lengthTooLarge.indexOf(true) !== -1) {
        message = 'Максимальная длина одного хэш-тега 20 символов, включая решётку';
        invalidities.push(message);
      }
    };

    getValidityStatuses();
    getMessages();
  };

  var setCustomMessages = function (input) {
    if (invalidities.length === 0 || input.value === '') {
      input.setCustomValidity('');
      input.classList.remove('invalid');
    } else {
      var message = invalidities.join('. \n');
      input.setCustomValidity(message);
      input.classList.add('invalid');
    }
  };

  submitButton.addEventListener('click', function () {
    if (hashtagsInput.value !== '') {
      checkHashtagsValidity(hashtagsInput);
    }
    setCustomMessages(hashtagsInput);
  });
})();
