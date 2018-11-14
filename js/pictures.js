'use strict';

var MOCK_COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];

var MOCK_DESCRIPTIONS = [
  'Тестим новую камеру!',
  'Затусили с друзьями на море', 'Как же круто тут кормят',
  'Отдыхаем...',
  'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
  'Вот это тачка!'];

var PHOTOS_COUNT = 25;
var MIN_LIKES = 15;
var MAX_LIKES = 200;
var MIN_COMMENT_COUNT = 1;
var MAX_COMMENT_COUNT = 2;
var MIN_COMMENT_AVATAR_COUNT = 1;
var MAX_COMMENT_AVATAR_COUNT = 6;

var bigPicture = document.querySelector('.big-picture');
var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');

var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var getRandomComments = function (requiredNumber) {
  var comments = [];
  var count = 0;
  while (count < requiredNumber) {
    var comment = MOCK_COMMENTS[getRandomNumber(0, MOCK_COMMENTS.length - 1)];
    if (comments.indexOf(comment) === -1) {
      comments.push(comment);
      count++;
    }
  }
  return comments;
};

var getPicture = function (index) {
  return {
    url: 'photos/' + index + '.jpg',
    likes: getRandomNumber(MIN_LIKES, MAX_LIKES),
    description: MOCK_DESCRIPTIONS[getRandomNumber(0, MOCK_DESCRIPTIONS.length - 1)],
    comments: getRandomComments(getRandomNumber(MIN_COMMENT_COUNT, MAX_COMMENT_COUNT))
  };
};

var generatePicturesArray = function () {
  var usersPictures = [];
  for (var i = 1; i <= PHOTOS_COUNT; i++) {
    usersPictures.push(getPicture(i));
  }
  return usersPictures;
};

var generatePicturesDOM = function (pictures) {
  var picturesDOM = document.querySelector('.pictures');
  var picturesElements = document.createDocumentFragment();
  for (var i = 0; i < pictures.length; i++) {
    var pictureElement = pictureTemplate.cloneNode(true);
    pictureElement.querySelector('.picture__img').src = pictures[i].url;
    pictureElement.querySelector('.picture__likes').textContent = pictures[i].likes;
    pictureElement.querySelector('.picture__comments').textContent = pictures[i].comments.length;
    picturesElements.appendChild(pictureElement);
  }
  picturesDOM.appendChild(picturesElements);
};

var generateCommentsElements = function (pictureComments) {
  var commentsList = [];
  for (var i = 0; i < pictureComments.length; i++) {
    var avatarIndex = getRandomNumber(MIN_COMMENT_AVATAR_COUNT, MAX_COMMENT_AVATAR_COUNT);
    var li = document.createElement('li');
    var img = document.createElement('img');
    var p = document.createElement('p');

    li.classList.add('social__comment');
    img.classList.add('social__picture');
    img.src = 'img/avatar-' + avatarIndex + '.svg';
    img.alt = 'Аватар комментатора фотографии';
    img.width = 35;
    img.height = 35;
    p.classList.add('social__text');
    p.textContent = pictureComments[i];
    li.appendChild(img);
    li.appendChild(p);
    commentsList.push(li);
  }
  return commentsList;
};

var showBigPicture = function (picture) {
  bigPicture.classList.remove('hidden');
  bigPicture.querySelector('.big-picture__img').querySelector('img').src = picture.url;
  bigPicture.querySelector('.likes-count').textContent = picture.likes;
  bigPicture.querySelector('.comments-count').textContent = picture.comments.length;
  bigPicture.querySelector('.social__caption').textContent = picture.description;

  var socialComments = bigPicture.querySelector('.social__comments');
  var commentsElements = generateCommentsElements(picture.comments);
  for (var i = 0; i < commentsElements.length; i++) {
    socialComments.appendChild(commentsElements[i]);
  }
};

var hideBigPicture = function () {
  bigPicture.classList.add('hidden');
  document.querySelector('body').classList.remove('modal-open');
  document.removeEventListener('keydown', onBigPictureEscPress);
};

