var progressBar2
var videoR = new Resumable({
	target:'JS/uploader/videoUploader.php',
	testChunks: true
});

$(document).ready(function (){ //need this to show the browse file option
	videoR.assignBrowse(document.getElementById('browseCamFile'));

	$('#startCamFile').click(function(){
		instructions('Click  <img src="Images/icons/instructions/light_color/rightclick.png">  to mark point.<br> Press <kbd>Esc</kbd> to exit.')
		var name = $('#camName').val();
		$(".video-statuscontainer").show()
		if(name ==""){
			$.alert({
				boxWidth: '30%',		
				useBootstrap: false,
				title: 'Message',
				content: 'Need Camera Feed Name to Save the Camera Pin and details',
			});
				return;
		};
		let videoType = $("#videoSourceRadio input[name=video]:checked").attr('id')
		let embedLink = $("#embedLinkInput").val()
		if(videoR.files.length == 0 && videoPinEdit == false && videoType == "localVideo"){
			$.alert({
				boxWidth: '30%',		
				useBootstrap: false,
				title: 'Message',
				content: 'Please select a MP4/OGG video file',
			});
			return
		}
		else if(videoR.files.length == 0 && videoPinEdit === true && videoType == "localVideo"){
			OnClickAddCameraSave()
			return
		}
		else if(videoType == "EmbedLink" && embedLink !== ""){
			OnClickAddCameraSave()
			return
		}
		else if(videoType == "EmbedLink" && embedLink == ""){
			$.alert({
				boxWidth: '30%',		
				useBootstrap: false,
				title: 'Message',
				content: 'Please enter the embed video URL',
			});
			return
		}
		else{
			validateVideo(videoR.files[0].fileName, addVideoFile)
		}
	});
});

progressBar2 = new ProgressBar2($('#video-progress-inner'))

function videoClear(){
	videoR.cancel()
	$("#videoFileName").text("")
	$("#videoStatus").text("")
}


function addVideoFile(){
	videoR.upload()
}

function validateVideo(fileName, callback){
	$.ajax({			// to check if the physical file already exist in server 
		type: "POST",
		url: 'JS/uploader/validateVideo.php',
		dataType: 'json',
		data: {
			fileName : fileName
			},
		success: function (obj, textstatus) {
			console.log("validate video");
			if (obj.data == true){
					$.confirm({
						boxWidth: '30%',
							useBootstrap: false,
						title: 'Confirm!',
						content: "Video: "+ fileName + " already exist in server. Do you want to overwrite the file in server?",
						buttons: {
							confirm: function () {
								callback()
							},
							cancel: function () {
								return
							}
						}
					});
				}
				else{
					callback()
				}
		},
		error:	function(xhr,textStatus,errorThrown){
			var str = textStatus + " " + errorThrown;
			console.log(str);
		} 
	});
}

$('#cancelUploadVideo').click(function(){
	videoR.cancel();
	//OnClickAddCameraCancel()
});

videoR.on('fileAdded', function(file, event){
	console.log("File Added")
	progressBar2.fileAdded();
	$("#videoFileName").text(file.fileName);
	$("#videoStatus").text("")
})

videoR.on('fileError', function(file, message){
	$("#videoStatus").removeClass("noError");
	$("#videoStatus").addClass("Error");
	$("#videoStatus").text("Upload error");
	$.alert({
		boxWidth: '30%',
		useBootstrap: false,
		title: 'Message',
		content: "Error!"+ file.fileName +" failed to upload with the following message: " + message,
	});
});

videoR.on('progress', function(){
	progressBar2.uploading(videoR.progress()*100);
	$("#videoStatus").text("Uploading..."+(videoR.progress()*100).toFixed(1) + '%');
});

function ProgressBar2(ele) {
	this.thisEle = $(ele);
	this.fileAdded = function() {
	},
	this.uploading = function(progress) {
		$('#video-progress-inner').css('width', progress +"%");
	}
}

videoR.on('complete', function(){
	$("#videoStatus").removeClass("Error");
	$("#videoStatus").addClass("noError");
	$("#videoStatus").text("Upload complete");
	OnClickAddCameraSave()
})