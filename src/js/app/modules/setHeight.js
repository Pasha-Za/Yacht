// SET HEIGHT
  export default function setHeight(block,width=911,height=480,setW=0){
    let $blockW = Math.round($(block).outerWidth());
    let $blockH = Math.round($blockW*height/width);
    if (setW) {
      $(block).css({
        height : $blockH,
        transition : 'height .3s',
        width : $(block).outerWidth()-30,
        margin : '0 15px'
      })
    } else {
      $(block).css({
        height : $blockH,
        transition : 'height .3s'
      })
    }
  }
