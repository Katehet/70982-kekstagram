'use strict';

// HTML-шаблон
var pictureTemplate = document.querySelector('#picture-template').content.querySelector('.picture');

// Место для вставки
var pictures = document.querySelector('.pictures');

// Отвечает за полноэкранный режим
var galleryOverlay = document.querySelector('.gallery-overlay');
var closePicture = galleryOverlay.querySelector('.gallery-overlay-close');

// Хранит комментарии.
var comments = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];

// Хранит общее количество фото
var maxPicturesNumber = 25;

// Коды клавиш
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

// Переменные для работы с формами
var uploadForm = document.querySelector('#upload-select-image');
var fileInput = uploadForm.querySelector('#upload-file');
var editForm = document.querySelector('.upload-overlay');
var closeButton = editForm.querySelector('.upload-form-cancel');

var field = editForm.querySelector('.upload-form-description');

var decreaseButton = editForm.querySelector('.upload-resize-controls-button-dec');
var increaseButton = editForm.querySelector('.upload-resize-controls-button-inc');
var resizeValue = editForm.querySelector('.upload-resize-controls-value').value;

var value = parseInt(resizeValue, 10);
var minPicSize = parseInt(editForm.querySelector('.upload-resize-controls-value').min, 10);
var maxPicSize = parseInt(editForm.querySelector('.upload-resize-controls-value').max, 10);

// var currentPhoto = editForm.querySelector('.effect-image-preview');

// Возвращает сучайное число в диапазоне [min, max) (для лайков)
var getRandomValue = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// Возвращает случайный индекс элемента массива (для выбора комментариев)
var getRandomIndex = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

// Возвращает случайный комментарий (или пару) под фото
var getComment = function () {
  var commentFirst = getRandomIndex(comments);
  if (Math.random() < 0.5) {
    return commentFirst;
  } else {
    return commentFirst + ' ' + getRandomIndex(comments);
  }
};

// Возвращает массив (случайной длины) всех комментариев
var photoComments = function () {
  var arr = [];
  var arrLength = Math.ceil(Math.random() * 10);
  while (arr.length < arrLength) {
    arr.push(getComment());
  }
  return arr;
};

// Возвращает url как строку
var createUrl = function (i) {
  var url = 'photos/' + parseInt(i + 1, 10) + '.jpg';
  return url;
};

// Создает объект - шаблон описания фото
var pictureDescription = function (i) {
  return {
    url: createUrl(i),
    likes: getRandomValue(15, 200),
    comments: photoComments()
  };
};
// var descriptionTemplate = pictureDescription();

// Создает массив - все описания
var descriptions = function () {
  var arrayTemplate = [];
  for (var i = 0; i < maxPicturesNumber; i++) {
    arrayTemplate.push(pictureDescription(i));
  }
  return arrayTemplate;
};
var arrayTemplate = descriptions();

// Создает "клоны" шаблона DOM-узлов описаний фото
var createPictureDescriptions = function (picture) {
  var pictureElement = pictureTemplate.cloneNode(true);
  pictureElement.querySelector('img').src = picture.url;
  pictureElement.querySelector('.picture-likes').textContent = picture.likes;
  pictureElement.querySelector('.picture-comments').textContent = picture.comments.length;

  return pictureElement;
};

// Отрисовывает "клоны" в объекте #document-fragment
var fragment = document.createDocumentFragment();
for (var i = 0; i < maxPicturesNumber; i++) {
  fragment.appendChild(createPictureDescriptions(arrayTemplate[i]));
}
pictures.appendChild(fragment);

// Функции открытия/закрытия картинки
var escapePress = function (event) {
  if (event.keyCode === ESC_KEYCODE) { // Закрытие по нажатию Esc
    closeGallery();
  }
};

var openGallery = function () {
  galleryOverlay.classList.remove('hidden');
  document.addEventListener('keydown', escapePress); // Открытие галереи, прослушка на Esc
};

var closeGallery = function () {
  galleryOverlay.classList.add('hidden');
  document.removeEventListener('keydown', escapePress);// Закрытие галереи, удаление прослушки Esc
};

// Обработчики событий клика/нажатия клавиш
pictures.addEventListener('click', function (event) { // открывает галерею по клику на IMG
  event.preventDefault();
  if (event.target.tagName === 'IMG') {
    openGallery();
    renderOverlayPicture(event);
  }
});

pictures.addEventListener('keydown', function (event) { // Открывает галерею по нажатию Enter при фокусе на picture
  event.preventDefault();
  if (event.keyCode === ENTER_KEYCODE) {
    openGallery();
  }
});

closePicture.addEventListener('keydown', function (event) { // Закрывает галерею по нажатию Enter при фокусе на "крестике"
  event.preventDefault();
  if (event.keyCode === ENTER_KEYCODE) {
    closeGallery();
  }
});

closePicture.addEventListener('click', function () { // Закрывает галерею по клику на "крестик"
  event.preventDefault();
  closeGallery();
});

// Показ/скрытие формы редактирования фото
var onFormEscapePress = function (event) {
  if (event.keyCode === ESC_KEYCODE && !(field === document.activeElement)) {
    closeEditForm();
  }
};
var openEditForm = function () {
  editForm.classList.remove('hidden');
  document.addEventListener('keydown', onFormEscapePress);
};
var closeEditForm = function () {
  editForm.classList.add('hidden');
  document.removeEventListener('keydown', onFormEscapePress);
};

// Обработчики событий форм
fileInput.addEventListener('change', openEditForm); // "Слушает" input[type='file']

closeButton.addEventListener('click', closeEditForm); // "Слушает" клик на "крестик" формы

closeButton.addEventListener('keydown', function () { // "Слушает" нажатие Enter при фокусе на "крестике"
  event.preventDefault();
  if (event.keyCode === ENTER_KEYCODE) {
    closeGallery();
  }
});

// Отрисовывает полноэкранное фото с количеством комментариев и лайков
var renderOverlayPicture = function (event) {
  var clickedPhoto = event.target;
  var clickedPhotoLikes = clickedPhoto.nextElementSibling.querySelector('.picture-likes').textContent;
  var clickedPhotoComments = clickedPhoto.nextElementSibling.querySelector('.picture-comments').textContent;

  galleryOverlay.querySelector('.gallery-overlay-image').src = clickedPhoto.src;
  galleryOverlay.querySelector('.likes-count').textContent = clickedPhotoLikes;
  galleryOverlay.querySelector('.comments-count').textContent = clickedPhotoComments;

};

// Уменьшение фото
decreaseButton.addEventListener('click', function () {
  if (value > minPicSize) {
    value = value - 25;
  }
  resizeValue = value + '%';
  editForm.querySelector('.upload-resize-controls-value').value = resizeValue;
});

// Увеличение фото
increaseButton.addEventListener('click', function () {
  if (value < maxPicSize) {
    value = value + 25;
  }
  resizeValue = value + '%';
  editForm.querySelector('.upload-resize-controls-value').value = resizeValue;
});


// Применение эффектов к фото


renderOverlayPicture();
