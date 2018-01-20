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

/****** Performance functions ********/

var doTwitterThing = function() {
  client.stream('user', {with: "user", track: "KompilerBot", replies: "all"},  function(stream) {
    stream.on('data', function(tweet) {
      // ignore own tweets
      if ((tweet.user) && (tweet.user.id_str === MY_ID))
        return;

      if (tweet.entities) {
        console.log(tweet.entities)

        if (extractAddr(tweet.text))  {// Is this the recipient stepping up?
          // look up user and kom
          performPayment(address, tweet, globalkom);
        } else { //decipher
          botParser = new BotParser();
          botParser.init(tweet, komKallback);  
        }
      }
    
    });

    stream.on('error', function(error) {
      console.error(error);
      fs.writeFile(userFile, JSON.stringify(userList), "utf8");
    });
  });

}


/******* 
  Kallback function after new KOM creation
    When a new KOM is created, corresponding object needed on blockchain
    -Use web3relay to fetch contract object
    -If no account, create user and contract and request funding  
*******/

var komKallback = function(kom) {
    if (kom.status != "ok") {
      console.error("!! Invalid KOM: " + kom.status)
      return;
    }

    console.log(JSON.stringify(kom))

    // Look up party
    var user = userList[kom.party];
    if (user===undefined) {
      // smart contract needed: Manage userList, contract IDs
      callContract(CONTRACT_ADDRESS, CREATE_ACCOUNT, [kom.party], kom.id, function(hash) {
        // create user
        // Some sort of fucking callback elsewhere to tell user where to send money
        userList[kom.party.idStr] = {
                              "contract_create_tx": hash,
                              "contract_addr": null,
                              "account_addr": null,
                              "koms": [kom.id] 
                              }
      } )
      // create contract from kom
      

    } else {
      // determine if user has funds available
      // look up counterparty -- are tehy already a user?
      // contact counterparty to request address, or inform of payment
      requestRecipient(kom);
    }    
}

var requestRecipient = function(kom) {
  var msg = createTweet(TWIT_ADDRESS, kom.counterparty, kom.party, kom.qty, kom.money, kom.money);

    // Post a tweet to counterparty
    postTweet("", msg, function(data) {
      // add to userlist
    })
}

var performPayment = function(address, tweet, kom) {
  var msg = createTweet(TWIT_PAID, kom.party, kom.qty, kom.money, kom.party, "TEST");
  postTweet(tweet.id_str, msg, function(data) {
        console.log("Test succeeded!")
      });    
}

var postTweet = function(msg, cb) {
  console.log("### LightingBot: " + msg);

  client.post('statuses/update', 
              { 'status': msg + DISCLOSURE }, 
    function(error, data){
      if (error) 
        console.error(error);
      else {
        console.log(data);
        cb(data);
      }
    });
}

// doTwitterThing();
postTweet("this is a test")