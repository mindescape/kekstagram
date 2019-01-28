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

// (function () {
//
//   // Constants
//   var PICTURES_NUMBER = 25;
//   var COMMENTS_NUMBER = 3;
//   var LIKES_MIN = 15;
//   var LIKES_MAX = 200;
//   var AVATAR_MIN = 1;
//   var AVATAR_MAX = 6;
//   var AVATAR_WIDTH = 35;
//   var AVATAR_HEIGHT = 35;
//
//   var KEYCODE_ESC = 27;
//   var KEYCODE_ENTER = 13;
//
//
//   // Mock data
//   var MOCK_COMMENTS = [
//     'Всё отлично!',
//     'В целом всё неплохо. Но не всё.',
//     'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
//     'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
//     'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
//     'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
//   ];
//   var MOCK_DESCRIPTION = [
//     'Тестим новую камеру!',
//     'Затусили с друзьями на море',
//     'Как же круто тут кормят',
//     'Отдыхаем...',
//     'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
//     'Вот это тачка!'
//   ];
//
//   var template = document.querySelector('#picture');
//   var pictureTemplate = template.content.querySelector('.picture');
//   var picturesDOM = document.querySelector('.pictures');
//   var bigPicture = document.querySelector('.big-picture');
//   var bigPictureClose = document.querySelector('#picture-cancel');
//   var commentsDOM = document.querySelector('.social__comments');
//   var commentsCounter = document.querySelector('.social__comment-count');
//   var commentsLoader = document.querySelector('.comments-loader');
//
//
//   // Util functions
//   var getRandomNumber = function (min, max) {
//     return Math.floor(Math.random() * (max - min) + min);
//   };
//
//   var shuffleArr = function () {
//     return Math.random() - 0.5;
//   };
//
//   // Generate content
//   var generatePictures = function () {
//     var pictures = [];
//
//     for (var i = 0; i < PICTURES_NUMBER; i++) {
//       pictures[i] = {
//         url: 'photos/' + (i + 1) + '.jpg',
//         likes: getRandomNumber(LIKES_MIN, LIKES_MAX),
//         comments: generateComments(MOCK_COMMENTS, COMMENTS_NUMBER),
//         description: MOCK_DESCRIPTION[getRandomNumber(0, MOCK_DESCRIPTION.length - 1)]
//       };
//     }
//
//     return pictures.sort(shuffleArr);
//   };
//
//   var generateComments = function (arr, number) {
//     arr = arr.concat([]);
//     var comments = [];
//
//     for (var i = 0; i < number; i++) {
//       var randomIndex = getRandomNumber(0, arr.length - 1);
//       comments.push(arr[randomIndex]);
//       arr.splice(randomIndex, 1);
//     }
//
//     return comments;
//   };
//
//   var getPicture = function (picture) {
//     var pictureElement = pictureTemplate.cloneNode(true);
//
//     pictureElement.querySelector('.picture__img').src = picture.url;
//     pictureElement.querySelector('.picture__likes').textContent = picture.likes;
//     pictureElement.querySelector('.picture__comments').textContent = picture.comments.length;
//
//     return pictureElement;
//   };
//
//   var getComment = function (comment) {
//     var li = document.createElement('li');
//     var img = document.createElement('img');
//     var p = document.createElement('p');
//
//     li.classList.add('social__comment');
//     img.classList.add('social__picture');
//     img.src = 'img/avatar-' + getRandomNumber(AVATAR_MIN, AVATAR_MAX) + '.svg';
//     img.alt = 'Аватар комментатора фотографии';
//     img.width = AVATAR_WIDTH;
//     img.height = AVATAR_HEIGHT;
//     p.classList.add('social__text');
//     p.textContent = comment;
//
//     li.appendChild(img);
//     li.appendChild(p);
//
//     return li;
//   };
//
//   var removeComments = function () {
//     while (commentsDOM.hasChildNodes()) {
//       commentsDOM.removeChild(commentsDOM.firstChild);
//     }
//   };
//
//   var addComments = function (picture) {
//     var fragment = document.createDocumentFragment();
//
//     for (var i = 0; i < picture.comments.length; i++) {
//       var comment = picture.comments[i];
//       fragment.appendChild(getComment(comment));
//     }
//
//     commentsDOM.appendChild(fragment);
//   };
//
//
//   // Render content on page
//   var renderPictures = function (arr) {
//     var fragment = document.createDocumentFragment();
//
//     for (var i = 0; i < arr.length; i++) {
//       var currentPicture = getPicture(arr[i]);
//
//       currentPicture.setAttribute('data-id', i);
//       fragment.appendChild(currentPicture);
//
//       currentPicture.addEventListener('click', function (evt) {
//         evt.preventDefault();
//         renderBigPicture(arr[evt.currentTarget.dataset.id]);
//       });
//     }
//
//     picturesDOM.appendChild(fragment);
//   };
//
//   var renderBigPicture = function (picture) {
//     bigPicture.querySelector('.big-picture__img').querySelector('img').src = picture.url;
//     bigPicture.querySelector('.likes-count').textContent = picture.likes;
//     bigPicture.querySelector('.comments-count').textContent = picture.comments.length;
//     bigPicture.querySelector('.social__caption').textContent = picture.description;
//
//     removeComments();
//     addComments(picture);
//
//     bigPicture.classList.remove('hidden');
//     commentsCounter.classList.add('visually-hidden');
//     commentsLoader.classList.add('visually-hidden');
//
//     document.addEventListener('keydown', onBigPictureEscPress);
//     document.addEventListener('click', onOutsideBigPictureClick);
//   };
//
//   var generatedPictures = generatePictures();
//   renderPictures(generatedPictures);
//
//
//   // Event handlers
//   var onBigPictureEscPress = function (evt) {
//     if (evt.keyCode === KEYCODE_ESC) {
//       hideBigPicture();
//       document.removeEventListener('click', onOutsideBigPictureClick);
//     }
//   };
//
//   var onOutsideBigPictureClick = function (evt) {
//     if (evt.target === bigPicture) {
//       hideBigPicture();
//     }
//   };
//
//   var hideBigPicture = function () {
//     bigPicture.classList.add('hidden');
//     document.removeEventListener('keydown', onBigPictureEscPress);
//     document.removeEventListener('click', onOutsideBigPictureClick);
//   };
//
//   bigPictureClose.addEventListener('click', function () {
//     hideBigPicture();
//   });
//
//   bigPictureClose.addEventListener('keydown', function (evt) {
//     if (evt.keyCode === KEYCODE_ENTER) {
//       hideBigPicture();
//     }
//   });
// })();
