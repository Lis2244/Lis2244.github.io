const map = L.map('map')
  .on('load', () => {
    console.log('Карта инициализирована')
  })
  .setView({
    lat: 55.8522,
    lng: 37.5506,
  }, 6);

  L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  ).addTo(map);

  const redPinIcon = L.icon({
    iconUrl: 'images/red_metka.svg',
    iconSize: [40, 52],
    iconAnchor: [20, 52],
  });

  const bluePinIcon = L.icon({
    iconUrl: 'images/blue_metka.svg',
    iconSize: [40, 52],
    iconAnchor: [20, 52],
  });

  const marker1 = L.marker(
    {
        title: 'Рыбхоз Гжелка',
        lat: 55.55582,
        lng: 38.32232,
    },
    {
      icon: redPinIcon,
    },
  );
  const marker2 = L.marker(
    {
        title: 'Платная Рыбалка',
        lat: 55.97102,
        lng: 35.92565,
    },
    {
      icon: redPinIcon,
    },
  );
  const marker3 = L.marker(
    {
        title: 'Рыбхоз Гжелка',
        lat: 55.55540,
        lng: 38.31686,
    },
    {
      icon: redPinIcon,
    },
  );
  const marker4 = L.marker(
    {
        title: 'Коняшинский карьер',
        lat: 55.62697,
        lng: 38.44509,
    },
    {
      icon: bluePinIcon,
    },
  );
  
  marker1.bindPopup("<h3>Рыбхоз Гжелка</h3><img src='/images/gzhelka/gzhelka.jpg' alt='Садок с карпом' width='230' height='300'/><p>Вес рыбы в среднем 1,2кг. <a href='https://gzhelka.club/' target='_blank'>Подробнее</a></p>").addTo(map);
  marker2.bindPopup("<h3>Платная Рыбалка</h3><img src='/images/pagubino/fishing_pagubino.jpg' alt='Садок с рыбой' width='230' height='300'/><p>Вес рыбы в среднем 1кг. <a href='https://yandex.ru/maps/org/platnaya_rybalka/65955710105/?ll=35.924734%2C55.970904&z=17' target='_blank'>Подробнее</a></p>").addTo(map);
  marker3.bindPopup("<h3>Рыбхоз Гжелка</h3><img src='/images/gzhelka/schuka_min.jpg' alt='Щука' width='230' height='300'/><p>Вес рыбы в среднем 0,7кг. <a href='https://gzhelka.club/' target='_blank'>Подробнее</a></p>").addTo(map);
  marker4.bindPopup("<h3>Коняшинский карьер</h3><img src='/images/konyashino/meloch.jpeg' alt='Маленькие рыбки' width='230' height='300'/><p>Вес рыбы в среднем 0,2кг. Мне просто не повезло, говорят тут гиганты водятся</p>").addTo(map);




