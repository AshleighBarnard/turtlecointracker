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
      $("#block-reward").text(response + " Turtlecoins");
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
      $("#trtl-price").text(price + " Satoshis");
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

function turtleHash(){
  var queryURL = "https://blocks.turtle.link/q/hashrate/";

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
      var hashrate = response
      var megaHash = hashrate / 1000000;
      var megaHashString = megaHash.toString();
      var megaHashRound = megaHashString.slice(0,5);
      $("#hashrate").text(megaHashRound + " mH/s");
  });  
}

function githubCall(){

  var queryCall =   '{ repository(owner:"turtlecoin",name:"turtlecoin") { mentionableUsers {totalCount} watchers {totalCount} issues(last:100) {nodes { author { avatarUrl(size:1000) login } body url title number closed }totalCount} forks {totalCount} stargazers{totalCount} pullRequests(last:100 states:MERGED){nodes{createdAt mergedAt} totalCount}}}'

  $.ajax({
    method: "POST",
    url: 'https://api.github.com/graphql',
    contentType: 'application/json',
    headers: {
      Authorization: "bearer edaeb8db744d0804771c52391d111af26692b66a"
    },
    data: JSON.stringify({ "query": queryCall })
    
  }).done(function(response) {
    var turtle = response.data.repository;
    var length = turtle.issues.nodes.length;
    var latest = turtle.issues.nodes[length-1];
    var times = turtle.pullRequests.nodes;

    var closedCount = 0;
    
    for(var i = 0; i<length; i++){
      var isClosed = turtle.issues.nodes[i].closed;
      if(isClosed){
        closedCount++
      }
    }
    
    var timeMinutes = [];

    var denominator = times.length;
    for(var k = 0; k<denominator; k++){
      var mergedTime = Date.parse(times[k].mergedAt);
      var createdTime = Date.parse(times[k].createdAt);
      var diffMinutes = (mergedTime - createdTime) / 1000 / 60;
      timeMinutes.push(diffMinutes);
    }
    
    var sum = 0;

    for(var j = 0; j<denominator; j++){
      sum+= timeMinutes[j];
    }

    var averageDays = sum / denominator / 60 / 24;
    var averageDaysString = averageDays.toString();
    var averageDaysRound = averageDaysString.slice(0,4);
  
    var commentBody = latest.body;
    var words = commentBody.split(" ");
    if(words.length < 30){
      var shortenedWords = [];
      for(var l = 0; l<30 ; l++){
        shortenedWords.push(words[l]);
      }
      var newBody = shortenedWords.join(" ");
      $("#comment-body").text(newBody + " ...");
    }else{
      $("#comment-body").text(commentBody);
    }

    var link = latest.url
    var avatar = latest.author.avatarUrl;
    var name = latest.author.login;
    var title = latest.title;
    var issueNumber = latest.number;

    $("#author-avatar").attr("src",avatar);
    $("#author-name").text(name);
    $("#comment-link").attr("href",link);
    $("#issue-title").text(title + " #" + issueNumber);

    var starsCount = turtle.stargazers.totalCount;
    $("#stars").text(starsCount);
    var watchers = turtle.watchers.totalCount;
    $("#watchers").text(watchers);
    var forks = turtle.forks.totalCount;
    $("#forks").text(forks);
    var mergedPRs = turtle.pullRequests.totalCount;
    $("#merged").text(mergedPRs);
    var issues = turtle.issues.totalCount;
    $("#issues").text(issues);
    $("#closed-issues").text(closedCount);
    var contributorCount = turtle.mentionableUsers.totalCount;
    $("#contributors").text(contributorCount);
    $("#average-time").text(averageDaysRound + " Days");
  });
}

function redditUsers(){
  $.ajax({
    method: "GET",
    url: 'https://www.reddit.com/r/TRTL/about.json?json='
  }).then(function (response) {
    var data = response.data;
    var subs = data.subscribers;
    var activeUsers = data.active_user_count;
    $("#subscribers").text(subs);
    $("#users-online").text(activeUsers);
  });  
}

function redditComments(){
  $.ajax({
    method: "GET",
    url: 'https://www.reddit.com/r/TRTL.json?json='
  }).then(function (response) {
    var posts = response.data.children;
    var sum = 0
    for(var i = 0; i<posts.length; i++){
      sum += posts[i].data.num_comments;
    }
    var average = sum / posts.length 
    var averageString = average.toString();
    var averageRound = averageString.slice(0,4);
    $("#average-comments").text(averageRound);
  });  
}


//////////////////////////////////////   |||      PROGRAM BODY       |||    ////////////////////////////////////////////////////////////

// Call all the functions related to general information

$(document).ready(function() {
  turtleHeight();
  turtleReward();
  turtlePrice();
  turtleMarketCap();
  turtleHash();
  githubCall();
  redditUsers();
  redditComments();

  $('#fullpage').fullpage({
    anchors: ['firstPage', 'secondPage', '3rdPage', '4thpage',],
    menu: '#menu',
    continuousVertical: false
  });
});
