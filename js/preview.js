'use strict';

(function () {

  var AVATAR_SIZE = '35';
  var COMMENTS_COUNT = 5;

  var body = document.querySelector('body');
  var bigPicture = document.querySelector('.big-picture');
  var bigPictureImg = bigPicture.querySelector('img');
  var likesCount = bigPicture.querySelector('.likes-count');
  var socialCaption = bigPicture.querySelector('.social__caption');
  var commentsCount = bigPicture.querySelector('.comments-count');
  var commentsList = bigPicture.querySelector('.social__comments');
  var socialCommentCount = bigPicture.querySelector('.social__comment-count');
  var socialCommentLoad = bigPicture.querySelector('.comments-loader');
  var bigPictureCloseButton = bigPicture.querySelector('#picture-cancel');
  var currentPicture;


  // Create element
  var createElement = function (tagName, className, text) {
    var element = document.createElement(tagName);
    element.classList.add(className);

    if (text) {
      element.textContent = text;
    }

    return element;
  };


  // Create comment
  var createComment = function (comment) {
    var commentItem = createElement('li', 'social__comment');
    var avatar = createElement('img', 'social__picture');

    avatar.src = comment.avatar;
    avatar.alt = comment.name;
    avatar.width = AVATAR_SIZE;
    avatar.height = AVATAR_SIZE;

    commentItem.classList.add('social__text');
    commentItem.appendChild(avatar);
    commentItem.appendChild(document.createTextNode(comment.message));

    return commentItem;
  };


  // Add comments
  var addComments = function (picture) {
    var fragment = document.createDocumentFragment();
    var commentsRenderCount = picture.comments.length > COMMENTS_COUNT ? COMMENTS_COUNT : picture.comments.length;
    var comments = picture.comments.slice(0, commentsRenderCount);

    comments.forEach(function (comment) {
      fragment.appendChild(createComment(comment));
    });

    commentsList.appendChild(fragment);
  };

  var setSocialCommentsCount = function (currentCount, totalCount) {
    socialCommentCount.innerHTML = currentCount + ' из <span class="comments-count">' + totalCount + '</span> комментариев';
  };

  var addMoreComments = function (picture) {
    var fragment = document.createDocumentFragment();
    var addedComments = document.querySelectorAll('.social__comment');

    var commentsRenderCount = picture.comments.length - addedComments.length >= COMMENTS_COUNT ?
      addedComments.length + COMMENTS_COUNT :
      picture.comments.length;

    var comments = picture.comments.slice(addedComments.length, commentsRenderCount);
    var addedCommentsCount = addedComments.length + comments.length;

    comments.forEach(function (comment) {
      fragment.appendChild(createComment(comment));
    });

    if (addedCommentsCount === picture.comments.length) {
      socialCommentLoad.classList.add('visually-hidden');
    }

    setSocialCommentsCount(addedCommentsCount, picture.comments.length);
    commentsList.appendChild(fragment);
  };


  // Show big picture
  var fillOverlay = function (picture) {
    currentPicture = picture;
    bigPictureImg.src = picture.url;
    likesCount.textContent = picture.likes;
    commentsCount.textContent = picture.comments.length;
    socialCaption.textContent = picture.description;

    commentsList.innerHTML = '';
    addComments(picture);

    bigPicture.classList.remove('hidden');
    body.classList.add('modal-open');

    if (picture.comments.length < COMMENTS_COUNT) {
      setSocialCommentsCount(picture.comments.length, picture.comments.length);
      socialCommentLoad.classList.add('visually-hidden');
    } else {
      setSocialCommentsCount(COMMENTS_COUNT, picture.comments.length);
      socialCommentLoad.classList.remove('visually-hidden');
      socialCommentLoad.addEventListener('click', onSocialCommentLoadClick);
    }

    document.addEventListener('keydown', onBigPictureEscPress);
    document.addEventListener('click', onOutsideBigPictureClick);
    bigPictureCloseButton.addEventListener('click', onBigPictureCloseClick);
  };

  var hideBigPicture = function () {
    body.classList.remove('modal-open');
    bigPicture.classList.add('hidden');

    document.removeEventListener('keydown', onBigPictureEscPress);
    document.removeEventListener('click', onOutsideBigPictureClick);
    bigPictureCloseButton.removeEventListener('click', onBigPictureCloseClick);
    socialCommentLoad.removeEventListener('click', onSocialCommentLoadClick);
  };

  var onBigPictureCloseClick = function () {
    hideBigPicture();
  };

  var onBigPictureEscPress = function (evt) {
    window.util.checkActionCode(evt, window.util.Keycode.ESC, hideBigPicture);
  };

  var onOutsideBigPictureClick = function (evt) {
    if (evt.target === bigPicture) {
      hideBigPicture();
    }
  };

  var onSocialCommentLoadClick = function () {
    addMoreComments(currentPicture);
  };

  window.preview = {
    fillOverlay: fillOverlay
  };

})();
