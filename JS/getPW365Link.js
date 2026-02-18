function OnLoadProjectWise365Link() {
    //#webserviceID

    $.ajax({
        type: "GET",
        url: 'backend/getPW365Link.php',
        dataType: 'json',
        success: function (obj, textstatus) {
            console.log("pwLink-lepasjsonencode");
            // console.log(obj.pwLink);
            let existing_link = document.getElementById("sideBarButtonLink").innerHTML;
            // console.log(existing_link+obj.pwLink); 
            document.getElementById("sideBarButtonLink").innerHTML = existing_link + obj.pwLink;
        },
        error: function (xhr, textStatus, errorThrown) {
            var str = textStatus + " " + errorThrown;
            console.log(str);
        }
    });

}
OnLoadProjectWise365Link();
