var http = require('http');
var fs = require('fs');
var pg = require('pg');
var app = require('express')();
var bodyParser = require('body-parser');
var qlib = require('./querylib');
var condb = process.env.DB_URL;

var clientFailure = 400;
var serverFailure = 500;

var defaultDistance = 500;

function insertJson(json) {
    var queryobj = qlib.insert(json.longitude,
                               json.latitude,
                               json.signal,
                               json.provider,
                               json.model,
                               json.uuid,
                               json.date);
    pg.connect(condb, function(err, client, done) {
        if (err) {
            return error(err.toString);
        }
        client.query(queryobj, function(err, result) {
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
        res.sendStatus(clientFailure);
        log('Invalid json received: ' + err.body);
    } else {
        next(err);
    }
});

app.post('/', function(req, res) {
    log('post');
    if (!req.body) {
        return res.sendStatus(clientFailure);
    }
    log(JSON.stringify(req.body) + '\n' + 'type: ' + req.get('content-type'));
    if (typeof req.body === 'object') {
        if (req.body.constructor === Array) {
            req.body.forEach(insertJson);
        } else {
            insertJson(req.body);
        }
        return res.send({});
    } else {
        // this should never happen
        error('REQ.BODY IS NEITHER NULL NOR AN OBJECT');
        return res.sendStatus(clientFailure);
    }
});

app.get('/', function(req, res) {
    log('get');
    var lat = req.query.latitude;
    var lon = req.query.longitude;

    var dist;
    if (dist != null) {
        dist = parseInt(req.query.distance);
        if (isNan(dist)) {
            res.sendStatus(clientFailure);
            return error('received distance not a number!');
        } else if (dist < 100 || dist > 5000) {
            res.sendStatus(clientFailure);
            return error('received distance out of permitted range!');
        }
    } else {
        dist = defaultDistance;
    }

    var prov;
    var date;
    var queryobj;
    if (prov = req.query.provider != null) {
        if (date = req.query.date != null) {
            queryobj = qlib.selectByDistProvDate(lon, lat, dist, prov, date);
        } else {
            queryobj = qlib.selectByDistProv(lon, lat, dist, prov);
        }
    } else {
        queryobj = qlib.selectByDist(lon, lat, dist);
    }

    if (lat == null || lon == null) {
        queryobj = qlib.emptySelect;      // temporary to ease testing
    }

    pg.connect(condb, function(err, client, done) {
        if (err) {
            return error('error: ' + err);
        }
        client.query(queryobj, function(err, result) {
            done();

            if(err) {
                res.send(serverFailure);
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
