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
  var bigPicture = document.querySelector('.big-picture');
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
showBigPicture(kekstagramPictures[0]);
hideCommentsCounter();
hideCommentsLoader();
