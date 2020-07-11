var redis = require('redis');


module.exports.createClient = function(options){
  host = process.env.REDIS_HOST || "127.0.0.1"
  port = process.env.REDIS_PORT || "6379"
  password = process.env.REDIS_PASSWORD
  var prefix = null;
  if(options && options.prefix) {prefix =  options.prefix;}
  return redis.createClient({prefix: prefix, host: host, port: port, password: password});
}