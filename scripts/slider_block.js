let namberOne = document.querySelector('.projects_item_namber');

let textheaderOne = document.querySelector('.london_text');

let textheaderitemOne = document.querySelector('.projects_item_name');

let textheaderbox = document.querySelector('.projects_item_header');

let progectOne = document.querySelector('.gallary_box_one');

let buttonOne = document.querySelector('.button_plus_one');

let transformPlus = document.querySelector('.plus');

buttonOne.onclick = function () {
    namberOne.classList.toggle('item_namber_hiden');
    textheaderOne.classList.toggle('london_text_visability');
    textheaderitemOne.classList.toggle('projects_item_name_visability');
    textheaderbox.classList.toggle('projects_item_header_visability');
    progectOne.classList.toggle('display_visability');
    transformPlus.classList.toggle('plus_transform');
}