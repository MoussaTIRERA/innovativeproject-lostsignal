var http = require('http');
var fs = require('fs');
var pg = require('pg');
var app = require('express')();
var bodyParser = require('body-parser');
var condb = process.env.DB_URL;

var querySelect = function (lon, lat) { return {
    name: 'select-by-distance',
    text: 'SELECT provider, signal, ST_X(location::geometry) AS long,' +
        'ST_Y(location::geometry) AS lat FROM lostsignal WHERE ' +
        'ST_Distance(ST_Point($1, $2)::geography, location) < 500',
    values: [lon, lat]
};};

var queryInsert = function (lon, lat, provider, str, uuid) { return {
    name: 'insert',
    text: 'INSERT INTO lostsignal VALUES (ST_Point($1, $2), $3, $4, $5::bigint)',
    values: [lon, lat, provider, str, uuid]
};};

function insertJson(json) {
    pg.connect(condb, function(err, client, done) {
        if (err) {
            return error(err.toString);
        }
        client.query(queryInsert(json.longitude, json.latitude, "Plus",
            json.signal, "1"), function(err, result) {
            done();

            if(err) {
                error(err.toString());
                return error(err.detail);
            }
            log('query performed, inserted rows');
        });
    });
}

function log(msg) { return console.log(msg); }
function error(msg) { return console.error(msg); }

app.use(bodyParser.json());
app.use(function(err, req, res, next) {
    if (err.name === 'Error' && err.message === 'invalid json') {
        res.sendStatus(400);
        log('Invalid json received: ' + err.body);
    } else {
        next(err);
    }
});

app.post('/', function(req, res) {
    log('post');
    if (!req.body) {
        return res.sendStatus(400);
    }
    log('lon: ' + req.body.longitude + ' / lat: ' + req.body.latitude);
    log(req.body);
    log(req.get('content-type'));
    insertJson(req.body);
    res.send({});
});

app.get('/', function(req, res) {
    log('get');
    var lat = req.query.latitude;
    var lon = req.query.longitude;
    pg.connect(condb, function(err, client, done) {
        if (err) {
            return error('error: ' + err);
        }
        client.query(querySelect(lon, lat), function(err, result) {
            done();

            if(err) {
                error(err.toString());
                return error(err.detail);
            }
            res.send(result.rows);
            log('query performed, responding with rows');
        });
    });
});

var port = process.env.PORT
app.listen(port, function() {
    log('Found port: ' + port);
    log('up!');
});
