
//code organization based on Heidi Kasemir gist w/ additional help from Ryan Vrba

//NOTE: code is a mess right now. in the middle of trying to replace hardcoded model
// with data from foursquare. 
//Ultimately  I'd like the app to show a map of top 10 parks 
//in a given city using data from foursquare. Salt Lake City would be the default. 
//User could then change the city.
//The map and filtering worked when i had a hardcoded model. Issue I ran into when I added 
//foursquare data was that request wasn't getting back in time to populate model before
//building the vm. So now I'm trying to not create the vm until callback, but that's 
//causing problems w/ init map. tried to initMap in callback too, but wouldn't work.
//Seems like trying to make everything wait until ajax response is returned defeats the purpose
//of an asynchronous request, but I'm not sure how else to get the data.

var fourSquareURL = 'https://api.foursquare.com/v2/venues/search?near=%22salt%20lake%20city,%20ut%22&limit=10&radius=8046.72&categoryId=4bf58dd8d48988d163941735&client_id=N4151NYLOJ3FQ0GYHUZ4O0OTKNAKX3NW2PJY1HH2503G35WU&client_secret=ALHWZESIYI1MWFX51A0FEKDWNTAKJNFQFHISRSJZM1TUZTAD&v=20160812'
var placeData = [];

 
$.getJSON(fourSquareURL, function(data) {
    placeData = data.response.venues
    //trying to initialize the viewodel in the success callback to make sure data is recieved before vm is built
    console.log("1");
    vm = new ViewModel();
    ko.applyBindings(vm);
});


//model
// var data = [{
//     name: "Liberty Park",
//     pos: {lat: 40.747002, lng: -111.874150}
//     },{
//     name: "Pioneer Park",
//     pos: {lat: 40.761771, lng: -111.901073}
// }];

//in function below, replaced data w/ placeData


var vm,
    map,
    infowindow,
    bounds;

var PlaceConstructor = function(dataObj){
  this.name = ko.observable(dataObj.name)
  //wil have to update marker function now that lat and lng are separate
  this.pos = ko.observable(dataObj.location.lat)
  this.lng = ko.observable(dataObj.location.lng)
  this.address = ko.observable(dataObj.location.address)
}

var ViewModel = function() {
    console.log("2");
    var self = this;
    self.arrayOfAllMyLocations = ko.observableArray();
    placeData.forEach(function(location) {
        self.arrayOfAllMyLocations.push(new PlaceConstructor(location));
    })
    
    //took function from 
    //https://discussions.udacity.com/t/adding-click-event-to-list-item-and-open-infowindow/177224/3
    self.listItemClick = function(marker) {
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
        console.log("3");
        for (var i = 0; i < vm.arrayOfAllMyLocations().length; i++) {
            var marker = new google.maps.Marker({
                //will need to update position now that lat and lng are separate, no more sing pos
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




//issue I'm running into is that map depends on vm which isn't built in time.
//tried to initialize map in ajax success callback but it wasn't working.
function initMap() {
    console.log("4");
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
