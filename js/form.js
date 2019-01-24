'use strict';

(function () {
  var uploadButton = document.querySelector('#upload-file');
  var uploadCancelButton = document.querySelector('#upload-cancel');
  var uploadOverlay = document.querySelector('.img-upload__overlay');
  var imageUploadPreview = document.querySelector('.img-upload__preview');
  var imagePreview = imageUploadPreview.querySelector('img');


  var hideUploadOverlay = function () {
    uploadOverlay.classList.add('hidden');
    window.util.resetValue(uploadButton);
  };

  var onUploadButtonClick = function () {
    uploadOverlay.classList.remove('hidden');
    window.photo.readFile();
  };

  uploadCancelButton.addEventListener('click', hideUploadOverlay);
  uploadButton.addEventListener('change', onUploadButtonClick);

  window.form = {
    fileUpload: uploadButton,
    imagePreview: imagePreview
  };

})();
