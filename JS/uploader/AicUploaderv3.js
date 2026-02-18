var progressBar2
var aicResumable = new Resumable({
	target: 'JS/uploader/AicUploaderv3.php',
	testChunks: true,
	query: {
		"packageId": "!@#$%^&*()"	//assign random value and reassign later 
	}
});
aicResumable.assignBrowse(document.getElementById('aicFormImgInput'));
//progressBar2 = new ProgressBar2($('#video-progress-inner'))

$('#AicSaveButton').click(function () {
	if ($("#aicFormCapturedDate").val() == "") {
		$.alert({
			boxWidth: "30%",
			useBootstrap: false,
			title: "Message",
			content: "Please enter Image Captured Date",
		});
		return
	}

	if (localStorage.isParent == "isParent") {
		if ($("#aicFormPackageId").val() == null || $("#aicFormPackageId").val() == "undefined") {
			$.alert({
				boxWidth: "30%",
				useBootstrap: false,
				title: "Message",
				content: "Please select Package Id.",
			});
			return
		}
		else{
			aicResumable.opts.query.packageId = $("#aicFormPackageId option:selected").attr("data-2");
		}
	}

	if (aicResumable.files.length < 1) {
		$.alert({
			boxWidth: "30%",
			useBootstrap: false,
			title: "Message",
			content: "Please select an aerial image.",
		});
		return
	}
	validateAicFile(aicResumable.files[0].fileName, addAicFile)

});

function aicClear() {
	aicResumable.cancel()
	$("#aicFileName").text("")
	$("#aicUploadStatus").text("")
}

function addAicFile() {
	aicResumable.upload()
}

function validateAicFile(fileName, callback) {
	var packageId = $("#aicFormPackageId").val()
	$.ajax({ // to check if the physical file already exist in server 
		type: "POST",
		url: 'JS/uploader/validateAICv3.php',
		dataType: 'json',
		data: {
			fileName: fileName,
			packageId: packageId
		},
		success: function (obj, textstatus) {
			if (obj.data == true) {
				$.confirm({
					boxWidth: '30%',
					useBootstrap: false,
					title: 'Confirm!',
					content: "Image: " + fileName + " already exist in server. Do you want to overwrite the file in server?",
					buttons: {
						confirm: function () {
							callback()
						},
						cancel: function () {
							return
						}
					}
				});
			} else {
				callback()
			}
		},
		error: function (xhr, textStatus, errorThrown) {
			var str = textStatus + " " + errorThrown;
		}
	});
}

aicResumable.on('fileAdded', function (file, event) {
	$("#aicFileName").text(file.fileName);

	//filter extension
	let fileNameArray = file.file.name.split('.')
	let reg = ''
	if(SYSTEM == 'OBYU'){
		reg = /(png|bmp|jpeg|jpg)/g;
	}else{
		reg = /(ecw|tif|tiff|zip)/g;
	}

	let fileType = fileNameArray[fileNameArray.length-1]
	if (!fileType.toLowerCase().match(reg)) {
		aicResumable.cancel();
		$("#aicFileName").text("");
		return
	}
	aicData.imgType = fileType[0].toUpperCase();

	$("#aicUploadStatus").text("")
})

aicResumable.on('fileError', function (file, message) {
	$("#aicUploadStatus").removeClass("noError");
	$("#aicUploadStatus").addClass("Error");
	$("#aicUploadStatus").text("Upload error");
	$.alert({
		boxWidth: '30%',
		useBootstrap: false,
		title: 'Message',
		content: "Error!" + file.fileName + " failed to upload with the following message: " + message,
	});
});

aicResumable.on('progress', function () {
	//progressBar2.uploading(aicResumable.progress()*100);
	$("#aicUploadStatus").text("Uploading..." + (aicResumable.progress() * 100).toFixed(1) + '%');
});

aicResumable.on('fileSuccess', function(file, event) {
	if(SYSTEM == 'KKR'){
		var msgJavaBridge = JSON.parse(event);
		if(!msgJavaBridge.bool){
			aicNewReg();
			$.alert({
				boxWidth: '30%',
				useBootstrap: false,
				title: 'Error',
				content: msgJavaBridge.msg,
			});
			return;
		}
	}

	$("#aicUploadStatus").removeClass("Error");
	$("#aicUploadStatus").addClass("noError");
	$("#aicUploadStatus").text("Upload complete");
	if ($("#AicUpdateButton").css("display") !== "none" && $("#AicUpdateButton").attr("data") == "Revise Image") {
		updateAicImagePath()
	} else {
		saveAicRoutineInfo()
	}
});