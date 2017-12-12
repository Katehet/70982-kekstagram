'use strict';

// HTML-шаблон
var pictureTemplate = document.querySelector('#picture-template').content.querySelector('.picture');

// Место для вставки
var pictures = document.querySelector('.pictures');

// Хранит комментарии.
var comments = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];

// Хранит общее количество фото
var maxPicturesNumber = 25;

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
    comments: getComment()
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
var createPictureDescriptions = function () {
  var pictureElement = pictureTemplate.cloneNode(true);
  pictureElement.querySelector('img').src = arrayTemplate[i].url;
  pictureElement.querySelector('.picture-likes').textContent = arrayTemplate[i].likes;
  pictureElement.querySelector('.picture-comments').textContent = arrayTemplate[i].comments;

  return pictureElement;
};

// Отрисовывает "клоны" в объекте #document-fragment
var fragment = document.createDocumentFragment();
for (var i = 0; i < 25; i++) {
  fragment.appendChild(createPictureDescriptions(arrayTemplate[i]));
}
pictures.appendChild(fragment);

// Показывает overlay
var galleryOverlay = document.querySelector('.gallery-overlay');
galleryOverlay.classList.remove('hidden');

// Отрисовывает всплывающее фото с количеством комментариев и лайков
var createOverlayDescription = function () {
  galleryOverlay.querySelector('.gallery-overlay-image').src = arrayTemplate[0].url;
  galleryOverlay.querySelector('.likes-count').textContent = arrayTemplate[0].likes;
  galleryOverlay.querySelector('.comments-count').textContent = arrayTemplate[0].comments.length;
};
createOverlayDescription();


