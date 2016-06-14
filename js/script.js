
//code organization based on Heidi Kasemir gist
//model
var data = [{
    name: "Liberty Park"
    pos: "of"
    },{
    name: "Pioneer Park"
    pos: "objects"
}];

var PlaceConstructor = function(dataObj){
  this.name = ko.observable(dataObj.name)
  // ...etc...
  // this includes all the things you want to track per location (whether it's a 'favorite' or not?)
}

var ViewModel = function() {
    var self = this;

    self.locationsArray = ko.observableArray();

    data.forEach(function(location) {
    self.arrayOfAllMyLocations.push(new PlaceConstructor(location));
    // you can also make all the markers here
    
    })

    self.createMarkers = function() {
    // make the markers, set event listeners, get infowindow content, etc
    // this may be pieced out into as many smaller functions as you think make sense
    }

     // you will probably need to make additional functions to make this code modular and clean
  // or to add your unique functionality

}

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
    
    var infowindow = new google.maps.InfoWindow({
    content: "Some Content"
    });
    marker.addListener('click', function() {
        //marker bounces once on click
        marker.setAnimation(google.maps.Animation.BOUNCE);
        window.setTimeout(function() {
           marker.setAnimation(null);
        }, 700);
    });
    marker.addListener('click', function(){
        infowindow.open(map, marker);
    });
}

