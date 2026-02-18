var $jogetHost = JOGETHOST;

function OnClickIssueNCR() {
  changePointColour = "colourNCR"
  
  if (isParent && !constructPackageId) {
    return;
  }
  if (!jogetAppProcesses["app_NCR"]) {
    return;
  }
  jogetProcessApp = "NCR";
  jogetConOpDraw.processName = "Non Conformance Report"
  changeAppWindowTitle("appWindow", jogetConOpDraw.processName);
  $(".sub-rightclickMenu.active").removeClass("active");
  if (jogetConOpDraw.entity) {
    viewer.entities.remove(jogetConOpDraw.entity);
  }
  jogetConOpDraw.flag = true;
  jqwidgetBox("drawTool", 1);
  $('#ConOpDrawType input[name="ConOpDrawType"]').prop("checked", false);
  showinstruction();
  instructions(
    'Select a shape<br>\
	Click  <img src="Images/icons/instructions/light_color/leftclick.png"> to draw point(s).<br>\
	Click  <img src="Images/icons/instructions/light_color/rightclick.png"> to save.<br>\
	Press  <kbd>Esc</kbd> to Escape.'
  );
}

function OnClickIssueWIR() {
  changePointColour = "colourWIR"
  if (isParent && !constructPackageId) {
    return;
  }
  if (!jogetAppProcesses["app_WIR"]) {
    return;
  }
  jogetProcessApp = "WIR";
  jogetConOpDraw.processName = (localStorage.project_owner == 'JKR_SABAH') ? "Request For Inspection" : "Work Inspection Request";
  // if (localStorage.parent_project_id == 'PBHS'){
  //   jogetConOpDraw.processName = "Request For Information"
  // }
  // else{
  //   jogetConOpDraw.processName = "Work Inspection Request"
  // }
  changeAppWindowTitle("appWindow", jogetConOpDraw.processName);
  $(".sub-rightclickMenu.active").removeClass("active");
  if (jogetConOpDraw.entity) {
    viewer.entities.remove(jogetConOpDraw.entity);
  }
  jogetConOpDraw.flag = true;
  jqwidgetBox("drawTool", 1);
  $('#ConOpDrawType input[name="ConOpDrawType"]').prop("checked", false); //props?
  showinstruction();
  instructions(
    'Select a shape<br>\
	Click  <img src="Images/icons/instructions/light_color/leftclick.png"> to draw point(s).<br>\
	Click  <img src="Images/icons/instructions/light_color/rightclick.png"> to save.<br>\
	Press  <kbd>Esc</kbd> to Escape.'
  );
}

function OnClickIssueDCR() {
  changePointColour = "colourDCR"
  
  if (isParent && !constructPackageId) {
    return;
  }
  if (!jogetAppProcesses["app_DCR"]) {
    return;
  }
  jogetProcessApp = "DCR";
  jogetConOpDraw.processName = "Design Change Request"
  changeAppWindowTitle("appWindow", jogetConOpDraw.processName);
  $(".sub-rightclickMenu.active").removeClass("active");
  if (jogetConOpDraw.entity) {
    viewer.entities.remove(jogetConOpDraw.entity);
  }
  jogetConOpDraw.flag = true;
  jqwidgetBox("drawTool", 1);
  $('#ConOpDrawType input[name="ConOpDrawType"]').prop("checked", false);
  showinstruction();
  instructions(
    'Select a shape<br>\
	Click  <img src="Images/icons/instructions/light_color/leftclick.png"> to draw point(s).<br>\
	Click  <img src="Images/icons/instructions/light_color/rightclick.png"> to save.<br>\
	Press  <kbd>Esc</kbd> to Escape.'
  );
}

