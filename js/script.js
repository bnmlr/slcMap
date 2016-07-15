
//code organization based on Heidi Kasemir gist w/ additional help from Ryan Vrba

//model
var data = [{
    name: "Liberty Park",
    pos: {lat: 40.747002, lng: -111.874150}
    },{
    name: "Pioneer Park",
    pos: {lat: 40.761771, lng: -111.901073}
}];

var map,
    infowindow,
    bounds;

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
    //define marker creation function here, call it inside initmap
    self.createMarkers = function() {
        for (var i = 0; i < vm.arrayOfAllMyLocations().length; i++) {
            var marker = new google.maps.Marker({
            position: vm.arrayOfAllMyLocations()[i].pos(),
            map: map,
            title: vm.arrayOfAllMyLocations()[i].name()
            });
            marker.addListener('click', markerClick);
            vm.arrayOfAllMyLocations()[i].marker = marker;
        }
    }; 
    //controls marker click behavior
    function markerClick() {
    infowindow.open(map, this);
    //marker bounces once on click
    this.setAnimation(google.maps.Animation.BOUNCE);
    self = this
    window.setTimeout(function() {
       self.setAnimation(null);
    }, 700);
    };

};

var vm = new ViewModel();
ko.applyBindings(vm);

function initMap() {
    var myLatlng = {lat: 40.761353, lng: -111.891851};

    map = new google.maps.Map(document.getElementById('map'), {
        center: myLatlng,
        zoom: 13
    });

//this will allow me to set teh bounds of the map to wherever the markers are. look it up
    bounds = new google.maps.LatLngBounds();
 
 //create one infowindow and just switch out the content on clicks   
    infowindow = new google.maps.InfoWindow({
        content: "Some Content"
    });

    vm.createMarkers();
};