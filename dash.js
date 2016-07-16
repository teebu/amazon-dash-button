var ping = require('ping'),
    async = require('async'),
    debug = false;

var ips = ['192.168.1.75']; // ip of my dash button

console.log('star scanning')

async.forever(
  function(next) {
    // next is suitable for passing to things that need a callback(err [, whatever]);
    // it will result in this function being called again.
    testHosts(ips, function(err,res){
      if (err) return next(err)
      if (debug) console.log(res.alive);

      if (res.alive) {
        // DO STUFF HERE IF res.alive == true
        console.log('DO STUFF HERE');
        setTimeout(function(){ return next();}, 5000) // wait 5 seconds to continue scanning
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
      timeout: 10,
      extra: []
    }).then(function (res) {
      setTimeout(function(){ return callback(null,res);}, 700) // slow down callback
    });
  });
}