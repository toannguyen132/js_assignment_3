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

    $.ajax({
      url: url,
      method: 'get',
      dataType: 'json',
      success: function(res) {
        $el.hide();
        var result = {reviews: res};
        Mustache.parse(reviewTemplate);
        var rendereddHtml = Mustache.render(reviewTemplate, result);
        var reviews = $(rendereddHtml);
        $containter.append(reviews);
        reviews.hide().slideDown();
      }
    })
  });

});