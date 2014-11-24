var http = require('http');
var fs = require('fs');
var pg = require('pg');
var app = require('express')();
var bodyParser = require('body-parser');
var conString = "postgres://aleksbg@localhost/lostsignal";
var conHeroku = process.env.DATABASE_URL;
var herokuDb = conHeroku != null ? true : false;

var queryobj = function (lon, lat) { return {
    name: 'select-by-distance',
    text: 'select provider, strength, ST_X(location::geometry) as long,' +
        'ST_Y(location::geometry) as lat from lostsignal WHERE ' +
        'ST_Distance(ST_Point($1, $2)::geography, location) < 500',
    values: [lon, lat]
}}

var queryobj2 = function (lon, lat, provider, str, uuid) { return {
    name: 'insert',
    text: 'insert into lostsignal values (ST_Point($1, $2), $3, $4, $5)',
    values: [lon, lat, provider, str, uuid]
}}

var querytemp = function (lon, lat) { return {
    name: 'select',
    text: 'select provider, strength, longitude, latitude from lostsignal limit 10'
}}

var querytemp2 = function (lon, lat, provider, str, uuid) { return {
    name: 'insert',
    text: 'insert into lostsignal values ($1, $2, $3, $4, $5)',
    values: [lon, lat, provider, str, uuid]
}}

function insertJson(json) {
    var con = herokuDb ? conHeroku : conString;
    var qfun = herokuDb ? querytemp2 : queryobj2;
    pg.connect(con, function(err, client, done) {
        if (err) {
            return error('error: ', err);
        }
        client.query(qfun(json.longitude, json.latitude, "Plus",
                    "1", "f93db9a0-7482-11e4-b61e-0002a5d5c51b"), function(err, result) {
            done();

            if(err) {
                return error('error running query', err);
            }
            log('inserted rows');
        });
    });
}

function log(msg) { return console.log(msg); }
function error(msg) { return console.error(msg); }

app.use(bodyParser.json());

app.post('/', function(req, res) {
    log('post');
    var body = '';
    req.on('data', function (data) { body += data; });
    req.on('end', function () {
        log('body: ' + body);
        var json;
        try {
            json = JSON.parse(body);
            log('lon: ' + json.longitude + ' / lat: ' + json.latitude);
            insertJson(json);
        } catch (err) {
            if (err.name === 'SyntaxError') {
                log('not a valid json');
            } else {
                res.send({});
                throw err;	// temporary to alert
            }
        } finally {
            res.send({});
        }
    });
});

app.get('/', function(req, res) {
    log('get'); log(herokuDb);
    var con = herokuDb ? conHeroku : conString;
    var qfun = herokuDb ? querytemp : queryobj;
    log(qfun().text);
    pg.connect(con, function(err, client, done) {
        if (err) {
            return error('error: ', err);
        }
        client.query(qfun(17.031853, 51.110124), function(err, result) {
            //call `done()` to release the client back to the pool
            done();

            if(err) {
                return error('error running query', err);
            }
            res.send(JSON.stringify(result.rows));
            log('sent rows');
        });
    });
});

var port;
if (process.env.PORT == null) {
    port = 9501;
} else {
    port = parseInt(process.env.PORT);
}
app.listen(port, function() {
    log('Found port:' + port);
    log('On heroku db: ' + herokuDb);
    log('up!');
});
