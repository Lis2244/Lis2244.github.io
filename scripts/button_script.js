var forEach=function(t,o,r){if("[object Object]"===Object.prototype.toString.call(t))for(var c in t)Object.prototype.hasOwnProperty.call(t,c)&&o.call(r,t[c],c,t);else for(var e=0,l=t.length;l>e;e++)o.call(r,t[e],e,t)};

    var hamburgers = document.querySelectorAll(".hamburger");
    var navigationServis = document.querySelector(".services_box");

    var poliveButton = document.querySelector(".polive_button");
    var landcpacingButton = document.querySelector(".landcpacing_button");
    var gazonButton = document.querySelector(".gazon_button");
    var kamenButton = document.querySelector(".kamen_button");
    var lighButton = document.querySelector(".light_button");
    var architectButton = document.querySelector(".architectura_button");
    var contactsButton = document.querySelector(".contacts_button");
    var portfolioButton = document.querySelector(".portfolio_button");
    var uhodButton = document.querySelector(".uhod_button");

    if (hamburgers.length > 0) {
      forEach(hamburgers, function(hamburger) {
        hamburger.addEventListener("click", function() {
          this.classList.toggle("is-active");
          navigationServis.classList.toggle("services_box_active");
          poliveButton.classList.toggle("startposition");
          landcpacingButton.classList.toggle("startposition");
          gazonButton.classList.toggle("startposition");
          kamenButton.classList.toggle("startposition");
          lighButton.classList.toggle("startposition");
          architectButton.classList.toggle("startposition");
          contactsButton.classList.toggle("startposition");
          portfolioButton.classList.toggle("startposition");
          uhodButton.classList.toggle("startposition");
          //serviceButton.classList.toggle("");
        }, false);
      });
    }

