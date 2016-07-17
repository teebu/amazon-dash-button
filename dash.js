var ping = require('ping'),
    async = require('async'),
    Twitter = require('twitter'),
    debug = false,
    enableITTT = false

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

var ips = ['192.168.1.75']; // ip of my dash button

console.log('star scanning')

async.forever(
  function(next) {
    // next is suitable for passing to things that need a callback(err [, whatever]);
    // it will result in this function being called again.
    testHosts(ips, function(err,res){
      if (err) return next(err)
      if (debug) console.log(res);

      if (res.alive) {
        // DO STUFF HERE IF res.alive == true
        console.log('DO STUFF HERE');
        var tweet = 'Hello, it is ' + new Date()
        if (enableITTT) tweet += ' #button01 activated!' // enable ITTT to do stuff, it is triggers on #button01 hashtag
        postTweet(tweet, function(err,res){
          console.log(res.text)
          setTimeout(function(){ return next();}, 5000) // wait 5 seconds to continue scanning
        })
      } else { // continue
        return next()
      }

    });
  },
  function(err) {
    // if next is called with a value in its first parameter, it will appear
    // in here as 'err', and execution will stop.
    if (err) console.log(err)
  }
);

function testHosts(hosts, callback){
  hosts.forEach(function (host) {
    ping.promise.probe(host, {
      timeout: 1,
      extra: []
    }).then(function (res) {
      setTimeout(function(){ return callback(null,res);}, 700) // slow down callback
    });
  });
}


function postTweet(text, callback){
  client.post('statuses/update', {status: text},  function(error, tweet, response){
    if(error) console.log(error)
    if (debug) console.log(tweet.text);  // Tweet body.
    //console.log(response);  // Raw response object.
    return callback(error,tweet)
  });
}