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
        var reviews = $('<div class="list-group-item list-group-reviews" id="review-list-'+ id +'">'  + rendereddHtml + '</div>').hide();
        $containter.append(reviews);
        
        expandReviews($containter);

        // hide all other reviews
        collapseReviews($containter.siblings('.list-group.expanded'));

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

    if ($containter.hasClass('expanded')){
      collapseReviews($containter);

    } else {
      expandReviews($containter);
      collapseReviews($containter.siblings('.list-group.expanded'))
    }
  });

  var expandReviews = function($el){
    var $textHolder = $el.find('.toggle');
    var $reviewContainer = $el.find('.list-group-reviews')

    $el.addClass('expanded');
    $textHolder.text('Hide Reviews');
    $reviewContainer.slideDown();
  }

  var collapseReviews = function($el){
    var $textHolder = $el.find('.toggle');
    var $reviewContainer = $el.find('.list-group-reviews')

    $el.removeClass('expanded');
    $textHolder.text('Show Reviews');
    $reviewContainer.slideUp();
    
  }

});