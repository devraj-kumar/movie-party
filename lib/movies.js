'use strict';
var async = require('async');
var redis = require('../lib/redis-host.js');
var movieStorage = redis.createClient({prefix: "moviestorage"});
var movieSession = redis.createClient({prefix: "moviesession"});

// module.exports = function() {
//     function createDummyData(){
//       movieStorage.set("1", JSON.stringify({movie_name: "Race3", movie_id: 1, session_id: "a12345", user: "Raj"}), redis.print)
//       movieStorage.set("2", JSON.stringify({movie_name: "Thugs of hindustan", movie_id: 2, session_id: "b4567", user: "Raj"}), redis.print)
//       movieStorage.set("3", JSON.stringify({movie_name: "Pineapple express", movie_id: 3, session_id: "c23452", user: "Raj"}), redis.print)
//     }
// }

module.exports.createDummyData = function (){
  movieStorage.set("1", JSON.stringify({movie_name: "Race3", movie_id: 1, session_id: "a12345", user: "Raj"}), redis.print)
  movieStorage.set("2", JSON.stringify({movie_name: "Thugs of hindustan", movie_id: 2, session_id: "b4567", user: "Raj"}), redis.print)
  movieStorage.set("3", JSON.stringify({movie_name: "Pineapple express", movie_id: 3, session_id: "c23452", user: "Raj"}), redis.print)
}

module.exports.fetchMovieSession = function(session_id, callback){
    var a =  movieSession.get(session_id, function(err, reply) {
      // console.log(reply,"-------r$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$eply-------")
      if(!reply) { reply = "{}" }
      callback(JSON.parse(reply));
    });
}

module.exports.generateSession = function (session_id, moviestorage, user){
  movieStorage.get(moviestorage, function (error, value) {
    if (error){ return console.log(error); }
    console.log(value)
    var data = JSON.parse(value)
    data.user = user
    movieSession.set(session_id, JSON.stringify(data), redis.print);
  })
}

module.exports.get = function (callback){
    movieStorage.keys('moviestorage*', function (err, keys) {
        if (err){
          callback([])
          return console.log(err);
        }
        if(keys){
            async.map(keys, function(key, cb) {
              // keys(*) dont work with prefix https://github.com/NodeRedis/node-redis
              key = key.replace("moviestorage","") 
              movieStorage.get(key, function (error, value) {
                    if (error){
                      callback([])
                      return cb(error);
                    }
                    // console.log(value)
                    var job = {};
                    job['key']=key;
                    job['data']= JSON.parse(value);
                    cb(null, job);
                }); 
            }, function (error, results) {
               if (error){
                 callback([])
                 return console.log(err);
               }
               // console.log(results);
               callback(results)
            });
        }
    });
}

// function fetchMovieAction(session_id, callback){
//     var a =  movieStorage.get(session_id, function(err, reply) {
//       if(!reply) { reply = "{}" }
//       callback(JSON.parse(reply));
//     });
// }

// function saveMovieAction(session_id, moviedata){
//     console.log(moviedata,"moviedata")
//     fetchMovieAction(session_id, function(old_movie_data){
//         if(!old_movie_data) { old_movie_data = moviedata}
//         old_movie_data.pause = moviedata.pause;
//         old_movie_data.time = moviedata.time;
//         old_movie_data = JSON.stringify(old_movie_data)
//         movieStorage.set(session_id, old_movie_data, redis.print)
//     })
// }
