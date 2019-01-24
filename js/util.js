'use strict';

(function () {
  var keycode = {
    ESC: 27,
    ENTER: 13
  };

  var resetValue = function (input) {
    input.value = '';
  };

  window.util = {
    keycode: keycode,
    resetValue: resetValue
  };
})();
