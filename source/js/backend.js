'use strict';

(function () {

  var URL = {
    DOWNLOAD: 'https://js.dump.academy/kekstagram/data',
    UPLOAD: 'https://js.dump.academy/kekstagram/'
  };

  var STATUS = {
    TIMEOUT: 10000,
    OK: 200
  };

  var createXHR = function (url, method, onLoad, onError, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === STATUS.OK) {
        return onLoad(xhr.response);
      }

      return onError('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = STATUS.TIMEOUT;

    xhr.open(method, url);
    xhr.send(data);
  };


  // Get data
  var downloadData = function (onLoad, onError) {
    createXHR(URL.DOWNLOAD, 'GET', onLoad, onError);
  };


  // Receive data
  var uploadData = function (data, onLoad, onError) {
    createXHR(URL.UPLOAD, 'POST', onLoad, onError, data);
  };

  window.backend = {
    downloadData: downloadData,
    uploadData: uploadData
  };
})();
