var redis = require('redis');


module.exports.createClient = function(options){
  var prefix = null;
  if(options && options.prefix) {prefix =  options.prefix;}
  return redis.createClient({prefix: prefix});
}