#!/usr/bin/env node

/****** 
  Twitter client stuff
  **********/
var Twitter = require('twitter');

/* lightningb0t tweeter */
var client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

var message = function(msg) {
  console.log("### LightingBot Tweet: " + msg);

  client.post('statuses/update', 
              { 'status': msg.substring(0,280) }, 
    function(error, data){
      if (error) 
        console.error(error);
      else {
        console.log(data);
      }
    });
}

var retweet = function(msg) {
  console.log("### LightingBot Retweet: " + msg);
  var tweet = msg.match(/\d+$/);

  if (tweet) {

    client.post('statuses/retweet', 
                { 'id': tweet[0] }, 
      function(error, data){
        if (error) 
          console.error(error);
        else {
          console.log(data);
        }
      });
  }
}

var liketweet = function(msg) {
  console.log("### LightingBot Retweet: " + msg);
  var tweet = msg.match(/\d+$/);

  if (tweet) {

    client.post('favorites/create', 
                { 'id': tweet[0] }, 
      function(error, data){
        if (error) 
          console.error(error);
        else {
          console.log(data);
        }
      });
  }
}

var follow = function(name) {
  console.log("### LightingBot Follow: " + name);
  var screen_name = name[0] === '@' ? name.substring(1) : name;
  client.post('friendships/create', 
              { 'screen_name': screen_name }, 
    function(error, data){
      if (error) 
        console.error(error);
      else {
        console.log(data);
      }
    });
}


module.exports = {
  message,
  retweet,
  liketweet,
  follow
}