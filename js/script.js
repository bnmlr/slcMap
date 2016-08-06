
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
    })
    
    //took function from 
    //https://discussions.udacity.com/t/adding-click-event-to-list-item-and-open-infowindow/177224/3
    self.listItemClick = function(marker) {
    console.log(marker);
    google.maps.event.trigger(this.marker, 'click');
    };
    //controls marker click behavior. goal was to have one function that marker and list clicks could both
    //trigger, but couldn't figure it out, so i created a separate one, listItemClick
    self.markerClick = function () {
        infowindow.open(map, this);
        //marker bounces once on click
        this.setAnimation(google.maps.Animation.BOUNCE);
        thisMarker = this
        window.setTimeout(function() {
           thisMarker.setAnimation(null);
        }, 700);
    };

    //define marker creation function here, call it inside initmap
    self.createMarkers = function() {
        for (var i = 0; i < vm.arrayOfAllMyLocations().length; i++) {
            var marker = new google.maps.Marker({
            position: vm.arrayOfAllMyLocations()[i].pos(),
            map: map,
            title: vm.arrayOfAllMyLocations()[i].name()
            });
            marker.addListener('click', vm.markerClick);
            vm.arrayOfAllMyLocations()[i].marker = marker;
        }
    }; 

    self.filter = ko.observable("");
    // filter the items using the filter text
    // list is bound to self.filteredItems, which updates based on filter input
    self.filteredItems = ko.computed(function() {

        // Get the value of the filter input
        var filter = self.filter().toLowerCase();
        if (!filter) {
            // unhides hidden markers when filter is deleted
            //if statement makes sure this doesn't run before there's a filtered list
            if (typeof self.filteredItems == 'function' ) {
                ko.utils.arrayForEach(self.arrayOfAllMyLocations(), function(item) {
                    item.marker.setVisible(true);
                });
            };
            return self.arrayOfAllMyLocations();
        } else {
            //function allows us to pass in an array and control which items are 
            //included in a new array based on the result of the function executed 
            //on each item of the original array 
            return ko.utils.arrayFilter(self.arrayOfAllMyLocations(), function(item) {
                //compares name of each item in array to the
                //string in the filter. if it's a match, it makes
                //sure that item's marker is visible and the item
                //gets passed through to the filtered array. if it's not a match, the marker
                //is set to invisible and item isn't passed on to filtered array

              if (item.name().toLowerCase().indexOf(filter) !== -1) {
              //if (stringStartsWith(item.name().toLowerCase(), filter)) {
                    //not sure line below is necessary
                    item.marker.setVisible(true);
                    return true
               } else {
                    item.marker.setVisible(false);
                    return false
               }
            });
        }
    });
};


var vm = new ViewModel();
ko.applyBindings(vm);


console.log(vm.filteredItems());
function initMap() {
    map = new google.maps.Map(document.getElementById('map'));
 //create one infowindow and just switch out the content on clicks   
    infowindow = new google.maps.InfoWindow({
        content: "Some Content"
    });

    vm.createMarkers();

    //set the bounds of the map to wherever the markers are
    bounds = new google.maps.LatLngBounds();
    vm.arrayOfAllMyLocations().forEach(function(item) {
        bounds.extend(item.marker.getPosition());
    });
    map.fitBounds(bounds);
};