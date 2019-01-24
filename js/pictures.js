'use strict';

(function () {

  // Constants
  var PICTURES_NUMBER = 25;
  var COMMENTS_NUMBER = 3;
  var LIKES_MIN = 15;
  var LIKES_MAX = 200;


  // Mock data
  var MOCK_COMMENTS = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ];
  var MOCK_DESCRIPTION = [
    'Тестим новую камеру!',
    'Затусили с друзьями на море',
    'Как же круто тут кормят',
    'Отдыхаем...',
    'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
    'Вот это тачка!'
  ];

  var template = document.querySelector('#picture');
  var pictureTemplate = template.content.querySelector('.picture');
  var picturesDOM = document.querySelector('.pictures');


  // Util functions
  var getRandomNumber = function (min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  };

  var shuffleArr = function () {
    return Math.random() - 0.5;
  };

  // Generate content
  var generatePictures = function () {
    var pictures = [];

    for (var i = 0; i < PICTURES_NUMBER; i++) {
      pictures[i] = {
        url: 'photos/' + (i + 1) + '.jpg',
        likes: getRandomNumber(LIKES_MIN, LIKES_MAX),
        comments: generateComments(MOCK_COMMENTS, COMMENTS_NUMBER),
        description: MOCK_DESCRIPTION[getRandomNumber(0, MOCK_DESCRIPTION.length - 1)]
      };
    }

    return pictures.sort(shuffleArr);
  };

  var generateComments = function (arr, number) {
    arr = arr.concat([]);
    var comments = [];

    for (var i = 0; i < number; i++) {
      var randomIndex = getRandomNumber(0, arr.length - 1);
      comments.push(arr[randomIndex]);
      arr.splice(randomIndex, 1);
    }

    return comments;
  };


  // Create content on page
  var getPicture = function (picture) {
    var pictureElement = pictureTemplate.cloneNode(true);

    pictureElement.querySelector('.picture__img').src = picture.url;
    pictureElement.querySelector('.picture__likes').textContent = picture.likes;
    pictureElement.querySelector('.picture__comments').textContent = picture.comments.length;

    return pictureElement;
  };

  var renderPictures = function (arr) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < arr.length; i++) {
      var currentPicture = getPicture(arr[i]);
      fragment.appendChild(currentPicture);
    }

    picturesDOM.appendChild(fragment);
  };

  var generatedPictures = generatePictures();
  renderPictures(generatedPictures);
})();
