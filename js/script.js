
//code organization based on Heidi Kasemir gist w/ help from Ryan Vrba
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


//make these variable accessible globally
var vm = new ViewModel();
ko.applyBindings(vm);

var map,
    infowindow,
    bounds;


function initMap() {
    var myLatlng = {lat: 40.761353, lng: -111.891851};

    map = new google.maps.Map(document.getElementById('map'), {
        center: myLatlng,
        zoom: 13
    });

//this will allow me to set teh bounds of the map to wherever the markers are. look it up
    bounds = new google.maps.LatLngBounds();

    // var marker = new google.maps.Marker({
    //     position: myLatlng,
    //     map: map,
    //     title: 'Click to zoom'
    // });
 
 //create one infowindow and just switch out the content on clicks   
    infowindow = new google.maps.InfoWindow({
        content: "Some Content"
    });
    // marker.addListener('click', function() {
    //     //marker bounces once on click
    //     marker.setAnimation(google.maps.Animation.BOUNCE);
    //     window.setTimeout(function() {
    //        marker.setAnimation(null);
    //     }, 700);
    // });
    // marker.addListener('click', function(){
    //     infowindow.open(map, marker);
    // });

    createMarkers();
}

//define function here, call it inside initmap
//can add event listeners here, but make results of listeners a separate function that gets called
//by the listener
function createMarkers() {
    for (var i = 0; i < vm.arrayOfAllMyLocations().length; i++) {
        var marker = new google.maps.Marker({
            position: vm.arrayOfAllMyLocations()[i].pos(),
            map: map,
            title: vm.arrayOfAllMyLocations()[i].name()
        });
        console.log(marker);
        marker.addListener('click', function(){
            console.log(marker);
            infowindow.open(map, this);
        });
        vm.arrayOfAllMyLocations()[i].marker = marker;
    }
};  
