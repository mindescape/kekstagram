'use strict';

window.util = (function () {
  var ENTER_KEY = 13;
  var ESC_KEY = 27;

  return {
    getRandomNumber: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    isEventEsc: function (evt, action) {
      if (evt.keyCode === ESC_KEY) {
        action();
      }
    },
    isEventEnter: function (evt, action) {
      if (evt.keyCode === ENTER_KEY) {
        action();
      }
    },
    resetValue: function (input) {
      input.value = '';
    }
  };
})();