function OnClickIssueNOI() {
  changePointColour = "colourNOI"
  
  if (isParent && !constructPackageId) {
    return;
  }
  if (!jogetAppProcesses["app_NOI"]) {
    return;
  }
  jogetProcessApp = "NOI";
  if (localStorage.parent_project_id == 'PBHS'){
    jogetConOpDraw.processName = "Site Memo / Notice Of Improvement"
  }
  else{
    jogetConOpDraw.processName = "Notice Of Improvement"
  }
  jogetConOpDraw.partialPath = "/noi/_/new_noi_process?"
  changeAppWindowTitle("appWindow", jogetConOpDraw.processName);
  $(".sub-rightclickMenu.active").removeClass("active");
  if (jogetConOpDraw.entity) {
    viewer.entities.remove(jogetConOpDraw.entity);
  }
  jogetConOpDraw.flag = true;
  jqwidgetBox("drawTool", 1);
  $('#ConOpDrawType input[name="ConOpDrawType"]').prop("checked", false);
  showinstruction();
  instructions(
    'Select a shape<br>\
	Click  <img src="Images/icons/instructions/light_color/leftclick.png"> to draw point(s).<br>\
	Click  <img src="Images/icons/instructions/light_color/rightclick.png"> to save.<br>\
	Press  <kbd>Esc</kbd> to Escape.'
  );
}

function OnClickIssuePBC() {
  changePointColour = "colourPBC"
  
  if (isParent && !constructPackageId) {
    return;
  }
  if (!jogetAppProcesses["app_PBC"]) {
    return;
  }
  jogetProcessApp = "PBC";
  jogetConOpDraw.processName = "Public Complaint"
  jogetConOpDraw.partialPath = "/pubc/_/new_pubc_process?"
  changeAppWindowTitle("appWindow", jogetConOpDraw.processName);
  $(".sub-rightclickMenu.active").removeClass("active");
  if (jogetConOpDraw.entity) {
    viewer.entities.remove(jogetConOpDraw.entity);
  }
  jogetConOpDraw.flag = true;
  jqwidgetBox("drawTool", 1);
  $('#ConOpDrawType input[name="ConOpDrawType"]').prop("checked", false);
  showinstruction();
  instructions(
    'Select a shape<br>\
	Click  <img src="Images/icons/instructions/light_color/leftclick.png"> to draw point(s).<br>\
	Click  <img src="Images/icons/instructions/light_color/rightclick.png"> to save.<br>\
	Press  <kbd>Esc</kbd> to Escape.'
  );
}


function OnClickIssueMS() {
  changePointColour = "colourMS"
  if (isParent && !constructPackageId) {
    return;
  }
  if (!jogetAppProcesses["app_MS"]) {
    return;
  }
  jogetProcessApp = "MS";
  jogetConOpDraw.processName = (localStorage.project_owner == 'JKR_SABAH') ? "Material Acceptance" : "Material Approval";
  jogetConOpDraw.partialPath = "/ma/_/new_ma?_action=assignmentView&activityId="
  changeAppWindowTitle("appWindow", jogetConOpDraw.processName);
  if (jogetConOpDraw.entity) {
    viewer.entities.remove(jogetConOpDraw.entity);
  }
  jogetConOpDraw.flag = true;
  jqwidgetBox("drawTool", 1);
  $('#ConOpDrawType input[name="ConOpDrawType"]').prop("checked", false);
  showinstruction();
  instructions(
    'Select a shape<br>\
	Click  <img src="Images/icons/instructions/light_color/leftclick.png"> to draw point(s).<br>\
	Click  <img src="Images/icons/instructions/light_color/rightclick.png"> to save.<br>\
	Press  <kbd>Esc</kbd> to Escape.'
  );
}

