export default function inViewport(elemet){

  //Element view position
var elementOffset = $(elemet).offset().top;
var elementHeight = $(elemet).height();
var elementView = elementOffset+elementHeight;

  //Window view position
var docHeight = $(window).height();
var spyScroll = $(window).scrollTop();
var documentView = docHeight+spyScroll;

return ((elementView <= documentView) && (elementOffset >= spyScroll));
 }
