gsap.registerPlugin(ScrollTrigger);

gsap.fromTo(".header_text", {
    scrollTrigger: ".header_box", // start animation when ".box" enters the viewport
    x: -200,
    opacity: 0,
  }, {
    x: 0,
    opacity: 1,
    duration: 1.2,
    ease: "expo.out"
  }, 0.7);

  gsap.fromTo(".header_text_item", {
    scrollTrigger: ".header_box", // start animation when ".box" enters the viewport
    x: 200,
    opacity: 0,
  }, {
    x: 0,
    opacity: 1,
    duration: 1.2,
    ease: "expo.out"
  }, 1);

  gsap.fromTo(".mobile_oblozhka", {
    scrollTrigger: ".header_box", // start animation when ".box" enters the viewport
    opacity: 0,
  }, {
    opacity: 1,
    duration: 2,
    ease: "expo.out"
  }, 1.2);

  gsap.fromTo(".mobile_svg", {
    scrollTrigger: ".header_box", // start animation when ".box" enters the viewport
    y: 40,
    opacity: 0,
  }, {
    y: 0,
    opacity: 1,
    duration: 2,
    ease: "expo.out"
  }, 1.5);

  gsap.fromTo(".list_one", {
    scrollTrigger: ".list_one", // start animation when ".box" enters the viewport
    opacity: 0,
  }, {
    opacity: 1,
    duration: 1.5,
    ease: "expo.out"
  }, 1.4);

  gsap.fromTo(".list_two", {
    scrollTrigger: ".list_two", // start animation when ".box" enters the viewport
    opacity: 0,
  }, {
    opacity: 1,
    duration: 1.5,
    ease: "expo.out"
  }, 1.4);

  gsap.fromTo(".list_three", {
    scrollTrigger: ".list_three", // start animation when ".box" enters the viewport
    opacity: 0,
  }, {
    opacity: 1,
    duration: 1.5,
    ease: "expo.out"
  }, 1.4);

  

  

 let tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".button_phone_navigation_scroll",
      start: "top 95%", 
     // markers: true,
      //endTrigger: ".information_box",
      end: "+=500",
      scrub: 3

   }
  
});

let tl2 = gsap.timeline({
    scrollTrigger: {
      trigger: ".information_box",
      start: "top 99%", 
      //endTrigger: ".information_box",
      end: "+=1500",
      scrub: 3

   }
  
});

let tl3 = gsap.timeline({
    scrollTrigger: {
      trigger: ".portfolio",
      start: "top 95%", 
      //endTrigger: ".information_box",
      end: "+=1200",
      scrub: 3

   }
  
});

let tl4 = gsap.timeline({
    scrollTrigger: {
      trigger: ".our_services_box",
      start: "top 95%", 
      //endTrigger: ".information_box",
      end: "+=800",
      scrub: 3

   }
  
});

let tl5 = gsap.timeline({
    scrollTrigger: {
      trigger: ".button_services",
      start: "top 95%", 
      //endTrigger: ".information_box",
      end: "+=700",
      scrub: 3

   }
  
});

let tl6 = gsap.timeline({
    scrollTrigger: {
      trigger: ".reviews_box",
      start: "top 95%", 
      //endTrigger: ".information_box",
      end: "+=800",
      scrub: 3

   }
  
});

let tl7 = gsap.timeline({
    scrollTrigger: {
      trigger: ".contacts_box",
      start: "top 95%", 
      //endTrigger: ".information_box",
      end: "+=800",
      scrub: 3

   }
  
});

let tl8 = gsap.timeline({
    scrollTrigger: {
      trigger: ".button_form",
      start: "top 95%", 
      //endTrigger: ".information_box",
      end: "+=600",
      scrub: 3

   }
  
});




tl.fromTo(".button_phone_navigation_scroll", {
    scrollTrigger: {
        trigger: ".button_phone_navigation_scroll",
        start: "top top", 
        end: "+=200"
        //markers: true, 

     },
    x: -90,
    opacity: 0,
  }, {
    x: 0,
    opacity: 1,
    duration: 2,
    delay: 0.2,
    ease: "expo.out"
  });

