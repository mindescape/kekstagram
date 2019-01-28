'use strict';

(function () {
  var keycode = {
    ESC: 27,
    ENTER: 13
  };

  var resetValue = function (input) {
    input.value = '';
  };

  var checkActionCode = function (evt, key, action) {
    if (evt.keyCode === key) {
      action();
    }
  };

  window.util = {
    keycode: keycode,
    resetValue: resetValue,
    checkActionCode: checkActionCode
  };
})();
