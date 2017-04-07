export default function customRange() {
  $('.priceRangeVal-js').val($('.priceRange-js').val()+' ₴');
  $('.priceRange-js').on('input change', function () {
    $('.priceRangeVal-js').val($(this).val()+' ₴');
  });
}
