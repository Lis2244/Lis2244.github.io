const map = L.map('map')
  .on('load', () => {
    console.log('Карта инициализирована')
  })
  .setView({
    lat: 45.07523,
    lng: 38.90142,
  }, 11);

  L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  ).addTo(map);


  const marker1 = L.marker(
    {
        title: 'Остап зарыл хабар',
        lat: 45.07627,
        lng: 38.90765,
    },
  );
  const marker2 = L.marker(
    {
        title: 'Здесь Остап учил Пашу грамоте',
        lat: 45.03726,
        lng: 38.95262,
    },
  );
  const marker3 = L.marker(
    {
        title: 'Пойман огромный Сом',
        lat: 45.02832,
        lng: 38.99170,
    },
  );
  const marker4 = L.marker(
    {
        title: 'Здесь любит рыбачить Флат-флат',
        lat: 45.00699,
        lng: 38.99674,
    },
  );
  
  marker1.bindPopup("<h3>Остап зарыл хабар</h3><img src='/images/photo_5192669423289354643_y.jpg' alt='Картинка' width='100' height='120'/>").addTo(map);
  marker2.bindPopup("<h3>Здесь Остап учил Пашу грамоте</h3><img src='/images/draka.jpg' alt='Картинка' width='160' height='120'/>").addTo(map);
  marker3.bindPopup("<h3>Пойман огромный Сом</h3><img src='/images/som.jpeg' alt='Картинка' width='100' height='120'/>").addTo(map);
  marker4.bindPopup("<h3>Здесь любит рыбачить Флат-флат</h3><img src='/images/fishing.jpg' alt='Картинка' width='170' height='120'/>").addTo(map);




