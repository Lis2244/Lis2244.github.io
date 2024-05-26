let namberOne = document.querySelector('.text_one');
let namberTwo = document.querySelector('.text_two');
let namberThree = document.querySelector('.text_three');
let namberFor = document.querySelector('.text_for');
let namberFife = document.querySelector('.text_fife');
let namberSix = document.querySelector('.text_six');
let namberSevan = document.querySelector('.text_sevan');


let progectOne = document.querySelector('.gallary_box_one');
let progectTwo = document.querySelector('.gallary_box_two');
let progectThree = document.querySelector('.gallary_box_three');
let progectFor = document.querySelector('.gallary_box_for');
let progectFife = document.querySelector('.gallary_box_fife');
let progectSix = document.querySelector('.gallary_box_six');
let progectSevan = document.querySelector('.gallary_box_sevan');


let buttonOne = document.querySelector('.button_plus_one');
let buttonTwo = document.querySelector('.button_plus_two');
let buttonThree = document.querySelector('.button_plus_three');
let buttonFor = document.querySelector('.button_plus_for');
let buttonFife = document.querySelector('.button_plus_fife');
let buttonSix = document.querySelector('.button_plus_six');
let buttonSevan = document.querySelector('.button_plus_sevan');


let transformPlusOne = document.querySelector('.plus_one');
let transformPlusTwo = document.querySelector('.plus_two');
let transformPlusThree = document.querySelector('.plus_three');
let transformPlusFor = document.querySelector('.plus_for');
let transformPlusFife = document.querySelector('.plus_fife');
let transformPlusSix = document.querySelector('.plus_six');
let transformPlusSevan = document.querySelector('.plus_sevan');


buttonOne.onclick = function () {
    namberOne.classList.toggle('item_heding_hiden');
    progectOne.classList.toggle('display_visability');
    transformPlusOne.classList.toggle('plus_transform');
}

buttonTwo.onclick = function () {
    namberTwo.classList.toggle('item_heding_hiden');
    progectTwo.classList.toggle('display_visability');
    transformPlusTwo.classList.toggle('plus_transform');
}

buttonThree.onclick = function () {
    namberThree.classList.toggle('item_heding_hiden');
    progectThree.classList.toggle('display_visability');
    transformPlusThree.classList.toggle('plus_transform');
}

buttonFor.onclick = function () {
    namberFor.classList.toggle('item_heding_hiden');
    progectFor.classList.toggle('display_visability');
    transformPlusFor.classList.toggle('plus_transform');
}

buttonFife.onclick = function () {
    namberFife.classList.toggle('item_heding_hiden');
    progectFife.classList.toggle('display_visability');
    transformPlusFife.classList.toggle('plus_transform');
}

buttonSix.onclick = function () {
    namberSix.classList.toggle('item_heding_hiden');
    progectSix.classList.toggle('display_visability');
    transformPlusSix.classList.toggle('plus_transform');
}

buttonSevan.onclick = function () {
    namberSevan.classList.toggle('item_heding_hiden');
    progectSevan.classList.toggle('display_visability');
    transformPlusSevan.classList.toggle('plus_transform');
}
