 // Cordova is ready
    //
var sql;
var params;
var currentlocation;
var direction;
function onDeviceReady() {
    navigator.geolocation.getCurrentPosition(onGeoSuccess,onGeoError);
}

    // onSuccess Geolocation
    //
function onGeoSuccess(position) {
    currentlocation = [position.coords.latitude,position.coords.longitude,position.coords.accuracy , position.timestamp]
    $("#geoInfo").html('<strong>Current location</strong>' + '<br />' +'<strong>Latitude:</strong> '  + position.coords.latitude   + ' <strong>Longitude:</strong> '  + position.coords.longitude)
     var times = prayTimes.getTimes(new Date(), [position.coords.latitude,position.coords.longitude ]);
     $("#prayerTimeInfo").html('<strong>Prayer time for today</strong></br> <strong>Fajr :</strong> ' +times.fajr  + ' <strong>Dhuhr :</strong> '+ times.dhuhr +'  <strong>Asr :</strong> '+ times.asr +	' <strong>Maghrib  :</strong> '+ times.maghrib +' <strong>Isha :</strong> '+ times.isha +'</br><strong>Sunrise :</strong> '+ times.sunrise +'<strong>Sunset :</strong> '+ times.sunset) ;
    direction = qiblaDirection(position);
    console.log("Qibla Direction: " + direction);
    if(direction >=0){
         $("#prayerDirection").html( "<strong>Qibla Direction </strong>" + direction + "degrees east of North");
    }else{ 
         $("#prayerDirection").html("<strong>Qibla Direction </strong>" +  (-direction) +" degrees west of North");
    } 

    var db = window.openDatabase("syncdemodb", "1.0", "Sync Demo DB", 200000);
      sql ="INSERT INTO CURRENTLOCATION(latitude, longitude, altitude, accuracy,altitudeAccuracy, heading, speed,timestamp) VALUES (?,?,?,?,?,?,?,?)";
      params = [position.coords.latitude, position.coords.longitude , position.coords.altitude , position.coords.accuracy , position.coords.altitudeAccuracy , position.coords.heading,  position.coords.speed , position.timestamp];
     db.transaction(populateDB, errorGeoCDB, successGeoCDB);

     console.log('Latitude: '           + position.coords.latitude              + '<br />' +
                            'Longitude: '          + position.coords.longitude             + '<br />' +
                            'Altitude: '           + position.coords.altitude              + '<br />' +
                            'Accuracy: '           + position.coords.accuracy              + '<br />' +
                            'Altitude Accuracy: '  + position.coords.altitudeAccuracy      + '<br />' +
                            'Heading: '            + position.coords.heading               + '<br />' +
                            'Speed: '              + position.coords.speed                 + '<br />' +
                            'Timestamp: '          + position.timestamp          + '<br />');
 
    }

    // onError Callback receives a PositionError object
    function onGeoError(error) {
        console.log('code: '    + error.code    + '\n' +
                'message: ' + error.message + '\n');
        alert('code: '    + error.code    + '\n' +
                'message: ' + error.message + '\n');
    }

function populateDB(tx) {
   console.log(sql);
   console.log(params);
     tx.executeSql(sql, params);
 
}


function errorGeoCDB(err) {
    console.log("Error processing SQL: "+err.code);
}

function successGeoCDB() {
    console.log("Geo data added success!");
}

function qiblaDirection( position){

        var lat1= 21.42259;
        var lon1= 39.826169;

        var lat2 = position.coords.latitude;
        var lon2= position.coords.longitude;




var R = 6371; // km
var dLat = (lat2-lat1).toRad();
var dLon = (lon2-lon1).toRad();
var lat1 = lat1.toRad();
var lat2 = lat2.toRad();

var y = Math.sin(dLon) * Math.cos(lat2);
var x = Math.cos(lat1)*Math.sin(lat2) -
        Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon);
var brng = Math.atan2(y, x).toDeg();
console.log(brng);
return Math.round(brng);
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
// extend Number object with methods for converting degrees/radians
Number.prototype.toRad = function() { // convert degrees to radians
return this * Math.PI / 180;
}
Number.prototype.toDeg = function() { // convert radians to degrees (signed)
return this * 180 / Math.PI;
}
Number.prototype.toBrng = function() { // convert radians to degrees (as bearing: 0...360)
return (this.toDeg()+360) % 360;
}