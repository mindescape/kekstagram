'use strict';

window.util = (function () {
  var ENTER_KEY = 13;
  var ESC_KEY = 27;

  return {
    onError: function (message) {
      var node = document.createElement('div');
      node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
      node.style.position = 'fixed';
      node.style.left = 0;
      node.style.right = 0;
      node.style.padding = '4px 0';
      node.style.fontSize = '30px';

      node.textContent = message;
      document.body.insertAdjacentElement('afterbegin', node);
    },
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
