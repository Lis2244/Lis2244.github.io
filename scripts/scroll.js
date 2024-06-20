gsap.fromTo(".header_text", {
    scrollTrigger: ".header_box", // start animation when ".box" enters the viewport
    x: -200,
    opacity: 0,
  }, {
    x: 0,
    opacity: 1,
    duration: 1.2,
    ease: "power4.inOut",
  }, 0.7);

  gsap.fromTo(".header_text_item", {
    scrollTrigger: ".header_box", // start animation when ".box" enters the viewport
    x: 200,
    opacity: 0,
  }, {
    x: 0,
    opacity: 1,
    duration: 1.2,
    ease: "power4.inOut",
  }, 1.2);

  gsap.fromTo(".mobile_svg", {
    scrollTrigger: ".header_box", // start animation when ".box" enters the viewport
    y: 40,
    opacity: 0,
  }, {
    y: 0,
    opacity: 1,
    duration: 2,
    ease: "power4.inOut",
  }, 1.7);
  


/*let tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".box_two",
      start: "top top",
      markers: {startColor: "white", endColor: "white", fontSize: "18px", fontWeight: "bold", indent: 20}, 
      endTrigger: ".box_sevan",
      end: "+=7000", 
      scrub: 2,
   }
  
});

ScrollTrigger.defaults({
  immediateRender: false,
  ease: "power4.inOut",
});



    
tl
.add("box_two", 0)
.add("box_three", 10)
.add("box_for", 20)
.add("box_fife", 30)
.add("box_six", 40)
.add("box_sevan", 50)


// Slide 2
tl
.to(".header_name", {
  x: 100,
  opacity: 0,
  duration: 2,
}, "box_two")


/*.to(camera.rotation, {
  y: 8,
  duration: 4,
}, "kit")
.to(camera.position, {
  y: 8,
  x: 20,
  z: 0,
  duration: 4,
}, "kit")*/
 
// Slide 3

 /* .fromTo(".box_three_header", {
    scrollTrigger: {
      trigger: ".box_three",
      start: "top top",
    }, // start animation when ".box" enters the viewport
    y: 300,
    opacity: 0,
  }, {
    y: 0,
    opacity: 1,
    duration: 2,
    onUpdate: function() {
      camera.lookAt( 0, 0, 0 );
    }}, "box_three")
    .fromTo(".clok_heading", {
      scrollTrigger: ".clok_heading", // start animation when ".box" enters the viewport
      y: 300,
      opacity: 0,
    }, {
      y: 0,
      opacity: 1,
      duration: 2,
      delay: 1.2,
      onUpdate: function() {
        camera.lookAt( 0, 0, 0 );
      }}, "box_three")
      .fromTo(".clok_text", {
        scrollTrigger: ".clok_heading", // start animation when ".box" enters the viewport
        y: 300,
        opacity: 0,
      }, {
        y: 0,
        opacity: 1,
        duration: 2,
        delay: 3.2,
        ease: "power4.inOut",
        onUpdate: function() {
          camera.lookAt( 0, 0, 0 );
        }}, "box_three")
        .to(camera.position, {
          x: 0,
          y: 0,
          z: 6, 
          duration: 2,
          onUpdate: function() {
            camera.lookAt( 0, 0, 0 );
          }}, "box_three")



// Slide 4*/