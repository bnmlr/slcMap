var map;

function initMap() {
    var myLatlng = {lat: -34.397, lng: 150.644};

    var map = new google.maps.Map(document.getElementById('map'), {
        center: myLatlng,
        zoom: 8
    });

    var marker = new google.maps.Marker({
    position: myLatlng,
    map: map,
    title: 'Click to zoom'
  });

}