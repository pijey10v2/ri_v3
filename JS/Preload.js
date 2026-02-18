$(document).ready(function () {
	localStorage.clear();
	var url_string = window.location.href
	var url = new URL(url_string);
	var site = url.searchParams.get("page");
	
	$.when(
		$.ajax({
			type: "POST",
			url: '../BackEnd/Project_data.php',
			data: { "page": site },
			dataType: 'json',
			success: function (obj) {
				localStorage.signed_in_email = obj.signed_In_Email;
				if (site == "systemadmin") {
					return	//if systemadmin page then only signedInEmail is required
				}
				localStorage.usr_name = obj.UserName
				localStorage.usr_role = obj.Pro_Role
				localStorage.p_id = obj.project_id
				localStorage.p_id_name = obj.project_id_name
				localStorage.user_org = obj.user_org
				localStorage.p_name = obj.project_name
				localStorage.longitude1 = parseFloat(obj.longitude1)
				localStorage.longitude2 = parseFloat(obj.longitude2)
				localStorage.latitude1 = parseFloat(obj.latitude1)
				localStorage.latitude2 = parseFloat(obj.latitude2)
				localStorage.iconurl = obj.iconurl
				localStorage.isParent = obj.isParent
				localStorage.project_owner = obj.project_owner
				localStorage.prefix_loc = obj.prefix_loc
				localStorage.Project_type = obj.Project_type

				//localStorage.parent_id = obj.parent_project_id;
				if ( obj.parent_project_id) {
					// this is parent project id not id number, for JOGET purpose
					localStorage.parent_project_id = obj.parent_project_id
				}
				//if (obj.isParent !== undefined && obj.appsLinks) {	//project package
				if ( obj.appsLinks) {	//need for both overall project and package project
					localStorage.appsLinks = obj.appsLinks
				}
				if (obj.start_date !== undefined) {
					localStorage.start_date = obj.start_date;
					localStorage.end_date = obj.end_date;
				}
				localStorage.projectlist = JSON.stringify(obj.projectlist)
				localStorage.signed_in_email = obj.signed_In_Email;
				//localStorage.jogetToken = obj.jogetToken;
			},
			error: function (xhr, textStatus, errorThrown) {
				var str = textStatus + " " + errorThrown;
				console.log(errorThrown);
				console.log(textStatus)
			}
		}),

	).then(function () {
		if (site == "systemadmin") {
			window.open("../systemadmin.php", '_self')
		}
		else if (site == "index") {
			var constructProcessID = url.searchParams.get("processid");
			var constructActID = url.searchParams.get("actid");
			var constructAppName = url.searchParams.get("processappname");

			var iniateConopBrowser = url.searchParams.get("initConop");
			var eleConopBrowser = url.searchParams.get("data");
			
			if (constructProcessID && constructActID && constructAppName) {
				window.open("../index.php?processid="+constructProcessID+"&actid="+constructActID+"&processappname="+constructAppName, '_self')
			}else if (iniateConopBrowser && eleConopBrowser){
				window.open("../index.php?initConop="+iniateConopBrowser+"&data="+eleConopBrowser, '_self')
			}else{
				window.open("../index.php", '_self')
			}
		}
		else if (site == "admin") {
			window.open("../admin.php", '_self')
		}
		else if (site == "finance") {
			var actid = url.searchParams.get("actid");
			var processname = url.searchParams.get("p");
			if (actid && processname) {
				window.open("../finance.php?actid="+actid+"&p="+processname, '_self')
			}else{
				window.open("../finance.php?", '_self')
			}
		}
		else if (site == "doc") {
			url.searchParams.delete('page'); // remove page from url string and sent everthing else
			window.open("../doc.php?"+url.search.slice(1), '_self')
		}
		else {
			window.open("../signin.php", '_self')
		}
	});
})





