'use strict';

window.util = (function () {
  var ENTER_KEY = 13;
  var ESC_KEY = 27;

  return {
    getRandomNumber: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    isEventEsc: function (evt) {
      return evt.keyCode === ESC_KEY ? true : false;
    },
    isEventEnter: function (evt) {
      return evt.keyCode === ENTER_KEY ? true : false;
    },
    resetValue: function (input) {
      input.value = '';
    }
  };
})();
