const PRODUCTS = [
  { id: "uk-m1", cat: "weapon", title: "ММГ учебный, серия М-1", text: "Массо-габаритный макет для изучения внешнего устройства и неполной разборки на занятии.", price: "от 18 900 ₽", spec: "Полимер + металл фурнитуры. Цвет «оружейный графит». Паспорт и схема узлов в комплекте. Боевой функционал отсутствует." },
  { id: "uk-cut", cat: "weapon", title: "Разрез узла, серия С-2", text: "Цветной разрез для витрины класса. Видны основные группы деталей.", price: "от 27 400 ₽", spec: "Станина витрины 600×280. Подписи гравировкой. Для демонстрации устройства, не для стрелковой практики." },
  { id: "uk-rack", cat: "weapon", title: "Стойка хранения на 6 мест", text: "Классная стойка с замком и нумерацией. Под серию М-1.", price: "от 21 000 ₽", spec: "Сталь, порошковая окраска. Крепление к полу. Журнал выдачи в комплекте." },
  { id: "t-35", cat: "tech", title: "Техника 1:35, линейка «Поле»", text: "Масштабные модели бронетехники для витрины и сравнения силуэтов.", price: "от 9 800 ₽", spec: "Сборная серия, защитное покрытие. Табличка ТТХ учебная, без закрытых данных." },
  { id: "t-16", cat: "tech", title: "Техника 1:16 на подиуме", text: "Крупный макет для центральной витрины кадетского класса.", price: "от 46 000 ₽", spec: "Подиум 700×400, подсветка 12 В, съёмные таблички." },
  { id: "t-cut", cat: "tech", title: "Разрез моторно-трансмиссионного отсека", text: "Учебный срез для кафедры. Крупные цветные зоны.", price: "от 84 000 ₽", spec: "Габарит 1200×500. Рама, оргстекло, легенда цветов." },
  { id: "g-siz", cat: "gear", title: "Линейка СИЗ «Контур»", text: "Макеты средств защиты для разбора комплектации на столе.", price: "от 14 200 ₽", spec: "5 предметов + схема надевания. Учебные образцы без фильтрующих элементов." },
  { id: "g-pack", cat: "gear", title: "Раскладка полевого имущества", text: "Планшет 900×600: состав рюкзака и подсумков по слоям.", price: "от 11 500 ₽", spec: "Печать на композите, живые крепления образцов." },
  { id: "m-aid", cat: "med", title: "Тренажёр первой помощи Т-12", text: "Отработка алгоритма на торсе. Для кабинета ОБЖ и НВП.", price: "от 38 600 ₽", spec: "Сменные расходники, методичка преподавателя, чехол." },
  { id: "m-wall", cat: "med", title: "Стенд «Аптечка и порядок действий»", text: "Три шага + комплектация. Читается с последней парты.", price: "от 7 900 ₽", spec: "ПВХ 5 мм, ламинация, размер 1000×1400." },
  { id: "s-ustav", cat: "stand", title: "Серия стендов «Устав»", text: "6 листов единым модулем. Графика Азимута, не случайный набор плакатов.", price: "от 24 800 ₽", spec: "Алюминиевый профиль, скрытый крепёж, единые поля и шрифт." },
  { id: "s-topo", cat: "stand", title: "Топография и ориентирование", text: "Карта, масштаб, условные знаки, компас как макет.", price: "от 9 400 ₽", spec: "Два листа + накладной компас-макет." }
];

const FAQ = [
  ["Работаете по 44-ФЗ?", "Да. Готовим спецификацию, коммерческое, сроки и комплект закрывающих. Форму закупки подскажем под ваш регламент."],
  ["Это боевые изделия?", "Нет. Только учебные макеты, разрезы и наглядные пособия для класса. Боевой функционал не закладывается."],
  ["Можно только стенды, без «кабинета под ключ»?", "Можно. Каталог продаётся позиционно. Пакеты — для тех, кому нужна расстановка и монтаж."],
  ["Что с доставкой в регион?", "Возим в 36 регионов. До терминала или до кабинета — в смете отдельной строкой."],
  ["Если в классе уже висят старые плакаты?", "Снимаем размеры и предлагаем замену в той же логике стен: чтобы новый ряд не спорил со старым цветом стен."],
  ["Сколько живёт гарантия?", "24 месяца на изделия серии. Расходники тренажёра — отдельным прайсом."]
];

const grid = document.getElementById("grid");
const filters = document.getElementById("filters");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modalBody");
const need = document.getElementById("need");

function cardHTML(p) {
  return `<article class="card" data-cat="${p.cat}" data-id="${p.id}">
    <div class="card__art"><span>${p.id.toUpperCase()}</span></div>
    <div class="card__tag">${label(p.cat)}</div>
    <h3>${p.title}</h3>
    <p>${p.text}</p>
    <div class="card__row"><span class="card__price">${p.price}</span><span>паспорт изд.</span></div>
  </article>`;
}

function label(cat) {
  return ({ weapon: "Учебное оружие", tech: "Техника", gear: "СИЗ", med: "Медицина", stand: "Стенды" })[cat] || cat;
}

function render(list) {
  grid.innerHTML = list.map(cardHTML).join("");
}

render(PRODUCTS);

filters.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-filter]");
  if (!btn) return;
  filters.querySelectorAll(".chip").forEach((c) => c.classList.toggle("is-on", c === btn));
  const f = btn.dataset.filter;
  render(f === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.cat === f));
});

document.querySelectorAll(".cat").forEach((cat) => {
  cat.addEventListener("click", () => {
    document.getElementById("catalog").scrollIntoView();
    const f = cat.dataset.filter;
    const chip = [...filters.querySelectorAll(".chip")].find((c) => c.dataset.filter === f);
    if (chip) chip.click();
  });
});

grid.addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  if (!card) return;
  const p = PRODUCTS.find((x) => x.id === card.dataset.id);
  modalBody.innerHTML = `
    <p class="eyebrow">${label(p.cat)} · ${p.id.toUpperCase()}</p>
    <h2>${p.title}</h2>
    <p class="lead">${p.text}</p>
    <p style="margin-top:12px">${p.spec}</p>
    <p style="margin-top:12px"><strong>${p.price}</strong></p>
    <a class="btn btn--brass" href="#request" id="askItem">Добавить в заявку</a>`;
  modal.hidden = false;
  document.getElementById("askItem").addEventListener("click", () => {
    need.value = p.title;
    modal.hidden = true;
  });
});

document.getElementById("modalClose").onclick = () => (modal.hidden = true);
modal.addEventListener("click", (e) => { if (e.target === modal) modal.hidden = true; });

document.querySelectorAll("[data-kit]").forEach((a) => {
  a.addEventListener("click", () => { need.value = `Комплект: ${a.dataset.kit}`; });
});

document.getElementById("faqList").innerHTML = FAQ.map(
  ([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`
).join("");

document.getElementById("form").addEventListener("submit", (e) => {
  e.preventDefault();
  document.getElementById("formOk").hidden = false;
  e.target.reset();
});

const burger = document.getElementById("burger");
const nav = document.getElementById("nav");
burger.addEventListener("click", () => nav.classList.toggle("is-open"));
nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => nav.classList.remove("is-open")));

window.addEventListener("scroll", () => {
  document.getElementById("header").style.borderBottomColor =
    window.scrollY > 8 ? "rgba(196,163,106,.35)" : "rgba(196,163,106,.22)";
});
