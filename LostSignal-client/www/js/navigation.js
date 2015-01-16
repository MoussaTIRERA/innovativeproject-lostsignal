var arrow;
function navigate() {
    setInterval(function(){
    if(arrow != null)
        arrow.setMap(null);
    var lineSymbol = {
        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
    };

    var lineCoordinates = [
        lastPostition,
        bestPosition
    ];

    arrow = new google.maps.Polyline({
        path: lineCoordinates,
        icons: [{
            icon: lineSymbol,
            offset: '100%'
        }],
        map: hmap
    });},2000);
    hmap.setCenter(lastPostition);
}