function OnClickIssueRS() {
  changePointColour = "colourRS"
  if (isParent && !constructPackageId) {
    return;
  }
  if (!jogetAppProcesses["app_RS"]) {
    return;
  }
  jogetProcessApp = "RS";
  jogetConOpDraw.processName = "Report Submission"
  jogetConOpDraw.partialPath = "/rs/_/new_rs?"

  changeAppWindowTitle("appWindow", jogetConOpDraw.processName);
  if (jogetConOpDraw.entity) {
    viewer.entities.remove(jogetConOpDraw.entity);
  }
  jogetConOpDraw.flag = true;
  jqwidgetBox("drawTool", 1);
  $('#ConOpDrawType input[name="ConOpDrawType"]').prop("checked", false);
  showinstruction();
  instructions(
    'Select a shape<br>\
	Click  <img src="Images/icons/instructions/light_color/leftclick.png"> to draw point(s).<br>\
	Click  <img src="Images/icons/instructions/light_color/rightclick.png"> to save.<br>\
	Press  <kbd>Esc</kbd> to Escape.'
  );
}

function OnClickIssueRFI() {
  changePointColour = "colourRFI"
  if (isParent && !constructPackageId) {
    return;
  }
  if (!jogetAppProcesses["app_RFI"]) {
    return;
  }
  jogetProcessApp = "RFI";
  if (localStorage.project_owner == 'JKR_SABAH'){
    jogetConOpDraw.processName = "Request For Information Technical"
  }
  else{
    jogetConOpDraw.processName = "Request For Information"
  }
  jogetConOpDraw.partialPath = "/rfi/_/new_rfi?"
  changeAppWindowTitle("appWindow", jogetConOpDraw.processName);
  if (jogetConOpDraw.entity) {
    viewer.entities.remove(jogetConOpDraw.entity);
  }
  jogetConOpDraw.flag = true;
  jqwidgetBox("drawTool", 1);
  $('#ConOpDrawType input[name="ConOpDrawType"]').prop("checked", false);
  showinstruction();
  instructions(
    'Select a shape<br>\
	Click  <img src="Images/icons/instructions/light_color/leftclick.png"> to draw point(s).<br>\
	Click  <img src="Images/icons/instructions/light_color/rightclick.png"> to save.<br>\
	Press  <kbd>Esc</kbd> to Escape.'
  );
}

function OnClickIssueIR() {
  changePointColour = "colourIR"
  if (isParent && !constructPackageId) {
    return;
  }
  if (!jogetAppProcesses["app_IR"]) {
    return;
  }
  jogetProcessApp = "IR";
  jogetConOpDraw.processName = (localStorage.project_owner == 'JKR_SABAH') ? "Accident/Incident Report" : "Incident";

  changeAppWindowTitle("appWindow", jogetConOpDraw.processName);
  if (jogetConOpDraw.entity) {
    viewer.entities.remove(jogetConOpDraw.entity);
  }
  jogetConOpDraw.flag = true;
  jqwidgetBox("drawTool", 1);
  $('#ConOpDrawType input[name="ConOpDrawType"]').prop("checked", false);
  showinstruction();
  instructions(
    'Select a shape<br>\
	Click  <img src="Images/icons/instructions/light_color/leftclick.png"> to draw point(s).<br>\
	Click  <img src="Images/icons/instructions/light_color/rightclick.png"> to save.<br>\
	Press  <kbd>Esc</kbd> to Escape.'
  );
}

function OnClickManageIR() {
  if (isParent && !constructPackageId) {
    return;
  }
  if (!jogetAppProcesses["app_IR"]) {
    return;
  }
  jogetProcessApp = "IR";
  jogetConOpDraw.processName = (localStorage.project_owner == 'JKR_SABAH') ? "Manage Accident/Incident Report" : "Manage Incident";
  if(localStorage.project_owner == 'JKR_SABAH'){
    jogetConOpDraw.partialPath = "/inc/_/incAction_crudSabah?d-868742-fn_c_package_uuid="+localStorage.p_id+"_"+localStorage.p_id_name+"_"+localStorage.p_id;
  }
  else{
    jogetConOpDraw.partialPath = "/inc/_/incAction_crud?d-7770761-fn_c_package_uuid="+localStorage.p_id+"_"+localStorage.p_id_name+"_"+localStorage.p_id;
  }
  
  let url =
  $jogetHost+"jw/web/embed/userview/" +
  constructPackageId +
  jogetConOpDraw.partialPath;
  // to enable pop-ups
  $("#appWindow iframe").removeAttr('sandbox');
  $("#appWindow iframe")
  .attr("src", url)
  .css("height", "100%")
  .css("width", "100%");
  zoomToGetData();
  changeAppWindowTitle("appWindow", jogetConOpDraw.processName);
  jqwidgetBox("appWindow", 1);
}