tl2.fromTo(".header_text_one", {
    scrollTrigger: {
        trigger: ".about_as_header",
        start: "top top", 
        end: "+=200" 

     },
    x: -90,
    opacity: 0,
  }, {
    x: 0,
    opacity: 1,
    duration: 2,
    delay: 0.2,
    ease: "expo.out"
  })

  .fromTo(".as_information_header_nav", {
    scrollTrigger: {
        trigger: ".about_as_header",
        start: "top center", 
        end: "+=200" 
        //scrub: 2
     },
    x: 90,
    opacity: 0,
  }, {
    x: 0,
    opacity: 1,
    duration: 2,
    delay: 0.1,
    ease: "expo.out"
  })
  .fromTo(".information_text_nav", {
    scrollTrigger: {
        trigger: ".about_as_header",
        start: "top top", 
        end: "+=100"
       // markers: true, 
       // scrub: 2
     },
    x: 90,
    opacity: 0,
  }, {
    x: 0,
    opacity: 1,
    duration: 2,
    delay: 0.1,
    ease: "expo.out"
  })
  .fromTo(".information_text_two", {
    scrollTrigger: {
        trigger: ".about_as_header",
        start: "top top", 
        end: "+=100"
       // markers: true, 
       // scrub: 2
     },
    x: 90,
    opacity: 0,
  }, {
    x: 0,
    opacity: 1,
    duration: 2,
    delay: 0.1,
    ease: "expo.out"
  })
  .fromTo(".as_img", {
    scrollTrigger: {
        trigger: ".about_as_header",
        start: "top top", 
        end: "+=200"
       // markers: true, 
        //scrub: 2
     },
    scale: 0.2,
    opacity: 0,
  }, {
    scale: 1,
    opacity: 1,
    duration: 2,
    delay: 0.1,
    ease: "expo.out"
  })

  tl3.fromTo(".header_text_two", {
    scrollTrigger: {
        trigger: ".about_as_header",
        start: "top top", 
        end: "+=200" 
       // scrub: 2
     },
    x: -90,
    opacity: 0,
  }, {
    x: 0,
    opacity: 1,
    duration: 2,
    delay: 1.3,
    ease: "expo.out"
  })
  .fromTo(".portfolio_information_header", {
    scrollTrigger: {
        trigger: ".about_as_header",
        start: "top top", 
        end: "+=200" 
        //scrub: 2
     },
    x: 90,
    opacity: 0,
  }, {
    x: 0,
    opacity: 1,
    duration: 2,
    delay: 0.1,
    ease: "expo.out"
  })
  .fromTo(".text_portfolio", {
    scrollTrigger: {
        trigger: ".about_as_header",
        start: "top top", 
        end: "+=200"
       // markers: true, 
        //scrub: 2
     },
    x: 90,
    opacity: 0,
  }, {
    x: 0,
    opacity: 1,
    duration: 2,
    delay: 0.3,
    ease: "expo.out"
  })
  .fromTo(".button_portfolio", {
    scrollTrigger: {
        trigger: ".about_as_header",
        start: "top top", 
        end: "+=100"
       // markers: true, 
        //scrub: 2
     },
    x: -90,
    opacity: 0,
  }, {
    x: 0,
    opacity: 1,
    duration: 2,
    delay: 0.7,
    ease: "expo.out"
  })
  tl4.fromTo(".header_text_three", {
    scrollTrigger: {
        trigger: ".about_as_header",
        start: "top top", 
        end: "+=200" 
        //scrub: 2
     },
    x: -90,
    opacity: 0,
  }, {
    x: 0,
    opacity: 1,
    duration: 2,
    delay: 1.3,
    ease: "expo.out"
  })
  .fromTo(".information_text_services", {
    scrollTrigger: {
        trigger: ".about_as_header",
        start: "top top", 
        end: "+=200" 
        //scrub: 2
     },
    x: 90,
    opacity: 0,
  }, {
    x: 0,
    opacity: 1,
    duration: 2,
    delay: 0.1,
    ease: "expo.out"
  })
  .fromTo(".text_service", {
    scrollTrigger: {
        trigger: ".about_as_header",
        start: "top top", 
        end: "+=200" 
        //scrub: 2
     },
    x: 90,
    opacity: 0,
  }, {
    x: 0,
    opacity: 1,
    duration: 2,
    delay: 0.1,
    ease: "expo.out"
  })
  tl5.fromTo(".button_services", {
    scrollTrigger: {
        trigger: ".about_as_header",
        start: "top top", 
        end: "+=100"
       // markers: true, 
        //scrub: 2
     },
    x: -90,
    opacity: 0,
  }, {
    x: 0,
    opacity: 1,
    duration: 2,
    delay: 0.7,
    ease: "expo.out"
  })
  tl6.fromTo(".reviews_box_header", {
    scrollTrigger: {
        trigger: ".reviews_box",
        start: "top top", 
        end: "+=200" 
        //scrub: 2
     },
    x: 90,
    opacity: 0,
  }, {
    x: 0,
    opacity: 1,
    duration: 2,
    delay: 0.1,
    ease: "expo.out"
  })
  tl7.fromTo(".header_text_for", {
    scrollTrigger: {
        trigger: ".about_as_header",
        start: "top top", 
        end: "+=200" 
        //scrub: 2
     },
    x: -90,
    opacity: 0,
  }, {
    x: 0,
    opacity: 1,
    duration: 2,
    delay: 0.3,
    ease: "expo.out"
  })
  .fromTo(".contacts_information_header", {
    scrollTrigger: {
        trigger: ".contacts_box_header",
        start: "top top", 
        end: "+=200"
        //scrub: 2
     },
    x: 90,
    opacity: 0,
  }, {
    x: 0,
    opacity: 1,
    duration: 2,
    delay: 0.1,
    ease: "expo.out"
  })
  .fromTo(".contacts_form_text", {
    scrollTrigger: {
        trigger: ".contacts_box_header",
        start: "top top", 
        end: "+=200" 
       // scrub: 2
     },
    x: 90,
    opacity: 0,
  }, {
    x: 0,
    opacity: 1,
    duration: 2,
    delay: 0.1,
    ease: "expo.out"
  })
  tl8.fromTo(".button_form", {
    scrollTrigger: {
        trigger: ".button_form",
        start: "top top", 
        end: "+=200"
       // markers: true, 
       // scrub: 2
     },
    x: -90,
    opacity: 0,
  }, {
    x: 0,
    opacity: 1,
    duration: 2,
    delay: 0.7,
    ease: "expo.out"
  })

  
  

    //contacts_information_header
  /*.fromTo(".about_as_header", { 
    scrollTrigger: {
        trigger: ".about_as_header",
        start: "top top", 
        endTrigger: ".box_sevan",
        end: "+=7000", 
        scrub: 2,
     },
    x: -30,
    opacity: 0
  }, {
    x: 0,
    opacity: 1,
    duration: 2
  })*/


  


