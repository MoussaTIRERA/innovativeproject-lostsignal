function getDistance(x1,y1,x2,y2) {
    var distance = sqrt(pow(x2-x1,2)+pow(y2-y1,2));
    return distance;
}

function getBestPoint() {
    var bestPoint;
    // ustalamy najlepszy punkt. w pętli sprawdzamy wszystkie mozliwe punkty i porównujemy pod względem odległości
    // jeśli odległość jest mniejsza i siła sygnału >= -80, wtedy ustawiamy nowy najlepszy punkt |||[-140,-70]
}