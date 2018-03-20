//////////////////////////////////////    |||      FUNCTIONS      |||    ////////////////////////////////////////////////////////////

//Pulls and displays blockchain height of turtlecoin
function turtleHeight() {
  var queryURL = "https://blocks.turtle.link/q/height/";
  
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
      $("#block-height").text(response);
  });  
}

//Pulls and displays the block reward for turtlecoin
function turtleReward() {
  var queryURL = "https://blocks.turtle.link/q/reward/";
  
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
      $("#block-reward").text(response + " TRTLs");
  });  
}

//Pulls and displays the price (IN SATOSHIS) of turtlecoin
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

//Pulls both the price and and circulating supply of turtlecoin then multiplies these and displays them
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

function githubCall(){

  var queryCall =   '{ repository(owner:"turtlecoin",name:"turtlecoin") { mentionableUsers  {totalCount} stargazers{totalCount} pullRequests(last:1){nodes{comments(last:1){nodes{author{login  avatarUrl(size:50)} body url}}} totalCount}}}'

  $.ajax({
    method: "POST",
    url: 'https://api.github.com/graphql',
    contentType: 'application/json',
    headers: {
      Authorization: "bearer 860a774de3c00321eb0cc9c6e4ea7cc283a09662"
    },
    data: JSON.stringify({ "query": queryCall })
    
  }).done(function(response) {
    console.log(response);
    var turtle = response.data.repository;
    //console.log(turtle);

    var latest = turtle.pullRequests.nodes[0].comments.nodes[0]
  
    var commentBody = latest.body;
    var link = latest.url
    var avatar = latest.author.avatarUrl;
    var name = latest.author.login;

    console.log(name)
    
    $("#author-avatar").attr("src",avatar);
    $("#author-name").text(name);
    $("#comment-body").text(commentBody);
    $("#comment-link").attr("href",link);

    var starsCount = turtle.stargazers.totalCount;
    var watchers
    var forks
    var mergedPRs
    var issues
    var closedIssues
    var contributorCount = turtle.mentionableUsers.totalCount;
    var avgMergePrTime 
  });
}

//token: 560e9778d5ee525332ba0d6af8a50ed01906aa30

//////////////////////////////////////   |||      PROGRAM BODY       |||    ////////////////////////////////////////////////////////////

// Call all the functions related to general information

$(document).ready(function() {
  turtleHeight();
  turtleReward();
  turtlePrice();
  turtleMarketCap();
  githubCall();

  $('#fullpage').fullpage({
    anchors: ['firstPage', 'secondPage', '3rdPage', '4thpage', 'lastPage'],
    menu: '#menu',
    continuousVertical: true
  });
});
