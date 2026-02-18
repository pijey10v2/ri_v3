var $jogetHost = JOGETHOST;
// form view = UserviewID + "_" + formID in the userview
function OnClickIssueSD() {
  changePointColour = "colourSD"

  if (isParent || !constructPackageId) {
    console.error("Not an package project or doesn't contain package Id")
    return;
  }
  if (!jogetAppProcesses["app_SD"]) {
    console.error("Process isn't registered")
    return;
  }

  if(localStorage.project_owner == 'JKR_SABAH'){
    jogetConOpDraw.processName = "Site Instruction";
  }else{
    jogetConOpDraw.processName = "Site Direction";
  }

  jogetProcessApp = "SD";
  InitiateCoordless(jogetProcessApp);
}

function OnClickIssueLS() {
  if (isParent || !constructPackageId) {
    console.error("Not an package project or doesn't contain package Id")
    return;
  }
  if (!jogetAppProcesses["app_LS"]) {
    console.error("Process isn't registered")
    return;
  }

  jogetConOpDraw.processName = "Land Summary"
  jogetProcessApp = "LS";

  var url;
  if (JOGETLINK['cons_issue_'+jogetProcessApp]) {
    url  = JOGETLINK['cons_issue_'+jogetProcessApp];
  }

  $("#appWindow iframe")
  .attr("src", url)
  .css("height", "100%")
  .css("width", "100%");
  changeAppWindowTitle("appWindow", jogetConOpDraw.processName);
  jqwidgetBox("appWindow", 1);
}

