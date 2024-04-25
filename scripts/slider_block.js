let namberOne = document.querySelector('.namber_one');
let namberTwo = document.querySelector('.namber_two');
let namberThree = document.querySelector('.namber_three');
let namberFor = document.querySelector('.namber_for');
let namberFife = document.querySelector('.namber_fife');

let textheaderOne = document.querySelector('.london_text_one');
let textheaderTwo = document.querySelector('.london_text_two');
let textheaderThree = document.querySelector('.london_text_three');
let textheaderFor = document.querySelector('.london_text_for');
let textheaderFife = document.querySelector('.london_text_fife');

let textheaderitemOne = document.querySelector('.one_name');
let textheaderitemTwo = document.querySelector('.two_name');
let textheaderitemThree = document.querySelector('.three_name');
let textheaderitemFor = document.querySelector('.for_name');
let textheaderitemFife = document.querySelector('.fife_name');

let textheaderbox = document.querySelector('.projects_item_header_one');
let textheaderboxTwo = document.querySelector('.projects_item_header_two');
let textheaderboxThree = document.querySelector('.projects_item_header_three');
let textheaderboxFor = document.querySelector('.projects_item_header_for');
let textheaderboxFife = document.querySelector('.projects_item_header_fife');

let progectOne = document.querySelector('.gallary_box_one');
let progectTwo = document.querySelector('.gallary_box_two');
let progectThree = document.querySelector('.gallary_box_three');
let progectFor = document.querySelector('.gallary_box_for');
let progectFife = document.querySelector('.gallary_box_fife');

let buttonOne = document.querySelector('.button_plus_one');
let buttonTwo = document.querySelector('.button_plus_two');
let buttonThree = document.querySelector('.button_plus_three');
let buttonFor = document.querySelector('.button_plus_for');
let buttonFife = document.querySelector('.button_plus_fife');

let transformPlus = document.querySelector('.plus_one');
let transformPlusTwo = document.querySelector('.plus_two');
let transformPlusThree = document.querySelector('.plus_three');
let transformPlusFor = document.querySelector('.plus_for');
let transformPlusFife = document.querySelector('.plus_fife');

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

buttonThree.onclick = function () {
    namberThree.classList.toggle('item_namber_hiden');
    textheaderThree.classList.toggle('london_text_visability');
    textheaderitemThree.classList.toggle('projects_item_name_visability');
    textheaderboxThree.classList.toggle('projects_item_header_visability');
    progectThree.classList.toggle('display_visability');
    transformPlusThree.classList.toggle('plus_transform');
}

buttonFor.onclick = function () {
    namberFor.classList.toggle('item_namber_hiden');
    textheaderFor.classList.toggle('london_text_visability');
    textheaderitemFor.classList.toggle('projects_item_name_visability');
    textheaderboxFor.classList.toggle('projects_item_header_visability');
    progectFor.classList.toggle('display_visability');
    transformPlusFor.classList.toggle('plus_transform');
}

buttonFife.onclick = function () {
    namberFife.classList.toggle('item_namber_hiden');
    textheaderFife.classList.toggle('london_text_visability');
    textheaderitemFife.classList.toggle('projects_item_name_visability');
    textheaderboxFife.classList.toggle('projects_item_header_visability');
    progectFife.classList.toggle('display_visability');
    transformPlusFife.classList.toggle('plus_transform');
}