function OnClickIssueMOS() {
  changePointColour = "colourMOS"

  if (isParent && !constructPackageId) {
    return;
  }
  if (!jogetAppProcesses["app_MOS"]) {
    return;
  }
  jogetProcessApp = "MOS";
  jogetConOpDraw.processName = "Method Statement"
  jogetConOpDraw.partialPath = "/ms/_/new_ms?_action=assignmentView&activityId="

  jogetProcessApp = "MOS";
  changeAppWindowTitle("appWindow", "Method Statement");
  if (jogetConOpDraw.entity) {
    viewer.entities.remove(jogetConOpDraw.entity);
  }
  jogetConOpDraw.flag = true;
  jqwidgetBox("drawTool", 1);
  $('#ConOpDrawType input[name="ConOpDrawType"]').prop("checked", false);
  showinstruction();
  instructions(
    'Select a shape<br>\
	Click  <img src="Images/icons/instructions/light_color/leftclick.png"> to draw point(s).<br>\
	Click  <img src="Images/icons/instructions/light_color/rightclick.png"> to save.<br>\
	Press  <kbd>Esc</kbd> to Escape.'
  );
}


function OnClickIssueLR() {
  jqwidgetBox("landConfigure", 1);
  
  if (isParent && !constructPackageId) {
    return;
  }
  if (!jogetAppProcesses["app_LR"]) {
    return;
  }

  jogetProcessApp = "LR";
  jogetConOpDraw.processName = "Land Acquisition"
  jogetConOpDraw.partialPath = "/land/_/laForm?_action=assignmentView"

  if (jogetConOpDraw.entity) {
    viewer.entities.remove(jogetConOpDraw.entity);
  }

  $('#landConfigureType input[name="landConfigureType"]').prop("checked", false);
}

function OnClickManageLR() {
  if (isParent && !constructPackageId) {
    return;
  }
  if (!jogetAppProcesses["app_LR"]) {
    return;
  }

  jogetConOpDraw.processName = "Manage Land Acquisition"
  jogetProcessApp = "LR";

  var url;
  if (JOGETLINK['cons_manage_LR']) {
    url  = JOGETLINK['cons_manage_LR'];
  }

  // to enable pop-ups
  $("#appWindow iframe").removeAttr('sandbox');
  $("#appWindow iframe")
    .attr("src", url)
    .css("height", "100%")
    .css("width", "100%");
  changeAppWindowTitle("appWindow", jogetConOpDraw.processName);
  jqwidgetBox("appWindow", 1);
  zoomToGetData();
}

function OnClickIssueLI() {
  jqwidgetBox("landConfigure", 1);
  
  if (isParent && !constructPackageId) {
    return;
  }
  if (!jogetAppProcesses["app_LI"]) {
    return;
  }
  jogetProcessApp = "LI";
  jogetConOpDraw.processName = "Land Issues Registration"
  jogetConOpDraw.partialPath = "/land/_/liForm?_action=assignmentView"

  if (jogetConOpDraw.entity) {
    viewer.entities.remove(jogetConOpDraw.entity);
  }

  $('#landConfigureType input[name="landConfigureType"]').prop("checked", false);

}

function OnClickManageLI() {
  if (isParent && !constructPackageId) {
    return;
  }
  if (!jogetAppProcesses["app_LI"]) {
    return;
  }

  jogetConOpDraw.processName = "Manage Land Issue"
  jogetProcessApp = "LI";

  var url;
  if (JOGETLINK['cons_manage_LI']) {
    url  = JOGETLINK['cons_manage_LI'];
  }

  // to enable pop-ups
  $("#appWindow iframe").removeAttr('sandbox');
  $("#appWindow iframe")
    .attr("src", url)
    .css("height", "100%")
    .css("width", "100%");
  changeAppWindowTitle("appWindow", jogetConOpDraw.processName);
  jqwidgetBox("appWindow", 1);
  zoomToGetData();

}

