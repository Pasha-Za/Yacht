
// check label
let checkLabel = function () {
 // check active
 $('.custom').each(function () {
   if ($(this).find('input').prop('checked')) {
     $(this).addClass('checked');
   }
 });

 $('.custom').on('click', function(e) {
   e.stopPropagation();
   // radio
   if ($(this).find('input').prop('type')==='radio') {
     if ($(this).find('input').prop('checked')) {
       let sameRadio = $(this).find('input').attr('name');
       $('input[name="'+sameRadio+'"]').parent().not($(this)).removeClass('checked');
       $(this).addClass('checked');
     }
   }
   // checkbox
   else if ($(this).find('input').prop('type')==='checkbox') {
     if ($(this).find('input').prop('checked')) {
       $(this).addClass('checked');
     } else {
       $(this).removeClass('checked');
     }
   }

 });
};

export default checkLabel;
