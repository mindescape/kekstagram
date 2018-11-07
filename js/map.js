'use strict';

var numbers = ['01', '02', '03', '04', '05', '06', '07', '08'];
var titles = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var locationX = ['100', '200', '300', '400', '500', '600', '700', '800'];
var locationY = ['100', '200', '300', '400', '500', '600', '700', '800'];
var types = ['palace', 'flat', 'house', 'bungalo'];
var checks = ['12:00', '13:00', '14:00'];
var features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var photos = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var getRandomElement = function (array) {
  var randomNumber = Math.floor(Math.random() * array.length);
  var randomElement = array[randomNumber];
  array.splice(randomNumber, 1);
  return randomElement;
};

var generateSimilarAd = function () {
  return {
    author: {
      avatar: 'img/avatars/user' + getRandomElement(numbers) + '.png'
    },
    offer: {
      title: getRandomElement(titles),
      address: location.x + ', ' + location.y,
      price: Math.floor(Math.random() * 1000001) + 1000,
      type: getRandomElement(types),
      rooms: Math.floor(Math.random() * 5) + 1,
      guests: Math.floor(Math.random() * 10) + 1,
      checkin: getRandomElement(checks),
      checkout: getRandomElement(checks),
      features: features.slice(0, Math.floor(Math.random() * features.length) + 1),
      description: '',
      photos: [getRandomElement(photos), getRandomElement(photos), getRandomElement(photos)]
    },
    location: {
      x: Math.floor(Math.random() * 100),
      y: Math.floor(Math.random() * 631) + 130
    }
  };
};

var similarAds = [];

for (var i = 0; i < 8; i++) {
  similarAds.push(generateSimilarAd());
}
