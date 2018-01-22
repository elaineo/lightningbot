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

module.exports = function(msg) {
  console.log("### LightingBot: " + msg);

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