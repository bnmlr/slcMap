
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
    // based on http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html
    //can't figure out how to make this work
    self.filteredItems = ko.computed(function() {
        //console.log(self.filter());

        var stringStartsWith = function (string, startsWith) {          
            string = string || "";
            if (startsWith.length > string.length)
                return false;
            return string.substring(0, startsWith.length) === startsWith;
        };

        // Get the value of the filter input
        var filter = self.filter().toLowerCase();

        if (!filter) {
            // Return all locations
            return self.arrayOfAllMyLocations();
        } else {
            //below is a function that allows us to pass in an array and control which items are 
            //included in a new array based on the result of the function executed on each item
            //of the original array that gets passed in
            return ko.utils.arrayFilter(self.arrayOfAllMyLocations(), function(item) {
                //console.log(item);
                //below is the function that is executed on each item. it compares the
                //name of the item to whatever is in the filter. if it's a match, it
                //gets passed through to the filtered array. if it's not a match, it doesn't 
                return stringStartsWith(item.name().toLowerCase(), filter);
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