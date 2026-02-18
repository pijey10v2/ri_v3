function SaveMyData(locationName, regionName, lng, lat){
	// this function is used to save the data to mydata.json
	$.post( "BackEnd/saveLocationData.php", 
	{
		lName: locationName,
		rName: regionName,
		lng: lng,
		lat: lat,
		status: '0%'
	})
  .done(function( data ) {
   var response = JSON.parse(data);
   $.alert({
	   boxWidth: '30%',
		useBootstrap: false,
		title: 'Message',
		content: response['msg'],
});
   var location = response['data'];
   console.log(location);
   var desc = '<table class = "cesium-infoBox-defaultTable cesium-infoBox-defaultTable-lighter"><tbody>';
   desc += '<tr><th>' + "Longitude" + '</th><td>' + lng +'</td></tr>';
   desc += '<tr><th>' + "Latitude" + '</th><td>' + lat +'</td></tr>';
   desc += '</tbody></table>';
   addPinEntity(location.locationID, locationName, lng,lat, desc, '0%');
  locations.push({
	   locationID: location.locationID,
	   locationName: locationName,
	   longitude: lng,
	   latitude: lat,
	   region: regionName,
	   project_id: location.project_id,
	   status: '0%',
	   projectwisePath: location.projectwisePath,
	   folderID : location.folderID
	  })

  });
}

function SaveFileData(EntityIndex){
	var i= EntityIndex;
	var status = locations[i].status;
	var fileMethod ="pw";
	var path = locations[i].projectwisePath;
	var id = locations[i].folderID;
	var locationid = locations[i].locationID;
	console.log(path);
	console.log(id);
	
	$.post( "BackEnd/saveProjectwiseFileData.php", 
	{
		lID: locationid,
		status: status,
		instanceId: id,
		fileMethod:fileMethod,
		filePath: path
	})
  	.done(function( data ) {
		console.log(data);
		var myJson = JSON.parse(data);
		//var files = myJson['data'];
		$.alert({
			boxWidth: '30%',
			useBootstrap: false,
			title: 'Message',
			content: myJson['msg'],
		});
		if(myJson['data'] ==true){
			var myurl;
			switch(status){
				case "10%":myurl = 'Images/pins/red-pin.png';
				break;
				case "25%" : myurl = 'Images/pins/orange-pin.png';
				break;
				case "50%" : myurl = 'Images/pins/yellow-pin.png';
				break;
				case "75%" : myurl = 'Images/pins/blue-pin.png';
				break;
				case "100%" : myurl = 'Images/pins/green-pin.png';
				break;
				default :myurl = 'Images/pins/red-pin.png';
				
			};
			entitiesArray[i].billboard.image = myurl;
		}
	
	});
}

