var swiper = new Swiper(".mySwiper", {
    effect: "coverflow",
    grabCursor: true,
    watchSlidesProgress: true,
    centeredSlides: true,
    loop: true,
    slidesPerView: "auto",
    coverflowEffect: {
      rotate: 0,
      stretch: 0,
      depth: 900,
      modifier: 1,
      slideShadows: false,
    },
    mousewheel: {
        invert: true,
      },
    /*pagination: {
      el: ".swiper-pagination",
    },*/
  });

