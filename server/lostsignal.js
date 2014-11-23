var http = require('http');
var fs = require('fs');
var pg = require('pg');
var app = require('express')();
var bodyParser = require('body-parser');
var conString = "postgres://aleksbg@localhost/lostsignal";

function queryobj(lon, lat) { return {
    name: 'select-by-distance',
    text: 'select provider, strength, ST_X(location::geometry) as long,' +
        'ST_Y(location::geometry) as lat from lostsignal WHERE ' +
        'ST_Distance(ST_Point($1, $2)::geography, location) < 500',
    values: [lon, lat]
}}

function queryobj2(lon, lat, provider, str, uuid) { return {
    name: 'insert',
    text: 'insert into lostsignal values (ST_Point($1, $2), $3, $4, $5)',
    values: [lon, lat, provider, str, uuid]
}}

function insertJson(json) {
    pg.connect(conString, function(err, client, done) {
        if (err) {
            return error('error: ', err);
        }
        client.query(queryobj2(json.longtitude, json.latitude, json.network,
                    "1", json.uuid), function(err, result) {
            done();

            if(err) {
                return error('error running query', err);
            }
            log('sent rows');
        });
    });
}

function log(msg) { return console.log(msg); }
function error(msg) { return console.error(msg); }

app.use(bodyParser.json());

app.post('/', function(req, res) {
    log('post');
    var body = '';
    req.on('data', function (data) {
        body += data;
        log('partial body: ' + body);
    });
    req.on('end', function () {
        log('body: ' + body);
        var json;
        try {
            json = JSON.parse(body);
            insertJson(json);
        } catch (err) {
            if (err.name === 'SyntaxError') {
                return log('not a valid json');
            } else {
                res.send('post received\n');
                throw err;	// welp
            }
        }
        res.send('post received\n');
    });
});

app.get('/', function(req, res) {
    log('get');
    pg.connect(conString, function(err, client, done) {
        if (err) {
            return error('error: ', err);
        }
        client.query(queryobj(17.031853, 51.110124), function(err, result) {
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

log(typeof process.env.PORT);
log(process.env.PORT);
var port;
if (process.env.PORT == null) {
    port = 9501;
} else {
    port = parseInt(process.env.PORT);
}
log(port);
app.listen(port, function() {
    log("up!");
});
