'use strict';

// Render pictures
(function () {
  var PHOTOS_COUNT = 25;
  var MIN_LIKES = 15;
  var MAX_LIKES = 200;
  var MIN_COMMENT_COUNT = 1;
  var MAX_COMMENT_COUNT = 2;
  var MIN_COMMENT_AVATAR_COUNT = 1;
  var MAX_COMMENT_AVATAR_COUNT = 6;
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

  var bigPicture = document.querySelector('.big-picture');
  var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
  var getRandomNumber = window.util.getRandomNumber;

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

  var getPicturesArray = function () {
    var usersPictures = [];
    for (var i = 1; i <= PHOTOS_COUNT; i++) {
      usersPictures.push(getPicture(i));
    }
    return usersPictures;
  };

  var kekstagramPictures = getPicturesArray();

  var getPicturesDOM = function (pictures) {
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

  var getCommentsElements = function (pictureComments) {
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

  var getBigPicture = function (picture) {
    bigPicture.querySelector('.big-picture__img').querySelector('img').src = picture.url;
    bigPicture.querySelector('.likes-count').textContent = picture.likes;
    bigPicture.querySelector('.comments-count').textContent = picture.comments.length;
    bigPicture.querySelector('.social__caption').textContent = picture.description;

    var socialComments = bigPicture.querySelector('.social__comments');
    var removeComments = function () {
      while (socialComments.hasChildNodes()) {
        socialComments.removeChild(socialComments.firstChild);
      }
    };

    var renderComments = function () {
      var commentsElements = getCommentsElements(picture.comments);
      for (var k = 0; k < commentsElements.length; k++) {
        socialComments.appendChild(commentsElements[k]);
      }
    };

    removeComments();
    renderComments();

  };

  var hideCommentsCounter = function () {
    var commentsCounter = document.querySelector('.social__comment-count');
    commentsCounter.classList.add('visually-hidden');
  };

  var hideCommentsLoader = function () {
    var commentsLoader = document.querySelector('.comments-loader');
    commentsLoader.classList.add('visually-hidden');
  };

  var showBigPicture = function (picture) {
    getBigPicture(picture);
    bigPicture.classList.remove('hidden');
  };

  var hideBigPicture = function () {
    bigPicture.classList.add('hidden');
    document.querySelector('body').classList.remove('modal-open');
    document.removeEventListener('keydown', onPictureEscPress);
  };

  var setup = function () {
    getPicturesDOM(kekstagramPictures);
    hideCommentsCounter();
    hideCommentsLoader();
  };

  setup();

  var picturesDOM = document.querySelector('.pictures');
  var bigPictureCloseButton = document.querySelector('.big-picture__cancel');

  var onOutsidePreviewClick = function (evt) {
    if (evt.target === bigPicture) {
      hideBigPicture();
    }
  };

  var onPictureClick = function (evt) {
    if (evt.target.className === 'picture__img') {
      var pictureSrc = evt.target.src.match(/\d+/)[0];
      showBigPicture(kekstagramPictures[pictureSrc - 1]);
      document.querySelector('body').classList.add('modal-open');
      document.addEventListener('keydown', onPictureEscPress);
    }
  };

  var onPictureEscPress = function (evt) {
    if (window.util.isEventEsc(evt)) {
      hideBigPicture();
      document.removeEventListener('click', onOutsidePreviewClick);
    }
  };

  picturesDOM.addEventListener('click', function (evt) {
    onPictureClick(evt);
    document.addEventListener('click', onOutsidePreviewClick);
  });

  bigPictureCloseButton.addEventListener('click', function () {
    hideBigPicture();
    document.removeEventListener('click', onOutsidePreviewClick);
  });
})();
