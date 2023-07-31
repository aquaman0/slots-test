(function ($) {

  "use strict";
  var owl = $('.games-slider');

    owl.owlCarousel({
      animateOut: 'fadeOut',
      loop: false,
      autoplayHoverPause: false,
      autoplay: false,
      smartSpeed: 1000,
      stagePadding: 100,
      dots: false,
      nav: false,
      responsiveClass: true,
      responsive: {
        0: {
          items: 1,
        },
        500: {
          items: 3,
        },
        1000: {
          items: 3,
        }
      }
    });
})(jQuery);
