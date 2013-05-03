var jsonURL = "http://mosque-finder.com.au/directory/api/get_post/"
$('#detailsPage').live('pageshow', function(event) {
	var id = getUrlVars()["id"];
	$.getJSON(jsonURL + '?id='+id, displayEmployee);
});

function displayEmployee(data) {
	$('#pageTitle').html(data.post.title);
	$('#locationDetails').html(data.post.content);
	//console.log(employee.content);
	$('#actionList').listview('refresh');
}

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }

    return vars;
}

function initialize(address, num, zoom) {
	var geo = new google.maps.Geocoder(),
	latlng = new google.maps.LatLng(-34.397, 150.644),
	myOptions = {
	 'zoom': zoom,
         center: latlng,
	 mapTypeId: google.maps.MapTypeId.ROADMAP
    },
    map = new google.maps.Map(document.getElementById("themify_map_canvas_" + num), myOptions);

	geo.geocode( { 'address': address}, function(results, status) {
	 if (status == google.maps.GeocoderStatus.OK) {
	   map.setCenter(results[0].geometry.location);
	   var marker = new google.maps.Marker({
		  map: map, 
		  position: results[0].geometry.location
	   });
	 } else {
	   // status
	 }
    });
  }