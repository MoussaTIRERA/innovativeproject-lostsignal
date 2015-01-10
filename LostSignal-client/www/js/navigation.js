function search_nearest(lastPosition){
    actual_lat = lastPostition.latitude;
    actual_long = lastPostition.longitude;
    db_navigate.transaction(populateDB_searchNearestPoint, errorCB_nav, successCB);
}