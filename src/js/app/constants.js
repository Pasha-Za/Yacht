const $document = $(document),
      $window = $(window),
      $body = $('body'),
      md = new MobileDetect(window.navigator.userAgent);

export {$document, $window, $body, md}
