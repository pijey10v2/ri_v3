function downloadData(url){
	window.open(url);
	// refresh after 2 second maybe
	setTimeout(() => {
		location.reload(true);
	}, 2500);
}

function openMinimalWindow(url, winName = 'RI Construct'){
	let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=0,height=0,left=-1000,top=-1000`;
	window.open(url, winName, params);
}