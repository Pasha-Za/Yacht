export default function customSwitcher() {
  $('.custom-switcher').each(function () {
    if ($(this).hasClass('disabled')) {
      $(this).find('.custom input').prop('disabled', true);
    }
  });
  $('.custom-switcher .custom').on('click', function() {
    if (!$(this).parents('.custom-switcher').hasClass('disabled')) {
      let left = $(this).offset().left,
      parentLeft = $(this).parents('.custom-switcher').offset().left,
      slideLeft = left-parentLeft;
      if (slideLeft==1) {
        slideLeft = 0
      }
      $(this).parents('.custom-switcher').find('.custom-switcher__slide').css({left:slideLeft});
    }
  });
}