var hideCommentsCounter = function () {
  var commentsCounter = document.querySelector('.social__comment-count');
  commentsCounter.classList.add('visually-hidden');
};

var hideCommentsLoader = function () {
  var commentsLoader = document.querySelector('.comments-loader');
  commentsLoader.classList.add('visually-hidden');
};

var kekstagramPictures = generatePicturesArray();
generatePicturesDOM(kekstagramPictures);
hideCommentsCounter();
hideCommentsLoader();


// Uploading image and showing settings form
var ESC_KEY = 27;

var uploadButton = document.querySelector('#upload-file');
var cancelUploadButton = document.querySelector('#upload-cancel');
var imgUploadOverlay = document.querySelector('.img-upload__overlay');
var img = document.querySelector('.img-upload__preview').querySelector('img');
var scaleControlSmaller = document.querySelector('.scale__control--smaller');
var scaleControlBigger = document.querySelector('.scale__control--bigger');
var effectsList = document.querySelector('.effects__list');
var picturesDOM = document.querySelector('.pictures');
var bigPictureClose = document.querySelector('.big-picture__cancel');

var resetValue = function (input) {
  input.value = '';
};

var onUploadEscPress = function (evt) {
  if (evt.keyCode === ESC_KEY) {
    hideImgUploadOverlay();
    resetValue(uploadButton);
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
});

cancelUploadButton.addEventListener('click', function () {
  hideImgUploadOverlay();
  resetValue(uploadButton);
});

var changeImgScale = function (type) {
  var scaleInput = document.querySelector('.scale__control--value');
  var scaleValue = parseInt(scaleInput.value, 10);
  var valueStep = 25;
  var maxValue = 100;
  var minValue = 25;
  if (type === 1) {
    if (scaleValue + valueStep <= maxValue) {
      scaleValue += 25;
    }
  } else {
    if (scaleValue - valueStep >= minValue) {
      scaleValue -= 25;
    }
  }
  if (scaleValue !== maxValue) {
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

effectsList.addEventListener('click', function (evt) {
  var effectNone = effectsList.querySelector('#effect-none');
  var effectChrome = effectsList.querySelector('#effect-chrome');
  var effectSepia = effectsList.querySelector('#effect-sepia');
  var effectMarvin = effectsList.querySelector('#effect-marvin');
  var effectPhobos = effectsList.querySelector('#effect-phobos');
  var effectHeat = effectsList.querySelector('#effect-heat');

  var removeEffects = function () {
    for (var i = img.classList.length; i >= 0; i--) {
      img.classList.remove(img.classList[i]);
    }
  };

  if (evt.target === effectNone) {
    removeEffects();
  } else if (evt.target === effectChrome) {
    removeEffects();
    img.classList.add('effects__preview--chrome');
  } else if (evt.target === effectSepia) {
    removeEffects();
    img.classList.add('effects__preview--sepia');
  } else if (evt.target === effectMarvin) {
    removeEffects();
    img.classList.add('effects__preview--marvin');
  } else if (evt.target === effectPhobos) {
    removeEffects();
    img.classList.add('effects__preview--phobos');
  } else if (evt.target === effectHeat) {
    removeEffects();
    img.classList.add('effects__preview--heat');
  }
});

var onPictureClick = function (evt) {
  if (evt.target.className === 'picture__img') {
    var pictureSrc = evt.target.src.match(/\d+/)[0];
    showBigPicture(kekstagramPictures[pictureSrc - 1]);
    document.querySelector('body').classList.add('modal-open');
    document.addEventListener('keydown', onBigPictureEscPress);
  }
};

var onBigPictureEscPress = function (evt) {
  if (evt.keyCode === ESC_KEY) {
    hideBigPicture();
  }
};

picturesDOM.addEventListener('click', function (evt) {
  onPictureClick(evt);
});

bigPictureClose.addEventListener('click', function () {
  hideBigPicture();
});
