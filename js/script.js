
//code organization based on Heidi Kasemir gist
//model
var data = [{
    name: "Liberty Park",
    pos: {lat: 40.747002, lng: -111.874150}
    },{
    name: "Pioneer Park",
    pos: {lat: 40.761771, lng: -111.901073}
}];

var PlaceConstructor = function(dataObj){
  this.name = ko.observable(dataObj.name)
  this.pos = ko.observable(dataObj.pos)
  // ...etc...
  // this includes all the things you want to track per location (whether it's a 'favorite' or not?)
}

var ViewModel = function() {
    var self = this;
    self.arrayOfAllMyLocations = ko.observableArray();
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

ko.applyBindings(new ViewModel());


function initMap() {
    var myLatlng = {lat: 40.761353, lng: -111.891851};

    var map = new google.maps.Map(document.getElementById('map'), {
        center: myLatlng,
        zoom: 13
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

