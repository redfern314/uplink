var dotenv = require('dotenv');

dotenv.load();

var Spotify = require('node-libspotify');
var appKeyPath = './spotify_appkey.key';
var spotify = new Spotify({appkeyFile: appKeyPath});
spotify.login('121181369', process.env.SPOTIFY_SECRET)
  .then(function () {
    //logged in
    var track = {
      uri: 'spotify:track:5ah7kcnR5jt5pA42Xp7dZV'
    };
    spotify.player.on('play', function (track) { 
        /* play event */ 
        console.log("Play: ");
        console.log(track);
    });
    spotify.player.on('data', function (buffer) { 
        /* data event */ 
        console.log("Data: "+buffer);
    });
    spotify.player.on('pause', function () { /* pause event */ });
    spotify.player.on('progress', function (progress) { /* progress event */ });
    spotify.player.play(track);
  })
  .catch(function (err) {
    console.log(err);
    //wrong username and/or password
  });