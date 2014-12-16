var selectText =
    'SELECT provider, ' +
    'signal, ' +
    'extract(epoch FROM dbdate) AS date, ' +
    'ST_X(location::geometry) AS long,' +
    'ST_Y(location::geometry) AS lat ' +
    'FROM lostsignal ';

var emptySelect = {
    name: 'empty-select',
    text: selectText + 'LIMIT 100'
};

var selectByDist = function (lon, lat, dist) { return {
    name: 'select-by-distance',
    text: selectText + 'WHERE ' +
          'ST_Distance(ST_Point($1, $2)::geography, location) < $3',
    values: [lon, lat, dist]
}};

var selectByDistProv = function (lon, lat, dist, provider) { return {
    name: 'select-by-distance-and-provider',
    text: selectText + 'WHERE ' +
          'ST_Distance(ST_Point($1, $2)::geography, location) < $3 AND ' +
          'provider = $4',
    values: [lon, lat, dist, provider]
}};

var selectByDistDate =
        function (lon, lat, dist, provider, date) { return {
    name: 'select-by-distance-and-provider-and-date',
    text: selectText + 'WHERE ' +
          'ST_Distance(ST_Point($1, $2)::geography, location) < $3 AND ' +
          'dbdate >= to_timestamp($5)',
    values: [lon, lat, dist, provider, date]
}};

var selectByDistProvDate =
        function (lon, lat, dist, provider, date) { return {
    name: 'select-by-distance-and-provider-and-date',
    text: selectText + 'WHERE ' +
          'ST_Distance(ST_Point($1, $2)::geography, location) < $3 AND ' +
          'provider = $4 AND ' +
          'dbdate >= to_timestamp($5)',
    values: [lon, lat, dist, provider, date]
}};

var insert =
    function (lon, lat, signal, provider, model, uuid, date) { return {
    name: 'insert',
    text: 'INSERT INTO lostsignal VALUES (ST_Point($1, $2), $3, $4, $5, $6, ' +
          'to_timestamp($7))',
    values: [lon, lat, signal, provider, model, uuid, date]
}};

module.exports = {
    emptySelect          : emptySelect,
    selectByDist         : selectByDist,
    selectByDistProv     : selectByDistProv,
    selectByDistDate     : selectByDistDate,
    selectByDistProvDate : selectByDistProvDate,
    insert               : insert
};
