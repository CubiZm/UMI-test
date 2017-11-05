'use strict'

const menuBtn = document.querySelector('.menu-button');
const menu = document.querySelector('.menu');
const userForm = document.querySelector('.user-form');

const onClickHandler = (evt) => {
  menu.classList.toggle('isActiveMenu');
  userForm.classList.toggle('isActiveUser');

  menuBtn.classList.toggle('menu-button--open');
  menuBtn.classList.toggle('menu-button--close');
}

menuBtn.addEventListener('click', onClickHandler);
