var serviceURL = "http://mosque-finder.com.au/directory/app-data/wp_postmeta_extended.json";

var employees;

$('#employeeListPage').live('pagebeforecreate', function(event) {
        //alert('employeeListPage');
	getEmployeeList();
});

function getEmployeeList() {
	$.getJSON( serviceURL, function(data) {
		$('#employeeList li').remove();
                for (var x = 0; x < data.length; x++) {
var loc1 = new google.maps.LatLng(data[x].Latitude, data[x].Longitude);
var loc2 = new google.maps.LatLng(currentlocation[0], currentlocation[1]);
var dist = loc2.distanceFrom(loc1);
                	 $('#employeeList').append("<li><a href='employeedetails.html?id="+data[x].ID+"' ><h3 class='ui-li-heading'>" +data[x].post_title+ "</h3><p class='ui-li-desc'>" + data[x].Location +"</p><span class='ui-li-count ui-btn-up-c ui-btn-corner-all'>"+ dist/1000 +" km</span></a></li>");
                }

        try {
                   $('#employeeList').listview('refresh');
                } catch(e) {
                    $('#employeeList').trigger("create");
                }
         });
	}

google.maps.LatLng.prototype.distanceFrom = function(latlng) {
  var lat = [this.lat(), latlng.lat()]
  var lng = [this.lng(), latlng.lng()]
  var R = 6378137;
  var dLat = (lat[1]-lat[0]) * Math.PI / 180;
  var dLng = (lng[1]-lng[0]) * Math.PI / 180;
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
  Math.cos(lat[0] * Math.PI / 180 ) * Math.cos(lat[1] * Math.PI / 180 ) *
  Math.sin(dLng/2) * Math.sin(dLng/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;
  return Math.round(d);
}