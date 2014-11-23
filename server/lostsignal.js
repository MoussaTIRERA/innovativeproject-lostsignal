var http = require('http');
var fs = require('fs');
var pg = require('pg');
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

function log(msg) { return console.log(msg); }
function error(msg) { return console.error(msg); }

var server = http.createServer( function(req, res) {
    console.dir(req.param);

    if (req.method == 'POST') {
        log('POST');
        var body = '';
        req.on('data', function (data) {
            body += data;
            log('Partial body: ' + body);
        });
        req.on('end', function () {
            log('Body: ' + body);
        });
        res.writeHead(200, {'content-type': 'text/plain'});
        res.end('post received\n');
    } else if (req.method === 'GET') {
        log('GET');
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
                res.writeHead(200, {'content-type': 'application/json'});
                res.end(JSON.stringify(result.rows));
                log('sent rows');
            });
        });
    }
});

server.listen(9501);
