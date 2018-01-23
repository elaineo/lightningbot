#!/usr/bin/env node

var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.set('port', process.env.PORT || 80);

// view engine setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// client
app.get('/', function(req, res) {
  console.log(req.body)
  res.sendStatus(200)
});

var Tweet = require('./tweet');

app.post('/create', function(req, res) {
  console.log("ORDER CREATED: " + req.body.number);
  console.log(req.body.meta_data);
  res.sendStatus(200);
});

app.post('/update', function(req, res) {
  console.log("ORDER UPDATED: " + req.body.number + " " + req.body.status);
  console.log(req.body.meta_data);
  if(req.body.status==="processing") {
    var urlObj = req.body.meta_data.filter((x)=>(x.key==='tweet_url'));
    var msgObj = req.body.meta_data.filter((x)=>(x.key==='tweet_text'));
    var userObj = req.body.meta_data.filter((x)=>(x.key==='tweet_handle'));
    for (var o of req.body.line_items) {
      if (o.sku==="001") {
        // Retweet
        Tweet.retweet(urlObj[0].value);
      } else if (o.sku==="002") {
        // Like
        Tweet.liketweet(urlObj[0].value);
      } else if (o.sku==="003") {
        // Tweet text
        Tweet.message(msgObj[0].value);
      } else if (o.sku==="004") {
        // Follow
        Tweet.follow(userObj[0].value);
      }
    }
  }
  res.sendStatus(200);
});


// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}


// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var http = require('http').Server(app);

http.listen(app.get('port'), '0.0.0.0', function() {
    console.log('Express server listening on port ' + app.get('port'));
});
