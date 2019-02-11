'use strict';

(function () {

  var Keycode = {
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

  var searchDuplicate = function (el, arr) {
    var duplicate = 0;

    for (var i = 0; i < arr.length; i++) {
      if (duplicate > 1) {
        break;
      }
      if (arr[i] === el) {
        duplicate += 1;
      }
    }

    return duplicate;
  };

  window.util = {
    Keycode: Keycode,
    resetValue: resetValue,
    checkActionCode: checkActionCode,
    searchDuplicate: searchDuplicate
  };
})();
