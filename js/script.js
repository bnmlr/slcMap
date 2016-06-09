var map;

var marker;

function initMap() {
    var myLatlng = {lat: -34.397, lng: 150.644};

    var map = new google.maps.Map(document.getElementById('map'), {
        center: myLatlng,
        zoom: 8
    });

    marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: 'Click to zoom'
    });
    
    var infowindow = new google.maps.InfoWindow({
    content: "Some Content"
    });
    marker.addListener('click', function() {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        // 3 seconds after the center of the map has changed, pan back to the
        // marker.
        window.setTimeout(function() {
           marker.setAnimation(null);
        }, 700);
    });
    marker.addListener('click', function(){
        infowindow.open(map, marker);
    });
}

