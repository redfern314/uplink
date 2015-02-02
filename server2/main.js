var sp = require('libspotify');
// var cred = require('../spotify_key/passwd');
var spawn = require('child_process').spawn;
var fs = require('fs');
var dotenv = require('dotenv');

dotenv.load();

var session = new sp.Session({
    applicationKey: __dirname + '/spotify_appkey.key'
});
// session.login(cred.login, cred.password);
session.login("121181369",process.env.SPOTIFY_SECRET);
session.once('login', function(err) {
    if(err) this.emit('error', err);

    var search = new sp.Search('artist:"walk the moon" track:"shut up and dance"');
    search.trackCount = 1; // we're only interested in the first result;
    search.execute();
    search.once('ready', function() {
        if(!search.tracks.length) {
            console.error('there is no track to play :[');
            session.logout();
        }

        var track = search.tracks[0];
        var player = session.getPlayer();
        player.load(track);
        var f = fs.createWriteStream('audio.raw');
        player.pipe(f);
        player.play();

        // linux
        var play = spawn('aplay', ['-c', 2, '-f', 'S16_LE', '-r', '44100']);
        // osx with `brew install sox`
        var play = spawn('play', ['-r', 44100, '-b', 16, '-L', '-c', 2, '-e', 'signed-integer', '-t', 'raw', '-']);

        player.pipe(play.stdin);

        console.error('playing track. end in %s', track.humanDuration);
        player.on('data', function(buffer) {
            // console.log(buffer);
            // buffer.length
            // buffer.rate
            // buffer.channels
            // 16bit samples
        });
        player.once('track-end', function() {
            console.error('track ended');
            player.stop();
            session.close();
        });
    });
});