function OnClickManageLS() {
  if (isParent && !constructPackageId) {
    return;
  }
  if (!jogetAppProcesses["app_LS"]) {
    return;
  }

  jogetConOpDraw.processName = "Manage Land Summary"
  jogetProcessApp = "LS";

  var url;
  if (JOGETLINK['cons_manage_LS']) {
    url  = JOGETLINK['cons_manage_LS'];
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

function OnClickIssueSDL() {
  changePointColour = "colourSDL"

  if (isParent || !constructPackageId) {
    console.error("Not an package project or doesn't contain package Id")
    return;
  }
  if (!jogetAppProcesses["app_SDL"]) {
    console.error("Process isn't registered")
    return;
  }
  jogetConOpDraw.processName = "Site Daily Log"
  jogetProcessApp = "SDL";
  InitiateCoordless(jogetProcessApp);
}

function OnClickManageMachineryList() {
  changePointColour = "colourSDL"

  if (isParent || !constructPackageId) {
    console.error("Not an package project or doesn't contain package Id")
    return;
  }
  if (!jogetAppProcesses["app_SDL"]) {
    console.error("Process isn't registered")
    return;
  }
  jogetConOpDraw.processName = "SDL - Machinery Setup"
  jogetProcessApp = "SDL";
 
  var url;
  if (JOGETLINK['cons_issue_SDL_Machinery_Setup']) {
    url  = JOGETLINK['cons_issue_SDL_Machinery_Setup'];
  }
  // to enable pop-ups
  $("#appWindow iframe").removeAttr('sandbox');
  $("#appWindow iframe")
  .attr("src", url)
  .css("height", "100%")
  .css("width", "100%");
  changeAppWindowTitle("appWindow", jogetConOpDraw.processName);
  jqwidgetBox("appWindow", 1);  
}

function OnClickManageDA() {
  changePointColour = "colourDA"

  if (isParent || !constructPackageId) {
    console.error("Not an package project or doesn't contain package Id")
    return;
  }
  if (!jogetAppProcesses["app_DA"]) {
    console.error("Process isn't registered")
    return;
  }
  jogetConOpDraw.processName = "Manage URW - Approved Design Drawing"
  jogetProcessApp = "DA";
 
  var url;
  if (JOGETLINK['cons_manage_DA']) {
    url  = JOGETLINK['cons_manage_DA'];
  }
  // to enable pop-ups
  $("#appWindow iframe").removeAttr('sandbox');
  $("#appWindow iframe")
  .attr("src", url)
  .css("height", "100%")
  .css("width", "100%");
  changeAppWindowTitle("appWindow", jogetConOpDraw.processName);
  jqwidgetBox("appWindow", 1);  
}

function OnClickIssueManageManpowerList() {
  changePointColour = "colourSDL"

  if (isParent || !constructPackageId) {
    console.error("Not an package project or doesn't contain package Id")
    return;
  }
  if (!jogetAppProcesses["app_SDL"]) {
    console.error("Process isn't registered")
    return;
  }
  jogetConOpDraw.processName = "SDL - Manpower Setup"
  jogetProcessApp = "SDL";
 
  var url;
  if (JOGETLINK['cons_issue_SDL_Manpower_Setup']) {
    url  = JOGETLINK['cons_issue_SDL_Manpower_Setup'];
  }
  // to enable pop-ups
  $("#appWindow iframe").removeAttr('sandbox');
  $("#appWindow iframe")
  .attr("src", url)
  .css("height", "100%")
  .css("width", "100%");
  changeAppWindowTitle("appWindow", jogetConOpDraw.processName);
  jqwidgetBox("appWindow", 1);  
}

function OnClickIssueSA(){
  if (isParent || !constructPackageId) {
    console.error("Not an package project or doesn't contain package Id")
    return;
  }
    
  if (!jogetAppProcesses["app_SA"]) {
    console.error("Process isn't registered")
    return;
  }

  if(localStorage.project_owner == 'JKR_SABAH'){
    jogetConOpDraw.processName = "Safety Activity And Response"
  }else{
    jogetConOpDraw.processName = "Safety Activity"
  }
  jogetProcessApp = "SA";

  var url;
  if (JOGETLINK['cons_issue_'+jogetProcessApp]) {
    url  = JOGETLINK['cons_issue_'+jogetProcessApp];
  }

  $("#appWindow iframe")
  .attr("src", url)
  .css("height", "100%")
  .css("width", "100%");
  changeAppWindowTitle("appWindow", jogetConOpDraw.processName); //#titleMod after ncr true
  jqwidgetBox("appWindow", 1);
}

function OnClickIssueSA_Bulk(){
  if (isParent || !constructPackageId) {
    console.error("Not an package project or doesn't contain package Id")
    return;
  }
  if (!jogetAppProcesses["app_SA"]) {
    console.error("Process isn't registered")
    return;
  }

  if(localStorage.parent_project_id == "PBHS"){
    jogetConOpDraw.processName = "Safety Activity and Response"
  }else{
    jogetConOpDraw.processName = "Safety Activity"
  }
  
  jogetProcessApp = "SA";

  var url;
  if (JOGETLINK['cons_issue_SA_BULK']) {
    url  = JOGETLINK['cons_issue_SA_BULK'];
  }

  $("#appWindow iframe")
  .attr("src", url)
  .css("height", "100%")
  .css("width", "100%");
  changeAppWindowTitle("appWindow", jogetConOpDraw.processName); //#titleMod after ncr true
  jqwidgetBox("appWindow", 1);
}

function OnClickIssueSMH(){
  if (isParent || !constructPackageId) {
    console.error("Not an package project or doesn't contain package Id")
    return;
  }
  if (!jogetAppProcesses["app_SMH"]) {
    console.error("Process isn't registered")
    return;
  }

  jogetConOpDraw.processName = "Total Man-Hours"
  jogetProcessApp = "SMH";

  var url;
  if (JOGETLINK['cons_issue_SMH']) {
    url  = JOGETLINK['cons_issue_SMH'];
  }

  $("#appWindow iframe")
  .attr("src", url)
  .css("height", "100%")
  .css("width", "100%");
  changeAppWindowTitle("appWindow", jogetConOpDraw.processName); //#titleMod after ncr true
  jqwidgetBox("appWindow", 1);
}

function OnClickIssueSMH_Bulk(){
  if (isParent || !constructPackageId) {
    console.error("Not an package project or doesn't contain package Id")
    return;
  }
  if (!jogetAppProcesses["app_SMH"]) {
    console.error("Process isn't registered")
    return;
  }

  jogetConOpDraw.processName = "Total Man-Hours"
  jogetProcessApp = "SMH";

  var url;
  if (JOGETLINK['cons_issue_SMH_BULK']) {
    url  = JOGETLINK['cons_issue_SMH_BULK'];
  }

  $("#appWindow iframe")
  .attr("src", url)
  .css("height", "100%")
  .css("width", "100%");
  changeAppWindowTitle("appWindow", jogetConOpDraw.processName); //#titleMod after ncr true
  jqwidgetBox("appWindow", 1);
}

function OnClickIssueRRClose(){
  if (isParent || !constructPackageId) {
    console.error("Not an package project or doesn't contain package Id")
    return;
  }
  if (!jogetAppProcesses["app_RR"]) {
    console.error("Process isn't registered")
    return;
  }

  jogetConOpDraw.processName = "Manage Risk Register"
  jogetProcessApp = "RR";

  var url;
  if (JOGETLINK['cons_issue_RR_CLOSE']) {
    url  = JOGETLINK['cons_issue_RR_CLOSE'];
  }
  // to enable pop-ups
  $("#appWindow iframe").removeAttr('sandbox');
  $("#appWindow iframe")
  .attr("src", url)
  .css("height", "100%")
  .css("width", "100%");
  changeAppWindowTitle("appWindow", jogetConOpDraw.processName);
  jqwidgetBox("appWindow", 1);  
}

function OnClickSDLSectionUserSetup(){
  if (isParent || !constructPackageId) {
    console.error("Not an package project or doesn't contain package Id")
    return;
  }

  var url = (JOGETLINK['cons_issue_sdl_user_section_setup']) ? JOGETLINK['cons_issue_sdl_user_section_setup'] : '';

  // to enable pop-ups
  $("#appWindow iframe").removeAttr('sandbox');
  $("#appWindow iframe")
  .attr("src", url)
  .css("height", "100%")
  .css("width", "100%");
  changeAppWindowTitle("appWindow", 'Assign User to Section Setup');
  jqwidgetBox("appWindow", 1);  
}

function OnClickRiskCategorySetup(){
  if (isParent || !constructPackageId) {
    console.error("Not an package project or doesn't contain package Id")
    return;
  }
  if (!jogetAppProcesses["app_RR"]) {
    console.error("Process isn't registered")
    return;
  }

  jogetConOpDraw.processName = "Risk Category Setup"
  jogetProcessApp = "RR";

  var url;
  if (JOGETLINK['cons_issue_RR_Category_Setup']) {
    url  = JOGETLINK['cons_issue_RR_Category_Setup'];
  }
  // to enable pop-ups
  $("#appWindow iframe").removeAttr('sandbox');
  $("#appWindow iframe")
  .attr("src", url)
  .css("height", "100%")
  .css("width", "100%");
  changeAppWindowTitle("appWindow", jogetConOpDraw.processName);
  jqwidgetBox("appWindow", 1);  
}

function OnClickRiskSubCategorySetup(){
  if (isParent || !constructPackageId) {
    console.error("Not an package project or doesn't contain package Id")
    return;
  }
  if (!jogetAppProcesses["app_RR"]) {
    console.error("Process isn't registered")
    return;
  }

  jogetConOpDraw.processName = "Risk Sub-Category Setup"
  jogetProcessApp = "RR";

  var url;
  if (JOGETLINK['cons_issue_RR_Sub_Category_Setup']) {
    url  = JOGETLINK['cons_issue_RR_Sub_Category_Setup'];
  }
  // to enable pop-ups
  $("#appWindow iframe").removeAttr('sandbox');
  $("#appWindow iframe")
  .attr("src", url)
  .css("height", "100%")
  .css("width", "100%");
  changeAppWindowTitle("appWindow", jogetConOpDraw.processName);
  jqwidgetBox("appWindow", 1);  
}

function OnClickWorkDisciplineSetup(){
  if (isParent || !constructPackageId) {
    console.error("Not an package project or doesn't contain package Id")
    return;
  }
  if (!jogetAppProcesses["app_NOI"]) {
    console.error("Process isn't registered")
    return;
  }

  jogetConOpDraw.processName = "Work Discipline Setup"
  jogetProcessApp = "NOI";

  var url;
  if (JOGETLINK['cons_issue_NOI_WD_Setup']) {
    url  = JOGETLINK['cons_issue_NOI_WD_Setup'];
  }
  // to enable pop-ups
  $("#appWindow iframe").removeAttr('sandbox');
  $("#appWindow iframe")
  .attr("src", url)
  .css("height", "100%")
  .css("width", "100%");
  changeAppWindowTitle("appWindow", jogetConOpDraw.processName);
  jqwidgetBox("appWindow", 1);  
}

function OnClickRiskDescriptionSetup(){
  if (isParent || !constructPackageId) {
    console.error("Not an package project or doesn't contain package Id")
    return;
  }
  if (!jogetAppProcesses["app_RR"]) {
    console.error("Process isn't registered")
    return;
  }

  jogetConOpDraw.processName = "Risk Description Setup"
  jogetProcessApp = "RR";

  var url;
  if (JOGETLINK['cons_issue_RR_Description_Setup']) {
    url  = JOGETLINK['cons_issue_RR_Description_Setup'];
  }
  // to enable pop-ups
  $("#appWindow iframe").removeAttr('sandbox');
  $("#appWindow iframe")
  .attr("src", url)
  .css("height", "100%")
  .css("width", "100%");
  changeAppWindowTitle("appWindow", jogetConOpDraw.processName);
  jqwidgetBox("appWindow", 1);  
}

function OnClickIssueRR(){
  if (isParent || !constructPackageId) {
    console.error("Not an package project or doesn't contain package Id")
    return;
  }
  if (!jogetAppProcesses["app_RR"]) {
    console.error("Process isn't registered")
    return;
  }
  
  jogetConOpDraw.processName = "Risk Register"
  jogetProcessApp = "RR";
  InitiateCoordless(jogetProcessApp);
}

function OnClickRegisterBumi(){
  if (!isParent || !constructPackageId) {
    console.error("Not an overall project or doesn't contain package")
    return;
  }
  //prompt list of packages under this project
  $.ajax({
    type: "POST",
    dataType: "JSON",
    url: "BackEnd/ProjectFunctions.php",
    data:{ functionName: 'getProjectPackages' },
    success: ((resp)=>{
      console.log(resp)
      var html = ` <option value="" disabled selected>Please select ...</option>`;
      resp.forEach((package)=>{
        html +=  `<option data-wpc_id = "${package.wpc_id}" data-package_uuid = "${package.package_uuid_bumi}" value="${package.pid}">${package.pname}</option>`
      })
      //Hazirah to change the appWindow
      $("#packageSelection").html(html) 
      jqwidgetBox("bumiParticipant-packageList", 1); 

    })
  })

}

function BumiRegistrationForm(){
  if (!isParent || !constructPackageId) {
    console.error("Not an overall project or doesn't contain package")
    return;
  }

  if(!$("#packageSelection :selected").val()){
    $.alert({
      boxWidth: "30%",
      useBootstrap: false,
      title: "Missing value",
      content: "Please select a pacakge to be associated with.",
    });
    return
  }
  //apply for all overall project, not need to check if proecss is registered
  jogetProcessApp = "BR";

  var coordinateString = jogetConOpDraw.coordsArray.toString()

  //Issuing New BP
  $("#appWindow iframe").unbind("load");
  let url = JOGETLINK['cons_issue_BP'] + "&package_uuid=" + $("#packageSelection :selected").data('package_uuid') + "&wpc=" + $("#packageSelection :selected").data('wpc_id')
    + "&coordinates=" + coordinateString+ "&kmlFileName=" + jogetConOpDraw.fileName + "&entityId=" + jogetConOpDraw.WPCId 
    + "&packageId=" + $("#packageSelection :selected").val()

  $("#appWindow iframe")
    .attr("src", url)
    .css("height", "100%")
    .css("width", "100%");
  changeAppWindowTitle("appWindow", "Bumi Participant Registration"); //For app windows name
  jqwidgetBox("bumiParticipant-packageList", false); 
  jqwidgetBox("appWindow", 1);

}

function OnClickGetBumiRecord(){
  var datalistLink = "";

  $("#page9 tbody").html("")
  if (localStorage.project_owner == 'JKR_SABAH'){
    datalistLink = $jogetHost+"jw/web/embed/userview/ri_construct/bp/_/bpAction_crudSabah?_mode=edit&id="
  }
  else{
    datalistLink = $jogetHost+"jw/web/embed/userview/ri_construct/bp/_/bpAction_crud?_mode=edit&id="
  }
  
  $.ajax({
    type: "POST",
    url: "backend/jogetConstruct.php",
    dataType: "json",
    data: {
      functionName: "getBumiRecord",
      fileName: jogetConOpDraw.fileName,
      WPCNo: jogetConOpDraw.WPCId
    },
    success: function (obj) {
      if(obj.data.length > 0){
        var tableContent = ""
        obj.data.forEach((item) => {
          tableContent += "<tr>"
          tableContent += `<td>${item.c_category}</td>`
          tableContent += `<td>${item.c_consortium}</td>`
          tableContent += `<td>${item.c_scope_of_work}</td>`
          tableContent += `<td>${item.c_contract_value}</td>`
          tableContent += `<td>${item.c_type}</td>`
          tableContent += `<td><a style='color:blue' onClick='OnClickOpenBumiIframe("`+datalistLink+`${item.id}")'>View</a></td>`
          tableContent += "</tr>"
        })
        $("#tab9").show();
        $("#page9 tbody").html(tableContent)
      }
    },
  });
}

function OnClickOpenBumiIframe(src){
  event.preventDefault()
  $("#bumiParticipant iframe")
  .attr("src",src)
  .css("height", "100%")
	.css("width", "100%")
	.css("border", "none")
  jqwidgetBox("bumiParticipant", 1)
}

function OnClickIssueSMH_Manage(){
  if (isParent || !constructPackageId) {
    console.error("Not an package project or doesn't contain package Id")
    return;
  }
  if (!jogetAppProcesses["app_SMH"]) {
    console.error("Process isn't registered")
    return;
  }

  jogetConOpDraw.processName = "Manage Total Man-Hours";
  jogetProcessApp = "SMH";

  var url;
  if (JOGETLINK['cons_manage_SMH']) {
    url  = JOGETLINK['cons_manage_SMH'];
  }
  // to enable pop-ups
  $("#appWindow iframe").removeAttr('sandbox');
  $("#appWindow iframe")
  .attr("src", url)
  .css("height", "100%")
  .css("width", "100%");
  changeAppWindowTitle("appWindow", jogetConOpDraw.processName);
  jqwidgetBox("appWindow", 1);  
}

function OnClickIssueSA_Manage(){
  if (isParent || !constructPackageId) {
    console.error("Not an package project or doesn't contain package Id")
    return;
  }
  if (!jogetAppProcesses["app_SA"]) {
    console.error("Process isn't registered")
    return;
  }

  if(localStorage.project_owner == 'JKR_SABAH'){
    jogetConOpDraw.processName = "Manage Safety Activity And Respond";
  }else{
    jogetConOpDraw.processName = "Manage Safety Activity";
  }
  jogetProcessApp = "SA";

  var url;
  if (JOGETLINK['cons_manage_'+jogetProcessApp]) {
    url  = JOGETLINK['cons_manage_'+jogetProcessApp];
  }
  // to enable pop-ups
  $("#appWindow iframe").removeAttr('sandbox');
  $("#appWindow iframe")
  .attr("src", url)
  .css("height", "100%")
  .css("width", "100%");
  changeAppWindowTitle("appWindow", jogetConOpDraw.processName);
  jqwidgetBox("appWindow", 1);  
}

function OnClickIssueRSDL(){
  if (isParent || !constructPackageId) {
    console.error("Not an package project or doesn't contain package Id")
    return;
  }
  if (!jogetAppProcesses["app_RSDL"]) {
    console.error("Process isn't registered")
    return;
  }
  
  jogetConOpDraw.processName = "RET's Site Diary Log (RSDL)"
  jogetProcessApp = "RSDL";
  InitiateCoordless(jogetProcessApp);
}

function OnClickIssuePU(){
  if (isParent || !constructPackageId) {
    console.error("Not an package project or doesn't contain package Id")
    return;
  }
  if (!jogetAppProcesses["app_PU"]) {
    console.error("Process isn't registered")
    return;
  }
  
  jogetConOpDraw.processName = "URW - Progress Update"
  jogetProcessApp = "PU";
  InitiateCoordless(jogetProcessApp);
}

function OnClickManagePU(){
  if (isParent || !constructPackageId) {
    console.error("Not an package project or doesn't contain package Id")
    return;
  }
  if (!jogetAppProcesses["app_PU"]) {
    console.error("Process isn't registered")
    return;
  }
  
  jogetConOpDraw.processName = "Manage URW - Progress Update"
  jogetProcessApp = "PU";
  
  var url;
  if (JOGETLINK['cons_manage_'+jogetProcessApp]) {
    url  = JOGETLINK['cons_manage_'+jogetProcessApp];
  }
  // to enable pop-ups
  $("#appWindow iframe").removeAttr('sandbox');
  $("#appWindow iframe")
  .attr("src", url)
  .css("height", "100%")
  .css("width", "100%");
  changeAppWindowTitle("appWindow", jogetConOpDraw.processName);
  jqwidgetBox("appWindow", 1);  
}

function InitiateCoordless(jogetProcessApp) {
  var url;
  if (JOGETLINK['cons_issue_'+jogetProcessApp]) {
    url  = JOGETLINK['cons_issue_'+jogetProcessApp];
  }
  $("#appWindow iframe")
    .attr("src", url)
    .css("height", "100%")
    .css("width", "100%");
  changeAppWindowTitle("appWindow", jogetConOpDraw.processName);
  jqwidgetBox("appWindow", 1);
}

function OnClickDistricSetup() {
  jogetConOpDraw.processName = "District Setup"

  var url;
  if (JOGETLINK['cons_issue_District_Setup']) {
    url  = JOGETLINK['cons_issue_District_Setup'];
  }
  // to enable pop-ups
  $("#appWindow iframe").removeAttr('sandbox');
  $("#appWindow iframe")
  .attr("src", url)
  .css("height", "100%")
  .css("width", "100%");
  changeAppWindowTitle("appWindow", jogetConOpDraw.processName);
  jqwidgetBox("appWindow", 1);  
}