function OnClickIssueLE() {
  jqwidgetBox("landConfigure", 1);
  
  if (isParent && !constructPackageId) {
    return;
  }
  if (!jogetAppProcesses["app_LE"]) {
    return;
  }
  jogetProcessApp = "LE";
  jogetConOpDraw.processName = "Land Encumbrances Registration"
  jogetConOpDraw.partialPath = "/land/_/leForm?_action=assignmentView"

  if (jogetConOpDraw.entity) {
    viewer.entities.remove(jogetConOpDraw.entity);
  }

  $('#landConfigureType input[name="landConfigureType"]').prop("checked", false);

}

function OnClickManageLE() {
  if (isParent && !constructPackageId) {
    return;
  }
  if (!jogetAppProcesses["app_LE"]) {
    return;
  }

  jogetConOpDraw.processName = "Manage Land Encumbrances"
  jogetProcessApp = "LE";

  var url;
  if (JOGETLINK['cons_manage_LE']) {
    url  = JOGETLINK['cons_manage_LE'];
  }

  // to enable pop-ups
  $("#appWindow iframe").removeAttr('sandbox');
  $("#appWindow iframe")
    .attr("src", url)
    .css("height", "100%")
    .css("width", "100%");
  changeAppWindowTitle("appWindow", jogetConOpDraw.processName);
  jqwidgetBox("appWindow", 1);
  zoomToGetData();

}

function OnClickIssueDA() {
  changePointColour = "colourDA"
  
  if (isParent && !constructPackageId) {
    return;
  }
  if (!jogetAppProcesses["app_DA"]) {
    return;
  }
  jogetProcessApp = "DA";
  jogetConOpDraw.processName = "URW - Approved Design Drawing"
  changeAppWindowTitle("appWindow", jogetConOpDraw.processName);
  $(".sub-rightclickMenu.active").removeClass("active");
  if (jogetConOpDraw.entity) {
    viewer.entities.remove(jogetConOpDraw.entity);
  }
  jogetConOpDraw.flag = true;
  jqwidgetBox("drawTool", 1);
  $('#ConOpDrawType input[name="ConOpDrawType"]').prop("checked", false);
  showinstruction();
  instructions(
    'Select a shape<br>\
      Click  <img src="Images/icons/instructions/light_color/leftclick.png"> to draw point(s).<br>\
      Click  <img src="Images/icons/instructions/light_color/rightclick.png"> to save.<br>\
      Press  <kbd>Esc</kbd> to Escape.'
  );
}

function OnClickLink(ele){
  var process = $(ele).attr('id');

  if (isParent && !constructPackageId) {
    return;
  }
  if (!jogetAppProcesses["app_" + process]) {
    return;
  }

  switch (process) {
    case 'LR':
      jogetProcessApp = "LR";
      jogetConOpDraw.processName = "Link Land Acquisition"
      break;
    case 'LI':
      jogetProcessApp = "LI";
      jogetConOpDraw.processName = "Link Land Issues"
      break;
    case 'LE':
      jogetProcessApp = "LE";
      jogetConOpDraw.processName = "Link Land Encumbrances"
      break;
  }

  if (jogetConOpDraw.entity) {
    viewer.entities.remove(jogetConOpDraw.entity);
  }

  flagLandBoth = true;
  flagLinkLand = true;
  showinstruction();
  instructions(
      'Select lot for link<br>\
      Click  <img src="Images/icons/instructions/light_color/leftclick.png"> to lot parcel.<br>\
      Click  <img src="Images/icons/instructions/light_color/rightclick.png"> to link the lot.<br>\
      Press  <kbd>Esc</kbd> to Escape.'
  );

  jogetConOpDraw.flag = true;
}