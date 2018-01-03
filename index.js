var express = require('express'),
    app = express(),
    path = require('path'),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    geoip = require('geoip-lite'),
    port = process.env.PORT || 3000,
    cookie = require('cookie'),
    mongoose = require('mongoose'),
    Audio = require('./api/models/AudioModel'),
    bodyParser = require('body-parser'),
    session = require("express-session")({
        secret: "my-secret",
        resave: true,
        saveUninitialized: true
    }),
    sharedSession = require("express-socket.io-session");

app.use(session);

io.use(sharedSession(session, {
    autoSave:true
}));

mongoose.Promise = global.Promise;
// TODO: solve multiple databases promise
var promise = mongoose.connect('mongodb://localhost/AVdb', {
    useMongoClient: true
});

app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/AudioVideoRoutes');
routes(app);

var nicknames = [];

function filterNullValues(i) {
    return (i!=null);
}

io.on('connection', function(socket){
    // TODO: create model for rooms: socket.join('all');
    io.sockets.emit('connectCounter', Object.keys(io.sockets.sockets).filter(filterNullValues).length);

    socket.on('new user', function(data){
        var tmp = {
            id: socket.id,
            data: data,
            geo: geoip.lookup(data.publicIp)
        };

        nicknames.push(tmp);

        updateNicknames(nicknames);
    });

    function updateNicknames(x){
        io.sockets.emit('usernames', x);
    }

    socket.on('disconnect', function(data){
        var index=nicknames.map(function(x){
            return x.id;
        }).indexOf(socket.id);

        nicknames.splice(index,1);
        io.sockets.emit('connectCounter', Object.keys(io.sockets.sockets).filter(filterNullValues).length);

        updateNicknames(nicknames);
    });
});

http.listen(port, function(){
    console.log('*** AUDIO/VIDEO server run on: http://localhost:' + port);
});
