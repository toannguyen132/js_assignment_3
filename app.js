var express = require('express')
var bodyparser =  require('body-parser')
var request =  require('request')

var api_key = 'zKw5ihqlz2NyincyVbdh7xu27-gULYxhS-nuqqkoQiRf0ynIu3hOheLqJvp2oJR6tq4vwRgh2GvE6O22WHT0m8rON0nyuoj66UGfisSKMnCiaAoMbFDs_dCjRHdOW3Yx'
var app = express()
app.use(express.static('public'))
app.use(bodyparser.json())

var callYelp = function(endpoint, callback){
  var options = {
    url: endpoint,
    headers: {
      'Authorization': 'Bearer ' + api_key
    }
  }
  request(options, callback)
}

app.get('/restaurant/:cuisine', function(req, res) {
  var cuisine = req.params.cuisine
  var url = 'https://api.yelp.com/v3/businesses/search'

  var sort = req.query.sort_by
  var price = req.query.price

  callYelp(`${url}?term=restaurant&locate=en_CA&location=vancouver,bc,canada&categories=${cuisine}&sort_by=${sort}&price=${price}`, function(err, response, body){
    if (err){
      res.send('error occurred')
    }

    // res.send(body)
    // return
    
    var result = JSON.parse(body);
    var restaurants = result.businesses.map(function(item){
      return {
        id: item.id,
        name: item.name,
        url: item.url,
        review_count: item.review_count,
        rating: item.rating,
        price: item.price
      }
    });

    res.send(restaurants)
  });
})

app.get('/reviews/:id', function(req, res) {
  var id = req.params.id
  var url = `https://api.yelp.com/v3/businesses/${id}/reviews`

  callYelp(url, function(err, response, body) {
    if (err){
      res.send({ error: true, message: "cannot fetch review" });
    }

    // res.send(body)
    var bodyJson = JSON.parse(body)
    var reviews = bodyJson.reviews.map(function(item){
      return {
        id: item.id,
        text: item.text
      }
    })
    
    res.send(reviews)
  })
})

app.listen(3000, function(){
  console.log('listen on port 3000')
})