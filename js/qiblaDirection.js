// The watch id references the current `watchHeading`


$('#qiblaDirection').live('pagebeforecreate', function(event) {
        var watchID = null;
        //alert('employeeListPage');
	loadCompass();
});

    function loadCompass() {
        var angle = direction;
   if(direction >=0){
         $('#qibla').html( "<strong>Qibla Direction </strong>" + direction + "degrees east of North");
    }else{ 
         $('#qibla').html("<strong>Qibla Direction </strong>" +  (-direction) +" degrees west of North");
    } 

        $('#img-direction').css('-webkit-transform', 'rotate(' + angle +'deg )');
        $('#img-direction').css('-moz-transform', 'rotate(' + angle +'deg )');
        $('#img-direction').css('transform', 'rotate(' + angle +'deg )');




        $('#txtHeading').attr('value',angle);
//        alert(angle);
        //startWatch();
       // navigator.compass.getCurrentHeading(onSuccess, onError);
    }

    // Start watching the compass
    //
    function startWatch() {
    
        // Update compass every 3 seconds
        var options = { frequency: 3000 };
    
        watchID = navigator.compass.watchHeading(onCampassSuccess, onCampassError, options);
    }
    // Stop watching the compass
    //
    function stopWatch() {
        if (watchID) {
            navigator.compass.clearWatch(watchID);
            watchID = null;
        }
    }

    // onSuccess: Get the current heading
    //
    function onCampassSuccess(heading){
		var rotation = -Math.round(heading.magneticHeading)+ 'deg';
               
        //alert('Heading: ' + heading.magneticHeading);
	
        $('#txtHeading').attr('value',  rotation);
	$('#img-compass').css('-webkit-transform', 'rotate(' + rotation +')');
        $('#img-compass').css('-moz-transform', 'rotate(' + rotation +')');
        $('#img-compass').css('transform', 'rotate(' + rotation +')');

        angle = - Math.round(heading.magneticHeading - direction);  
        $('#img-direction').css('-webkit-transform', 'rotate(' + angle +'deg )');
        $('#img-direction').css('-moz-transform', 'rotate(' + angle +'deg )');
        $('#img-direction').css('transform', 'rotate(' + angle +'deg )');
    }

    // onError: Get the current heading
    //
    function onCampassError(){
     alert("No magnetic heading found");
}