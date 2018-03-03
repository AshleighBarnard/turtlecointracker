function turtleHeight() {
  var queryURL = "https://blocks.turtle.link/q/height/";
  
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
      $("#block-height").text(response);
  });  
}

function turtleReward() {
  var queryURL = "https://blocks.turtle.link/q/reward/";
  
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
      $("#block-reward").text(response + " TRTLs");
  });  
}

function turtlePrice(){
  var queryURL = "https://tradeogre.com/api/v1/ticker/btc-trtl"

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
      var obj = JSON.parse(response);
      var price = obj.price;
      $("#trtl-price").text(price);
  });  
}

function turtleMarketCap(){
  var queryURL = "https://tradeogre.com/api/v1/ticker/btc-trtl";
  var supplyURL = "https://blocks.turtle.link/q/supply/";
  var price = 0;
  var supply = 0;

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
      var obj = JSON.parse(response);
      price = obj.price;
      var marketcap = (supply * price);
      var mcapString = marketcap.toString();
      var mcapRound = mcapString.slice(0,6);
      $("#trtl-mcap").text(mcapRound + " BTC");
  });  

  $.ajax({
    url: supplyURL,
    method: "GET"
  }).then(function (response) {
    supply = response;
  });  
}

turtleHeight();
turtleReward();
turtlePrice();
turtleMarketCap();