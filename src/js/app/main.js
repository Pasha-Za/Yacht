'use strict';

import jquery from 'jquery'
import bootstrap from '../../vendor/bootstrap/js/bootstrap.js'
import maskedinput from '../../vendor/jquery.maskedinput/dist/jquery.maskedinput.js'
import slick from '../../vendor/slick-carousel/slick/slick.js'
let MobileDetect = require('mobile-detect'),
md = new MobileDetect(window.navigator.userAgent);
let Blazy = require('blazy');

import sameHeight from './modules/sameHeight';
import setHeight from './modules/setHeight';
import checkLabel from './modules/check';
import customSelect from './modules/customSelect';

import inViewport from './modules/viewport';


console.log('main js!');

const $document = $(document),
      $window = $(window),
      $body = $('body');

$(document).ready(()=>{

  $(document).on('change', '.button_file :file', function() {
    let input = $(this);
    let numFiles = input.get(0).files ? input.get(0).files.length : 1;
    let label = input.val().replace(/\\/g, '/').replace(/.*\//, '');

    input.trigger('fileselect', [numFiles, label]);
  });
  $body.append('<div id="blackout"></div>');
  // CUSTOM RESIZE
  let prevWidth = $window.width();
  function customResize(callback) {
    if (prevWidth!=$window.width()) {
      callback();
    }
    prevWidth = $window.width();
  }

  // select
  customSelect();
  // select end
  $('.phone-js').mask("+38(099) 999-99-99");

  // tabs
  function tabsCustom() {
    $('.tabs__controls a').on('click', function(e) {
      e.preventDefault();
      let id = $(this).attr('href');
      $('.tabs__controls a').removeClass('active');
      $(this).addClass('active');
      $('.tabs__content .tabs-wrap').removeClass('active')
      $('.tabs__content').find(id).addClass('active')
    })
  }
  tabsCustom();
  // tabs end

  // nav
  $('.mob-menu').on('click', function(e) {
    e.preventDefault();
    if (!$('.header__controls .horison-list').hasClass('active')) {
      $('.header__controls .horison-list').addClass('active').slideDown();
      $('#blackout').fadeIn();
      // if (md.phone()!==null||$window.width()<768) {
      //   $body.addClass('stop-scroll');
      // }
    }
  });
  $('.horison-list__item.sub-nav>a').on('click', function(e) {
    e.preventDefault();
    if (md.mobile()!==null) {
      if (!$(this).hasClass('active')) {
        $(this).addClass('active').parent().find('.sub-nav-list').slideDown();
      } else {
        $(this).removeClass('active').parent().find('.sub-nav-list').slideUp();
      }
    }
  });

  $('.header__controls .icon_search').on('click', function(e) {
    e.preventDefault();
    $('.header__search').addClass('active').fadeIn();
  });
  $('.header__search .close').on('click', function(e) {
    e.preventDefault();
    $('.header__search').removeClass('active').fadeOut();
  });

  $('.header__controls .horison-list .close').on('click', function(e) {
    e.preventDefault();
    if ($('.header__controls .horison-list').hasClass('active')) {
      $('.header__controls .horison-list').removeClass('active').slideUp();
      $('#blackout').fadeOut();
    }
  });
  $('#blackout').on('click',function () {
    if ($('.header__controls .horison-list').hasClass('active')) {
      $('.header__controls .horison-list').removeClass('active').fadeOut();
      $('#blackout').fadeOut();
    }
  });
  // nav end

  // slider
  $('.slider-section').on('init', function(){
    // setHeight('.slider-section__item',1397,600);
    setTimeout(function () {
      $('.slider-section__item').css({'min-height': '1px'})
    }, 1000);
  });
  $('.slider-section').slick({
    dots: true,
    lazyLoad: 'ondemand'
  });
  // slider end

// lazyLoad
var bLazy = new Blazy({
      success: function(element){
	    setTimeout(function(){
  		// We want to remove the loader gif now.
  		// First we find the parent container
  		// then we remove the "loading" class which holds the loader image
  		var parent = element.parentNode;
  		parent.className = parent.className.replace(/\bratio_16-9\b/,'');
  	    }, 200);
      }
   });
// lazyLoad end

  sameHeight('.category-frame__data');
  setHeight('.header__content',1900,340);

  $window.on('resize', function () {
    customResize(function(){
      sameHeight('.cover-shelf__pic');
      sameHeight('.category-frame__data');
      setHeight('.header__content',1900,340);
      setHeight('.slider-section__item',1397,600);
    });
  });

  $window.on('scroll', function () {

  });
});

$window.on('load', function () {
  sameHeight('.cover-shelf__pic');
});
  // експортируем для использования из другого скрипта
  exports.sameHeight = sameHeight;
