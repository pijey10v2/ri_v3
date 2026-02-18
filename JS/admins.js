function searchForName(ele) {
    var input, filter, table, tr, td, i, txtValue;
    input = ele;
    filter = input.value.toUpperCase();
    table_id = $(ele).attr("rel");
    table = document.getElementById(table_id);
    table_rel = $("#" + table_id).attr("rel");
    table_rel = Number(table_rel);
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[table_rel];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

function searchForName2(ele) {
    var input, filter, table, tr, td, i, txtValue;
    input = ele;
    filter = input.value.toUpperCase();
    table_id = $(ele).attr("rel");
    table = document.getElementById(table_id);
    table_rel = $("#" + table_id).attr("rel2");
    table_rel = Number(table_rel);
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[table_rel];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

//change project icon in edit project
$("#imgInp").change(function () {
    imginp = document.getElementById("imgInp");
    var pro_Inp = imginp.files[0];
    //filter extension
    var reg = /(.*?)\.(png|bmp|jpeg|jpg)$/;
    if (!pro_Inp.name.toLowerCase().match(reg)) {
        $.alert({
            boxWidth: "30%",
            useBootstrap: false,
            title: "Message",
            content: "Input file format is not supported!",
        });
        imginp.value = "";
        $("#projectimage").attr("src", "");
        return;
    }
    //limit file size to 1mb
    if (pro_Inp.size > 1024000) {
        $.alert({
            boxWidth: "30%",
            useBootstrap: false,
            title: "Message",
            content: "Maximum file size supported is 1MB!",
        });
        imginp.value = "";
        $("#projectimage").attr("src", "");
        return;
    }
    readURL(imginp);
});

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $("#projectimage").attr("src", e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        $("#projectimage").attr("src", "");
    }
}