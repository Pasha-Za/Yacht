let MobileDetect = require('mobile-detect'),
md = new MobileDetect(window.navigator.userAgent);

export default function header() {

  // burger
  $('.burger').on('click',function (e) {
    e.preventDefault();
    if (!$(this).hasClass('cross')) {
      $(this).addClass('cross');
      $('.header__nav').addClass('active');
      $('.header__additions').addClass('active');
    } else {
      $(this).removeClass('cross');
      $('.header__nav').removeClass('active');
      $('.header__additions').removeClass('active');
    }
  });
}
