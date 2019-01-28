'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var readFile = function () {
    var file = window.form.fileUpload.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (type) {
      return fileName.endsWith(type);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        window.form.imagePreview.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  };

  window.photo = {
    readFile: readFile
  };
})();
