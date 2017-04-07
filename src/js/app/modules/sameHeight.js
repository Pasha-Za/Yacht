let sameHeight = (container) => {
  let maxHeight = 0,
      $container = $(container);

  $container.each(function() {
    $container.css({'height': ""});
    if ($(this).outerHeight()>maxHeight) {
      maxHeight = $(this).outerHeight();
    }
  });
  $container.outerHeight(maxHeight);
}

export default sameHeight;
