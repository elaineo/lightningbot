#!/usr/bin/env node

/****** 
  Twitter client stuff
  **********/
var Twitter = require('twitter');
/* lightningb0t tweeter */
var CONSUMER_KEY  =  '6unEwBnCn0cJY6X1iERuFFfU8';
var CONSUMER_SECRET =  'okvES4xTeWZVwGHn9PnUT9yYXXMCSrMYhyoLU5lYV9bZVcdJPR';
var ACCESS_TOKEN =    '954556662668394497-d9zEVD7bEI8kB0TaVohJd3BbUa6TuNz';
var ACCESS_TOKEN_SECRET = 'kZt5mwBo2I6QZlVFVYWypXENEWUz4JTyTlszPTc4eg7lZ';

var client = new Twitter({
  consumer_key: CONSUMER_KEY,
  consumer_secret: CONSUMER_SECRET,
  access_token_key: ACCESS_TOKEN,
  access_token_secret: ACCESS_TOKEN_SECRET
});

const DISCLOSURE = " #paidShill";

module.exports = function(msg) {
  console.log("### LightingBot: " + msg);

  client.post('statuses/update', 
              { 'status': msg.substring(0,269) + DISCLOSURE }, 
    function(error, data){
      if (error) 
        console.error(error);
      else {
        console.log(data);
      }
    });
}