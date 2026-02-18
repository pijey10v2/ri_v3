function OnLoadProjectWise365DetailsSave() {
    //#webserviceID
    console.log("PW365IN-dhmasuk");

    $.ajax({
        type: "GET",
        url: 'backend/getConfigDetailsP365.php',
        dataType: 'json',
        success: function (obj, textstatus) {
            console.log("PW365-lepasjsonencode");
            console.log(obj.pwid);
            document.getElementById("projectwise365url").innerHTML = obj.pwid;
            document.getElementById("p365URL").value = obj.pwid;
        },
        error: function (xhr, textStatus, errorThrown) {
            var str = textStatus + " " + errorThrown;
            console.log(str);
        }
    });

}
OnLoadProjectWise365DetailsSave();
