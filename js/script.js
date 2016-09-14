
//code organization based on Heidi Kasemir gist w/ additional help from Ryan Vrba

var dataRequest = function(city) {
    city = $("#cityInput").val();
    encodedCity = encodeURIComponent(city);
    var fourSquareURL = 'https://api.foursquare.com/v2/venues/search?near=%22' + encodedCity + '%22&limit=10&radius=8046.72&categoryId=4bf58dd8d48988d163941735&client_id=N4151NYLOJ3FQ0GYHUZ4O0OTKNAKX3NW2PJY1HH2503G35WU&client_secret=ALHWZESIYI1MWFX51A0FEKDWNTAKJNFQFHISRSJZM1TUZTAD&v=20160812';
    var placeData = [];
    //Get foursquare data
    $.getJSON(fourSquareURL, function(data) {

        placeData = data.response.venues;
        //Create loations once foursquare data is received
        vm.arrayOfAllMyLocations([]);
        vm.createLocations(placeData);
        //Set bounds of map to markers
        bounds = new google.maps.LatLngBounds();
        vm.arrayOfAllMyLocations().forEach(function(item) {
            bounds.extend(item.marker.getPosition());
        });
        map.fitBounds(bounds);
    })
    .fail(function() {
            window.alert("Data request failed. Check your internet connection and try again later.");
        });
};

dataRequest();

$("#cityInput").keypress(function(e) {
    if(e.keyCode == 13) {
        dataRequest();
    }
});

var vm,
    map,
    infowindow,
    bounds;

//Builds out each location with data from foursquare
var LocationConstructor = function(dataObj) {
    this.name = dataObj.name;
    this.pos = {lat: dataObj.location.lat, lng: dataObj.location.lng};
    if (typeof dataObj.location.address === "undefined") {
        dataObj.location.address = "Not available";
    }
    this.address = dataObj.location.address;
    //creates a marker for each location
    var marker = new google.maps.Marker({
                position: {lat: dataObj.location.lat, lng: dataObj.location.lng}, 
                map: map,
                title: dataObj.name,
                content: dataObj.name + "<br>" + "Address: " + dataObj.location.address
            });
            marker.addListener('click', vm.markerClick);
    this.marker = marker;
};

var ViewModel = function() {
    var self = this;
    self.arrayOfAllMyLocations = ko.observableArray();
    //took function from 
    //https://discussions.udacity.com/t/adding-click-event-to-list-item-and-open-infowindow/177224/3
    self.listItemClick = function(marker) {
        google.maps.event.trigger(this.marker, 'click');
    };
    //controls marker click behavior
    self.markerClick = function () {
        infowindow.setContent(this.content);
        infowindow.open(map, this);
        //marker bounces once on click
        this.setAnimation(google.maps.Animation.BOUNCE);
        thisMarker = this;
        window.setTimeout(function() {
           thisMarker.setAnimation(null);
        }, 700);
    };

    //function creates locations and builds observable array of locations. initialized on ajax success
    self.createLocations = function(data) {
        for (var i = 0; i < data.length; i++) {
            self.arrayOfAllMyLocations.push(new LocationConstructor(data[i]));
        }
    }; 

    self.filter = ko.observable("");
    // filters the items using the filter text
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
            }
            return self.arrayOfAllMyLocations();
        } else {
            //ko array filter function allows us to pass in an array and control which items are 
            //included in a new array based on the result of the function executed 
            //on each item of the original array

            return ko.utils.arrayFilter(self.arrayOfAllMyLocations(), function(item) {
                //compares name of each item in array to the
                //string in the filter. if it's a match, it makes
                //sure that item's marker is visible and the item
                //gets passed through to the filtered array. if it's not a match, the marker
                //is set to invisible and item isn't passed on to filtered array

              if (item.name.toLowerCase().indexOf(filter) !== -1) {
                    item.marker.setVisible(true);
                    return true;
               } else {
                    item.marker.setVisible(false);
                    infowindow.close();
                    return false;
               }
            });
        }
    });
};

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.7767168, lng: -111.9905249},
        zoom: 12
        });
 //create one infowindow and just switch out the content on clicks   
    infowindow = new google.maps.InfoWindow({
        content: "Some Content"
    });
//resize/recenter map when window changes
    google.maps.event.addDomListener(window, "resize", function() {
            var center = map.getCenter();
            google.maps.event.trigger(map, "resize");
            map.setCenter(center);
        });

    // Create ViewModel and apply Knockout bindings
    vm = new ViewModel();
    ko.applyBindings(vm);
}

//sliding menu code from https://apeatling.com/2014/01/building-smooth-sliding-mobile-menu/
(function($) {
 /*** 
  * Run this code when the #toggle-menu link has been tapped
  * or clicked
  */
 $('#toggle-menu').on('touchstart click', function(e) {
  e.preventDefault();
 
  var $body = $('body'),
      $page = $('#page'),
      $menu = $('#list'),
 
      /* Cross browser support for CSS "transition end" event */
      transitionEnd = 'transitionend webkitTransitionEnd otransitionend MSTransitionEnd';
 
  /* When the toggle menu link is clicked, animation starts */
  $body.addClass('animating');
 
  /***
   * Determine the direction of the animation and
   * add the correct direction class depending
   * on whether the menu was already visible.
   */
  if ($body.hasClass('menu-visible')) {
   $body.addClass('right');
  } else {
   $body.addClass('left');
  }
  
  /***
   * When the animation (technically a CSS transition)
   * has finished, remove all animating classes and
   * either add or remove the "menu-visible" class 
   * depending whether it was visible or not previously.
   */
  $page.on(transitionEnd, function() {
   $body
    .removeClass('animating left right')
    .toggleClass('menu-visible');
 
   $page.off(transitionEnd);
  } );
 } );
} )(jQuery);