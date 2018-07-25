$(document).ready(function(){

  // var restaurant_url = 'http://localhost:3000/restaurant';
  var resTemplate = $('#restaurant_temp').html();
  var reviewTemplate = $('#review_temp').html();

  $('#search').on('click', function(){
    var cuisine = $('#cuisine').val();
    var sort = $('#sort').val();
    var price = $('#price').val();

    var restaurant_url = 'http://localhost:3000/restaurant/' + cuisine + '?sort_by=' + sort + '&price=' + price;

    $.ajax({
      url: restaurant_url,
      method: 'get',
      dataType: 'json',
      success: function(res){
        var result = {restaurants: res};
        Mustache.parse(resTemplate);
        var rendereddHtml = Mustache.render(resTemplate, result);

        $('#result').html(rendereddHtml);
      }
    })
  });

  $('#result').on('click', '.show', function(e){
    e.preventDefault();
    var $el = $(e.currentTarget);
    var id = $el.data('id');
    var url = 'http://localhost:3000/reviews/' + id;
    var $containter = $('#res_' + id);
    var $hideButton = $el.siblings('.hide');

    $.ajax({
      url: url,
      method: 'get',
      dataType: 'json',
      success: function(res) {
        $el.hide();
        var result = {reviews: res};
        Mustache.parse(reviewTemplate);
        var rendereddHtml = Mustache.render(reviewTemplate, result);
        var reviews = $('<div class="list-group-item list-group-reviews" id="review-list-'+ id +'">'  + rendereddHtml + '</div>');
        $containter.append(reviews);
        reviews.hide().slideDown();
        $containter.addClass('reviews-shown')

        // hide all other reviews
        $containter.siblings('.list-group.reviews-shown').removeClass('reviews-shown').find('.list-group-reviews').slideUp();

        /// 
        $hideButton.show();
      }
    })
  });

  $('#result').on('click', '.toggle', function(e){
    e.preventDefault();
    $el = $(e.currentTarget);
    $target = $('#' + $el.data('target'));
    $containter = $el.closest('.list-group');

    if ($containter.hasClass('reviews-shown')){
      $target.slideUp();
      $containter.removeClass('reviews-shown');
      $el.text('Show Reviews');

    } else {
      $target.slideDown();
      $containter.addClass('reviews-shown');
      $el.text('Hide Reviews');

      $containter.siblings('.list-group.reviews-shown').removeClass('reviews-shown').find('.list-group-reviews').slideUp();
    }
  });

  

});