
// THIS IS A NEW SUPPORT REQUEST WITH NO LOGIN
var JOGETDOMAIN = "https://joget.reveronconsulting.com/jw";
var JOGETIP = "http://52.163.242.240:8080/jw";
var JOGETHOST = (window.location.protocol == 'https:') ? JOGETDOMAIN : JOGETIP;

var userviewJoget = JOGETHOST + "/web/embed/userview/RV_AMS/";

var WEBNEWSERVICEREQUEST = userviewJoget + "RV_AMS/_/new_serviceRequest_web?";
var WEBNEWSERVICEREQUEST_ASSIGNMNT = userviewJoget + "RV_AMS/_/serviceRequest_inbox?";

var loading = $('#loadingContainer_dashboard');

openWebForm = (type, activityId) =>{
    var new_web_request_url = "";

    if(type == 'web_request'){
        if(WEBNEWSERVICEREQUEST_ASSIGNMNT){
            new_web_request_url = WEBNEWSERVICEREQUEST_ASSIGNMNT + 'activityId=' + activityId + '&_mode=assignment';
        }
    }else{
        if(WEBNEWSERVICEREQUEST){
            new_web_request_url = WEBNEWSERVICEREQUEST;
        }
    }

    $("iframe#viewJogetWebSubmitForm")
        .attr("src", new_web_request_url)
        .css("height", "98%")
        .css("width", "98%");

    $("iframe#viewJogetWebSubmitForm").on('load', function(){
        loading.fadeOut()
    })

    return;
}

$(document).ready(function(){ 
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let dirParam = urlParams.get("dir") ? urlParams.get("dir") : ""
    let activityId = urlParams.get("activity_id") ? urlParams.get("activity_id") : ""
    console.log(urlParams);

    openWebForm(dirParam, activityId);
});