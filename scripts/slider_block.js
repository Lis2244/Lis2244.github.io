let namberOne = document.querySelector('.namber_one');
let namberTwo = document.querySelector('.namber_two');

let textheaderOne = document.querySelector('.london_text_one');
let textheaderTwo = document.querySelector('.london_text_two');

let textheaderitemOne = document.querySelector('.one_name');
let textheaderitemTwo = document.querySelector('.two_name');

let textheaderbox = document.querySelector('.projects_item_header_one');
let textheaderboxTwo = document.querySelector('.projects_item_header_two');

let progectOne = document.querySelector('.gallary_box_one');
let progectTwo = document.querySelector('.gallary_box_two');

let buttonOne = document.querySelector('.button_plus_one');
let buttonTwo = document.querySelector('.button_plus_two');

let transformPlus = document.querySelector('.plus_one');
let transformPlusTwo = document.querySelector('.plus_two');

buttonOne.onclick = function () {
    namberOne.classList.toggle('item_namber_hiden');
    textheaderOne.classList.toggle('london_text_visability');
    textheaderitemOne.classList.toggle('projects_item_name_visability');
    textheaderbox.classList.toggle('projects_item_header_visability');
    progectOne.classList.toggle('display_visability');
    transformPlus.classList.toggle('plus_transform');
}

buttonTwo.onclick = function () {
    namberTwo.classList.toggle('item_namber_hiden');
    textheaderTwo.classList.toggle('london_text_visability');
    textheaderitemTwo.classList.toggle('projects_item_name_visability');
    textheaderboxTwo.classList.toggle('projects_item_header_visability');
    progectTwo.classList.toggle('display_visability');
    transformPlusTwo.classList.toggle('plus_transform');
}