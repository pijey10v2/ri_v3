var selectedSchedule; //schedule id
var scheduleObj;
var taskTreeFlag = false; // global variable to check if the jstree is created or not

function prePrendUrl(){
    var prePendUrl = '../Backend/';
    return prePendUrl;
}

function prependUrlIframe(){
    var prePendUrl = 'Backend/';
    return prePendUrl;
}

function saveActualValue(){
    var formdata = new FormData();
    var actualValueFormData = [];
    
    let physicalActualVal = $("#physicalActualValue").val()
    let financialActualVal = $("#financialActualValue").val()
    $("#physicalActTb").html("<b>overall:</b> "+ physicalActualVal +"<br>") 
    $("#financialActTb").html("<b>overall:</b> "+ financialActualVal +"<br>") 

    let scheduleStartDate = $(scheduleObj).attr("dataStart")
    let startDate = new Date(scheduleStartDate)
    offset = startDate.getTimezoneOffset();
    startDate = new Date(startDate.getTime() - (offset * 60 * 1000));
    startDate = startDate.toISOString().slice(0, 10)

    let scheduleType;
    switch ($("#scheduleType option:selected").html()) {
        case 'Weekly':
            scheduleType = 0;
            break;
        case 'Monthly':
            scheduleType = 1;
            break;
        case 'Quarterly':
            scheduleType = 2;
            break;
    }
    formdata.append('scheduleStart', startDate);
    formdata.append('scheduleType', scheduleType);

    // overall
    formdata.append('physicalActualVal', physicalActualVal);
    formdata.append('financialActualVal', financialActualVal);
    // by section
    $('.sectionActualFinVal').each(function(idx, ele){
        var section = $(ele).data('section');
        var value = $(ele).val();
        formdata.append('sectionFinActVal['+section+']', value);
    })
    $('.sectionActualPhyVal').each(function(idx, ele){
        var section = $(ele).data('section');
        var value = $(ele).val();
        formdata.append('sectionPhyActVal['+section+']', value);
    })

    $.ajax({
        type: "POST",
        url: prePrendUrl() + 'updateActualFinPhy.php',
        dataType: 'json',
        data: formdata,
        processData: false,
        contentType: false,
        success: function (obj, textstatus) {
            $.alert({
                boxWidth: '30%',
                useBootstrap: false,
                title: (obj.bool) ? 'Success' : 'Error',
                content: obj.msg
            });
            $("#addactualcancel").trigger("click");
        },
        error: function (xhr, textStatus, errorThrown) {
            var str = textStatus + " " + errorThrown;
            console.log(str);
        }
    })
}

function scheduleList() {
    if (!$("#scheduleDIV").hasClass('active')) {
        $("#scheduleType").fadeOut(50, function () {
            $("#scheduleDIV").animate({
                width: 'toggle'
            }, 100)
            $("#scheduleDIV").addClass("active")
            $(".rightbar").animate({
                width: '100%'
            }, 100)
        })
        $.ajax({
            url: prePrendUrl() + 'getSchedule.php',
            type: "GET",
            dataType: 'json',
            success: function (response) {
                $('#scheduleList').html("")
                for (var i = 0; i < response.data.length; i++) {
                    let obj = response.data[i]
                    if (obj.Upload_Date != null) {
                        objDate = new Date(obj.Upload_Date.date)
                        let date = objDate.getDate();
                        let year = objDate.getFullYear();
                        let month = objDate.getMonth() + 1;
                        upload_date = date + "/" + month + "/" + year
                    }

                    $('#scheduleList').append("<li value='" + obj.URL + "' onclick ='viewSchedule(this)'>" + obj.Name + " v" + obj.Sch_Ver + "&nbsp;(" + upload_date + ")</li>")
                };
            }
        });
    } else {
        $("#scheduleDIV").animate({
            width: 'toggle'
        }, 100, function () {
            $("#scheduleType").fadeIn(50)
        })
        $(".rightbar").animate({
            width: '80%'
        }, 100)
        $("#scheduleDIV").removeClass("active")
    }
}

function changeSchedule() {
    $("#scheduleOwner").text("")
    $("#scheduleUploadedDate").text("")
    $('#scheduleRevision').text("")
    $("#scheduleName").text("")
    $("#revisionList").html("")
    $("#scheduleListing li.active").removeClass("active")
    $('#ganttView').contents().find("#gdiv").html("");
    var prefix;
    let fullDate1
    let fullDate2
    let year1
    let year2
    let month1
    let month2
    let day1
    $("#scheduleMessage").hide();
    $("#ganttView").show()
    if (localStorage.start_date == undefined) {
        $(".noProjectDate").show();
        console.log("Project date is not defined");
        return
    }
    var parts = localStorage.start_date.split("/");
    fullDate1 = new Date(parts[2], parts[1] - 1, parts[0]);
    var parts1 = localStorage.end_date.split("/");
    fullDate2 = new Date(parts1[2], parts1[1] - 1, parts1[0]);
    day1 = fullDate1.getDay();
    let selectedType = $("#scheduleType option:selected")

    if(localStorage.page_pageOpen == "myInsights"){
        prefix = "../";
    }else{
        prefix = "";
    }
    $(".loader").fadeIn();
    switch ($(selectedType).html()) {
        case "Weekly":
            $("#scheduleListing").html("");
            var daystoadd = 0;
            var daystominus = 0;
            switch (day1) {
                case 0: //Sunday
                    daystoadd = 1;
                    break;
                case 1: //Monday
                    daystoadd = 7;
                    break;
                case 2: //Tuesday
                    daystoadd = 6;
                    break;
                case 3: //Wednesday
                    daystoadd = 5;
                    break;
                case 4: //Thursday
                    daystoadd = 4;
                    break;
                case 5: //Friday
                    daystoadd = 3;
                    break;
                case 6: //Saturday
                    daystoadd = 2;
                    break;
            };

            switch (day1) {
                case 0: //Sunday
                    daystominus = 6;
                    break;
                case 1: //Monday
                    daystominus = 0;
                    break;
                case 2: //Tuesday
                    daystominus = 1;
                    break;
                case 3: //Wednesday
                    daystominus = 2;
                    break;
                case 4: //Thursday
                    daystominus = 3;
                    break;
                case 5: //Friday
                    daystominus = 4;
                    break;
                case 6: //Saturday
                    daystominus = 5;
                    break;
            };

            let timeinms = 1000 * 24 * 60 * 60;
            var startweekdate = new Date(fullDate1.getTime() - daystominus * timeinms);
            var endweekdate = new Date(fullDate1.getTime() + daystoadd * timeinms);
            let weekISO = fullDate1.toISOString()
            let dataStart = startweekdate.toISOString()
            let i = 1;
            let res = dataStart.split(":")
            let weekID = res[0]
            let endweekISO = endweekdate.toISOString()

            let wklabel = "WK" + i + " " + new Intl.DateTimeFormat('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            }).format(fullDate1)
            $("#scheduleListing").append("<li id='sch_" + weekID + "' onclick='getScheduleInfo(this)' dataStart='" + dataStart + "' data='" + endweekISO + "'><div class='status nofile'></div><div class='revision'></div><a>" + wklabel + "</a></li>")
            while (endweekdate <= fullDate2) {
                startweekID = new Date(endweekdate.getTime() - timeinms);
                startweekdate = new Date(endweekdate.getTime());
                endweekdate = new Date(endweekdate.getTime() + 7 * timeinms);
                weekISO = startweekdate.toISOString()
                endweekISO = endweekdate.toISOString()
                res = startweekID.toISOString().split(":")
                weekID = res[0]
                i++;
                wklabel = "WK" + i + " " + new Intl.DateTimeFormat('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                }).format(startweekdate)
                $("#scheduleListing").append("<li id='sch_" + weekID + "' onclick='getScheduleInfo(this)' dataStart='" + weekISO + "' data='" + endweekISO + "'><div class='status nofile'></div><div class='revision'></div><a>" + wklabel + "</a></li>")
            }

            $.ajax({
                url: prePrendUrl() + 'getSchedule.php',
                type: "POST",
                dataType: 'json',
                data: {
                    schedule_Type: "0"
                }, //weekly
                success: function (response) {
                    // clear and populate section info
                    var sectionPhyHTML = "";
                    var sectionFinHTML = "";
                    if (response.section) {
                        for (var i = 0; i < response.section.length; i = i + 2) {
                            sectionPhyHTML +='<div class="doubleinput">';
                            sectionPhyHTML += '<div class="column1">' +
                                        '<Label>'+response.section[i]+' (%)</Label><br>' +
                                        '<input type="number" class = "sectionActualPhyVal" data-section="'+response.section[i]+'">' +
                                    '</div>';
                            if (response.section[i+1]) {
                                sectionPhyHTML += '<div class="column2">' +
                                    '<Label>'+response.section[i+1]+' (%)</Label><br>' +
                                    '<input type="number" class = "sectionActualPhyVal" data-section="'+response.section[i+1]+'">' +
                                '</div>';
                            }
                            sectionPhyHTML +='</div>';


                            sectionFinHTML +='<div class="doubleinput">';
                            sectionFinHTML += '<div class="column1">' +
                                        '<Label>'+response.section[i]+' (%)</Label><br>' +
                                        '<input type="number" class = "sectionActualFinVal" data-section="'+response.section[i]+'">' +
                                    '</div>';
                            if (response.section[i+1]) {
                                sectionFinHTML += '<div class="column2">' +
                                    '<Label>'+response.section[i+1]+' (%)</Label><br>' +
                                    '<input type="number" class = "sectionActualFinVal" data-section="'+response.section[i+1]+'">' +
                                '</div>';
                            }
                            sectionFinHTML +='</div>';
                        }
                    }
                    $(".sectionPhyActualContainer").html(sectionPhyHTML);
                    $(".sectionFinActualContainer").html(sectionFinHTML);

                    for (var i = 0; i < response.data.length; i++) {
                        let obj = response.data[i]
                        let row = new Date(obj.Sch_Date.date)
                        let weekISO = row.toISOString()
                        res = weekISO.split(":")
                        let weekID = obj.Name //res[0]
                        $("#" + weekID).attr("value", obj.Sch_ID)
                        $("#" + weekID + " div:first-child").removeClass("nofile")
                        $("#" + weekID + " div:first-child").addClass("file")
                        //if got revision
                        if (obj.Revision == true) {
                            $("#" + weekID + " div:last").addClass("revised")
                        }
                    };
                    let nowDate = new Date()
                    nowDate.setHours(0)
                    nowDate.setMinutes(0)
                    nowDate.setSeconds(0)
                    nowDate.setMilliseconds(0)
                    $("#scheduleListing li").each(function () {
                        let nodeLi = $(this).children(":first");
                        if (nodeLi.hasClass("nofile")) {
                            nodeEndDate = new Date($(this).attr("data"))
                            if (nodeEndDate < nowDate) {
                                nodeLi.removeClass("nofile")
                                nodeLi.addClass("late")
                            }
                        }
                    })
                    if (response.data.length == 0) {
                        $(".loader").fadeOut()
                        return
                    }

                    let latestSchedule;
                    $("#scheduleListing li").each(function () {
                        let nodeLi = $(this).children(":first");
                        if (nodeLi.hasClass("file")) {
                            latestSchedule = $(this)
                        }
                    })

                    if(latestSchedule){
                        $(latestSchedule).trigger("click")
                        $(latestSchedule).addClass("active")
                    }

                    $(".loader").fadeOut()

                    $("#scrollThisCont").scrollTop(0);
                    $("#scrollThisCont").animate({
                        scrollTop: $(latestSchedule).offset().top - 300
                    }, 500);
                    if($('#ganttView').is(':visible')){
                        $('#ganttView')[0].contentWindow.$("#gdiv").html("")
                    }
                }
            });

            break;
        case "Monthly":
            $("#scheduleListing").html("");
            year1 = fullDate1.getFullYear();
            year2 = fullDate2.getFullYear();
            month1 = fullDate1.getMonth();
            month2 = fullDate2.getMonth();
            let eachMonth = new Date(fullDate1)
            eachMonth.setDate(1)
            let monthISO = fullDate1.toISOString()
            let parts = localStorage.start_date.split("/");
            var endMonth = new Date(parts[2], parts[1] - 1, parts[0]);
            endMonth.setDate(1)
            endMonth.setMonth(month1 + 1)
            let endMonthISO = endMonth.toISOString()
            let monthID = "monthly_" + eachMonth.getMonth() + "_" + eachMonth.getFullYear();
            let label = new Intl.DateTimeFormat('en-US', {
                month: 'short',
                year: 'numeric'
            }).format(eachMonth)
            $("#scheduleListing").append("<li id='sch_" + monthID + "' onclick='getScheduleInfo(this)' dataStart='" + monthISO + "' data='" + endMonthISO + "'><div class='status nofile'></div><div class='revision'></div><a>" + label + "</a></li>")
            let j = month1 + 1;
            let g = j + 1
            while (eachMonth.getMonth() != month2 || year1 < year2) {
                eachMonth.setMonth(j)
                if (g > 12) {
                    g = 1; //feb
                }
                endMonth.setMonth(g)
                j++
                g++
                if (j > 12) {
                    j = 1; //feb
                    year1++
                }

                let endMonthISO = endMonth.toISOString()
                let monthISO = eachMonth.toISOString()
                let monthID = "monthly_" + eachMonth.getMonth() + "_" + eachMonth.getFullYear();
                let label = new Intl.DateTimeFormat('en-US', {
                    month: 'short',
                    year: 'numeric'
                }).format(eachMonth)
                $("#scheduleListing").append("<li id='sch_" + monthID + "' onclick='getScheduleInfo(this)' dataStart='" + monthISO + "' data='" + endMonthISO + "'><div class='status nofile'></div><div class='revision'></div><a>" + label + "</a></li>")
            }
            $.ajax({
                url: prePrendUrl() + 'getSchedule.php',
                type: "POST",
                data: {
                    schedule_Type: 1
                },
                dataType: 'json',
                success: function (response) {
                    // clear and populate section info
                    var sectionPhyHTML = "";
                    var sectionFinHTML = "";
                    if (response.section) {
                        for (var i = 0; i < response.section.length; i = i + 2) {
                            sectionPhyHTML +='<div class="doubleinput">';
                            sectionPhyHTML += '<div class="column1">' +
                                        '<Label>'+response.section[i]+' (%)</Label><br>' +
                                        '<input type="number" class = "sectionActualPhyVal" data-section="'+response.section[i]+'">' +
                                    '</div>';
                            if (response.section[i+1]) {
                                sectionPhyHTML += '<div class="column2">' +
                                    '<Label>'+response.section[i+1]+' (%)</Label><br>' +
                                    '<input type="number" class = "sectionActualPhyVal" data-section="'+response.section[i+1]+'">' +
                                '</div>';
                            }
                            sectionPhyHTML +='</div>';


                            sectionFinHTML +='<div class="doubleinput">';
                            sectionFinHTML += '<div class="column1">' +
                                        '<Label>'+response.section[i]+' (%)</Label><br>' +
                                        '<input type="number" class = "sectionActualFinVal" data-section="'+response.section[i]+'">' +
                                    '</div>';
                            if (response.section[i+1]) {
                                sectionFinHTML += '<div class="column2">' +
                                    '<Label>'+response.section[i+1]+' (%)</Label><br>' +
                                    '<input type="number" class = "sectionActualFinVal" data-section="'+response.section[i+1]+'">' +
                                '</div>';
                            }
                            sectionFinHTML +='</div>';
                        }
                    }
                    $(".sectionPhyActualContainer").html(sectionPhyHTML);
                    $(".sectionFinActualContainer").html(sectionFinHTML);

                    for (var i = 0; i < response.data.length; i++) {
                        let obj = response.data[i]
                        let row = new Date(obj.Sch_Date.date)
                        let rowMonthID = "monthly_" + row.getMonth() + "_" + row.getFullYear();
                        $("#sch_" + rowMonthID).attr("value", obj.Sch_ID)
                        $("#sch_" + rowMonthID + " div:first-child").removeClass("nofile")
                        $("#sch_" + rowMonthID + " div:first-child").addClass("file")
                        if (obj.Revision == true) {
                            $("#sch_" + rowMonthID + " div:last").addClass("revised")
                        }
                    };
                    let nowDate = new Date()
                    nowDate.setDate(1)
                    nowDate.setHours(0)
                    nowDate.setMinutes(0)
                    nowDate.setSeconds(0)
                    $("#scheduleListing li").each(function () {
                        let nodeLi = $(this).children(":first");
                        if (nodeLi.hasClass("nofile")) {
                            nodeDate = new Date($(this).text())
                            let nodeDate_month = nodeDate.getMonth()
                            nodeDate.setMonth(nodeDate_month + 1)
                            nodeDate.setDate(0)
                            if (nodeDate < nowDate) {
                                nodeLi.removeClass("nofile")
                                nodeLi.addClass("late")
                            }
                        }
                    })
                    if (response.data.length == 0) {
                        $(".loader").fadeOut()
                        return
                    }
                    let latestSchedule;
                    $("#scheduleListing li").each(function () {
                        let nodeLi = $(this).children(":first");
                        if (nodeLi.hasClass("file")) {
                            latestSchedule = $(this)
                        }
                    })

                   if(latestSchedule){
                        $(latestSchedule).trigger("click")
                        $(latestSchedule).addClass("active")
                    }

                    $(".loader").fadeOut()
                    $("#scrollThisCont").scrollTop(0);
                    $("#scrollThisCont").animate({
                        scrollTop: $(latestSchedule).offset().top - 300
                    }, 500);
                    if($('#ganttView').is(':visible')){
                        $('#ganttView')[0].contentWindow.$("#gdiv").html("")
                    }
                }
            });
            break;
        case "Quarterly":
            $("#scheduleListing").html("");
            var sQuarter = Math.floor((fullDate1.getMonth() + 1) / 3) + 1;
            var eQuarter = Math.floor((fullDate2.getMonth() + 1) / 3) + 1;
            var quarterNames = ['Jan', 'Apr', 'Jul', 'Oct'];
            if (eQuarter > 4) {
                eQuarter = 4
            }
            if (sQuarter > 4) {
                sQuarter = 4
            }
            var sYear = fullDate1.getYear() + 1900;
            var eYear = fullDate2.getYear() + 1900;
            var endYear = sYear;
            if (sQuarter > 3) {
                endYear++;
            }
            while (sQuarter != eQuarter || sYear != eYear) {
                let value = sYear + "" + sQuarter
                let QuarID = "Q" + sQuarter + "_" + sYear;
                let quarStart = quarterNames[sQuarter - 1] + " " + sYear;
                let quarEnd = quarterNames[sQuarter] + " " + endYear;
                $("#scheduleListing").append("<li id='sch_" + QuarID + "' dateYear='" + value + "' dataStart='" + quarStart + "' data='" + quarEnd + "' onclick='getScheduleInfo(this)'><div class='status nofile'></div><div class='revision'></div><a>" + QuarID + "</a></li>")
                sQuarter++;
                if (sQuarter > 4) {
                    sQuarter = 1;
                    sYear++;
                }
                if (sQuarter > 3) {
                    endYear++;
                }
            }
            let value = sYear + "" + sQuarter
            let QuarID = "Q" + sQuarter + "_" + sYear;
            let quarStart = quarterNames[sQuarter - 1] + " " + sYear;
            let quarEnd = quarterNames[sQuarter] + " " + endYear;
            $("#scheduleListing").append("<li id='sch_" + QuarID + "' dateYear='" + value + "' dataStart='" + quarStart + "' data='" + quarEnd + "' onclick='getScheduleInfo(this)'><div class='status nofile'></div><div class='revision'></div><a>" + QuarID + "</a></li>")
            $.ajax({
                url: prePrendUrl() + 'getSchedule.php',
                type: "POST",
                data: {
                    schedule_Type: 2
                },
                dataType: 'json',
                success: function (response) {
                    // clear and populate section info
                    var sectionPhyHTML = "";
                    var sectionFinHTML = "";
                    if (response.section) {
                        for (var i = 0; i < response.section.length; i = i + 2) {
                            sectionPhyHTML +='<div class="doubleinput">';
                            sectionPhyHTML += '<div class="column1">' +
                                        '<Label>'+response.section[i]+' (%)</Label><br>' +
                                        '<input type="number" class = "sectionActualPhyVal" data-section="'+response.section[i]+'">' +
                                    '</div>';
                            if (response.section[i+1]) {
                                sectionPhyHTML += '<div class="column2">' +
                                    '<Label>'+response.section[i+1]+' (%)</Label><br>' +
                                    '<input type="number" class = "sectionActualPhyVal" data-section="'+response.section[i+1]+'">' +
                                '</div>';
                            }
                            sectionPhyHTML +='</div>';


                            sectionFinHTML +='<div class="doubleinput">';
                            sectionFinHTML += '<div class="column1">' +
                                        '<Label>'+response.section[i]+' (%)</Label><br>' +
                                        '<input type="number" class = "sectionActualFinVal" data-section="'+response.section[i]+'">' +
                                    '</div>';
                            if (response.section[i+1]) {
                                sectionFinHTML += '<div class="column2">' +
                                    '<Label>'+response.section[i+1]+' (%)</Label><br>' +
                                    '<input type="number" class = "sectionActualFinVal" data-section="'+response.section[i+1]+'">' +
                                '</div>';
                            }
                            sectionFinHTML +='</div>';
                        }
                    }
                    $(".sectionPhyActualContainer").html(sectionPhyHTML);
                    $(".sectionFinActualContainer").html(sectionFinHTML);

                    for (var i = 0; i < response.data.length; i++) {
                        let obj = response.data[i]
                        let row = new Date(obj.Sch_Date.date)
                        let sQuarter = Math.floor((row.getMonth() + 1) / 3) + 1;
                        let QID = "Q" + sQuarter + "_" + row.getFullYear();
                        $("#sch_" + QID).attr("value", obj.Sch_ID)
                        $("#sch_" + QID + " div:first-child").removeClass("nofile")
                        $("#sch_" + QID + " div:first-child").addClass("file")
                        if (obj.Revision == true) {
                            $("#sch_" + QID + " div:last").addClass("revised")
                        }
                    };
                    let nowDate = new Date()
                    let sQuarter = Math.floor((nowDate.getMonth() + 1) / 3);
                    let sYear = nowDate.getFullYear()
                    let nowQuarter = sYear + "" + sQuarter;
                    $("#scheduleListing li").each(function () {
                        let nodeLi = $(this).children(":first");
                        if (nodeLi.hasClass("nofile")) {
                            nodeQuarter = $(this).attr("dateYear")
                            if (nodeQuarter < nowQuarter) {
                                nodeLi.removeClass("nofile")
                                nodeLi.addClass("late")
                            }
                        }
                    })
                    if (response.data.length == 0) {
                        $(".loader").fadeOut()
                        return
                    }
                    let latestSchedule;
                    $("#scheduleListing li").each(function () {
                        let nodeLi = $(this).children(":first");
                        if (nodeLi.hasClass("file")) {
                            latestSchedule = $(this)
                        }
                    })
                    
                    if(latestSchedule){
                        $(latestSchedule).trigger("click")
                        $(latestSchedule).addClass("active")
                    }

                    $(".loader").fadeOut()
                    $("#scrollThisCont").scrollTop(0);
                    $("#scrollThisCont").animate({
                        scrollTop: $(latestSchedule).offset().top - 300
                    }, 500);
                    if($('#ganttView').is(':visible')){
                        $('#ganttView')[0].contentWindow.$("#gdiv").html("")
                    }
                }
            });
            break;
        case "Baseline":
            $("#scheduleListing").html("");
            $("#scheduleListing").append("<li id='sch_baseline'  dataStart='" + fullDate1 + "' data='" + fullDate2 + "' onclick='getScheduleInfo(this)'><div class='status nofile'></div><div class='revision'></div><a>Baseline</a></li>")
            $.ajax({
                url: prePrendUrl() + 'getSchedule.php',
                type: "POST",
                data: {
                    schedule_Type: 3
                },
                dataType: 'json',
                success: function (response) {
                    for (var i = 0; i < response.data.length; i++) {
                        let obj = response.data[i]
                        $("#sch_baseline").attr("value", obj.Sch_ID)
                        $("#sch_baseline div:first-child").removeClass("nofile")
                        $("#sch_baseline div:first-child").addClass("file")
                        if (obj.Revision == true) {
                            $("#sch_baseline div:last").addClass("revised")
                        }
                    };
                    if (response.data.length == 0) {
                        $(".loader").fadeOut()
                        return
                    }
                    let latestSchedule;
                    $("#scheduleListing li").each(function () {
                        let nodeLi = $(this).children(":first");
                        if (nodeLi.hasClass("file")) {
                            latestSchedule = $(this)
                        }
                    })

                    if(latestSchedule){
                        $(latestSchedule).trigger("click")
                        $(latestSchedule).addClass("active")
                    }

                    $(".loader").fadeOut()
                    $("#scrollThisCont").scrollTop(0);
                    $("#scrollThisCont").animate({
                        scrollTop: $(latestSchedule).offset().top - 300
                    }, 500);
                    if($('#ganttView').is(':visible')){
                        $('#ganttView')[0].contentWindow.$("#gdiv").html("")
                    }
                }
            });
            break;
    }
    $(".loader").fadeOut()
}

function showNewlyAddedSchedule(schedName) {
    var prefix;
    let fullDate1
    let fullDate2
    let year1
    let year2
    let month1
    let month2
    let day1
    $("#scheduleMessage").hide();
    $("#ganttView").show()
    if (localStorage.start_date == undefined) {
        $(".noProjectDate").show();
        console.log("Project date is not defined");
        return
    }
    var parts = localStorage.start_date.split("/");
    fullDate1 = new Date(parts[2], parts[1] - 1, parts[0]);
    var parts1 = localStorage.end_date.split("/");
    fullDate2 = new Date(parts1[2], parts1[1] - 1, parts1[0]);
    day1 = fullDate1.getDay();
    let selectedType = $("#scheduleType option:selected")

    if(localStorage.page_pageOpen == "myInsights"){
        prefix = "../";
    }else{
        prefix = "";
    }
    $(".loader").fadeIn();
    switch ($(selectedType).html()) {
        case "Weekly":
            $("#scheduleListing").html("");
            var daystoadd = 0;
            var daystominus = 0;
            switch (day1) {
                case 0: //Sunday
                    daystoadd = 1;
                    break;
                case 1: //Monday
                    daystoadd = 7;
                    break;
                case 2: //Tuesday
                    daystoadd = 6;
                    break;
                case 3: //Wednesday
                    daystoadd = 5;
                    break;
                case 4: //Thursday
                    daystoadd = 4;
                    break;
                case 5: //Friday
                    daystoadd = 3;
                    break;
                case 6: //Saturday
                    daystoadd = 2;
                    break;
            };

            switch (day1) {
                case 0: //Sunday
                    daystominus = 6;
                    break;
                case 1: //Monday
                    daystominus = 0;
                    break;
                case 2: //Tuesday
                    daystominus = 1;
                    break;
                case 3: //Wednesday
                    daystominus = 2;
                    break;
                case 4: //Thursday
                    daystominus = 3;
                    break;
                case 5: //Friday
                    daystominus = 4;
                    break;
                case 6: //Saturday
                    daystominus = 5;
                    break;
            };

            let timeinms = 1000 * 24 * 60 * 60;
            var startweekdate = new Date(fullDate1.getTime() - daystominus * timeinms);
            var endweekdate = new Date(fullDate1.getTime() + daystoadd * timeinms);
            let weekISO = fullDate1.toISOString()
            let dataStart = startweekdate.toISOString()
            let i = 1;
            let res = dataStart.split(":")
            let weekID = res[0]
            let endweekISO = endweekdate.toISOString()

            let wklabel = "WK" + i + " " + new Intl.DateTimeFormat('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            }).format(fullDate1)
            $("#scheduleListing").append("<li id='sch_" + weekID + "' onclick='getScheduleInfo(this)' dataStart='" + dataStart + "' data='" + endweekISO + "'><div class='status nofile'></div><div class='revision'></div><a>" + wklabel + "</a></li>")
            while (endweekdate <= fullDate2) {
                startweekID = new Date(endweekdate.getTime() - timeinms);
                startweekdate = new Date(endweekdate.getTime());
                endweekdate = new Date(endweekdate.getTime() + 7 * timeinms);
                weekISO = startweekdate.toISOString()
                endweekISO = endweekdate.toISOString()
                res = startweekID.toISOString().split(":")
                weekID = res[0]
                i++;
                wklabel = "WK" + i + " " + new Intl.DateTimeFormat('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                }).format(startweekdate)
                $("#scheduleListing").append("<li id='sch_" + weekID + "' onclick='getScheduleInfo(this)' dataStart='" + weekISO + "' data='" + endweekISO + "'><div class='status nofile'></div><div class='revision'></div><a>" + wklabel + "</a></li>")
            }

            $.ajax({
                url: prePrendUrl() + 'getSchedule.php',
                type: "POST",
                dataType: 'json',
                data: {
                    schedule_Type: "0"
                }, //weekly
                success: function (response) {
                    // clear and populate section info
                    var sectionPhyHTML = "";
                    var sectionFinHTML = "";
                    if (response.section) {
                        for (var i = 0; i < response.section.length; i = i + 2) {
                            sectionPhyHTML +='<div class="doubleinput">';
                            sectionPhyHTML += '<div class="column1">' +
                                        '<Label>'+response.section[i]+' (%)</Label><br>' +
                                        '<input type="number" class = "sectionActualPhyVal" data-section="'+response.section[i]+'">' +
                                    '</div>';
                            if (response.section[i+1]) {
                                sectionPhyHTML += '<div class="column2">' +
                                    '<Label>'+response.section[i+1]+' (%)</Label><br>' +
                                    '<input type="number" class = "sectionActualPhyVal" data-section="'+response.section[i+1]+'">' +
                                '</div>';
                            }
                            sectionPhyHTML +='</div>';


                            sectionFinHTML +='<div class="doubleinput">';
                            sectionFinHTML += '<div class="column1">' +
                                        '<Label>'+response.section[i]+' (%)</Label><br>' +
                                        '<input type="number" class = "sectionActualFinVal" data-section="'+response.section[i]+'">' +
                                    '</div>';
                            if (response.section[i+1]) {
                                sectionFinHTML += '<div class="column2">' +
                                    '<Label>'+response.section[i+1]+' (%)</Label><br>' +
                                    '<input type="number" class = "sectionActualFinVal" data-section="'+response.section[i+1]+'">' +
                                '</div>';
                            }
                            sectionFinHTML +='</div>';
                        }
                    }
                    $(".sectionPhyActualContainer").html(sectionPhyHTML);
                    $(".sectionFinActualContainer").html(sectionFinHTML);

                    for (var i = 0; i < response.data.length; i++) {
                        let obj = response.data[i]
                        let row = new Date(obj.Sch_Date.date)
                        let weekISO = row.toISOString()
                        res = weekISO.split(":")
                        let weekID = obj.Name //res[0]
                        $("#" + weekID).attr("value", obj.Sch_ID)
                        $("#" + weekID + " div:first-child").removeClass("nofile")
                        $("#" + weekID + " div:first-child").addClass("file")
                        //if got revision
                        if (obj.Revision == true) {
                            $("#" + weekID + " div:last").addClass("revised")
                        }
                    };
                    let nowDate = new Date()
                    nowDate.setHours(0)
                    nowDate.setMinutes(0)
                    nowDate.setSeconds(0)
                    nowDate.setMilliseconds(0)
                    $("#scheduleListing li").each(function () {
                        let nodeLi = $(this).children(":first");
                        if (nodeLi.hasClass("nofile")) {
                            nodeEndDate = new Date($(this).attr("data"))
                            if (nodeEndDate < nowDate) {
                                nodeLi.removeClass("nofile")
                                nodeLi.addClass("late")
                            }
                        }
                    })
                    if (response.data.length == 0) {
                        $(".loader").fadeOut()
                        return
                    }

                    let latestSchedule;
                    let latestScheduleId;
                    $("#scheduleListing li").each(function () {
                        let nodeLi = $(this).children(":first");
                        if (nodeLi.hasClass("file")) {
                            let scheduleId = $(this).attr("id");
                            if (scheduleId == schedName) {
                                latestSchedule = $(this);
                                latestScheduleId = scheduleId;
                            }
                        }
                    });

                    if (latestSchedule) {
                        latestSchedule.trigger("click").addClass("active");
                    }
                    
                    $(".loader").fadeOut()

                    $("#scrollThisCont").scrollTop(0);
                    $("#scrollThisCont").animate({
                        scrollTop: $(latestSchedule).offset().top - 300
                    }, 500);
                    if($('#ganttView').is(':visible')){
                        $('#ganttView')[0].contentWindow.$("#gdiv").html("")
                    }
                }
            });
            break;
        case "Monthly":
            $("#scheduleListing").html("");
            year1 = fullDate1.getFullYear();
            year2 = fullDate2.getFullYear();
            month1 = fullDate1.getMonth();
            month2 = fullDate2.getMonth();
            let eachMonth = new Date(fullDate1)
            eachMonth.setDate(1)
            let monthISO = fullDate1.toISOString()
            let parts = localStorage.start_date.split("/");
            var endMonth = new Date(parts[2], parts[1] - 1, parts[0]);
            endMonth.setDate(1)
            endMonth.setMonth(month1 + 1)
            let endMonthISO = endMonth.toISOString()
            let monthID = "monthly_" + eachMonth.getMonth() + "_" + eachMonth.getFullYear();
            let label = new Intl.DateTimeFormat('en-US', {
                month: 'short',
                year: 'numeric'
            }).format(eachMonth)
            $("#scheduleListing").append("<li id='sch_" + monthID + "' onclick='getScheduleInfo(this)' dataStart='" + monthISO + "' data='" + endMonthISO + "'><div class='status nofile'></div><div class='revision'></div><a>" + label + "</a></li>")
            let j = month1 + 1;
            let g = j + 1
            while (eachMonth.getMonth() != month2 || year1 < year2) {
                eachMonth.setMonth(j)
                if (g > 12) {
                    g = 1; //feb
                }
                endMonth.setMonth(g)
                j++
                g++
                if (j > 12) {
                    j = 1; //feb
                    year1++
                }

                let endMonthISO = endMonth.toISOString()
                let monthISO = eachMonth.toISOString()
                let monthID = "monthly_" + eachMonth.getMonth() + "_" + eachMonth.getFullYear();
                let label = new Intl.DateTimeFormat('en-US', {
                    month: 'short',
                    year: 'numeric'
                }).format(eachMonth)
                $("#scheduleListing").append("<li id='sch_" + monthID + "' onclick='getScheduleInfo(this)' dataStart='" + monthISO + "' data='" + endMonthISO + "'><div class='status nofile'></div><div class='revision'></div><a>" + label + "</a></li>")
            }
            $.ajax({
                url: prePrendUrl() + 'getSchedule.php',
                type: "POST",
                data: {
                    schedule_Type: 1
                },
                dataType: 'json',
                success: function (response) {
                    // clear and populate section info
                    var sectionPhyHTML = "";
                    var sectionFinHTML = "";
                    if (response.section) {
                        for (var i = 0; i < response.section.length; i = i + 2) {
                            sectionPhyHTML +='<div class="doubleinput">';
                            sectionPhyHTML += '<div class="column1">' +
                                        '<Label>'+response.section[i]+' (%)</Label><br>' +
                                        '<input type="number" class = "sectionActualPhyVal" data-section="'+response.section[i]+'">' +
                                    '</div>';
                            if (response.section[i+1]) {
                                sectionPhyHTML += '<div class="column2">' +
                                    '<Label>'+response.section[i+1]+' (%)</Label><br>' +
                                    '<input type="number" class = "sectionActualPhyVal" data-section="'+response.section[i+1]+'">' +
                                '</div>';
                            }
                            sectionPhyHTML +='</div>';


                            sectionFinHTML +='<div class="doubleinput">';
                            sectionFinHTML += '<div class="column1">' +
                                        '<Label>'+response.section[i]+' (%)</Label><br>' +
                                        '<input type="number" class = "sectionActualFinVal" data-section="'+response.section[i]+'">' +
                                    '</div>';
                            if (response.section[i+1]) {
                                sectionFinHTML += '<div class="column2">' +
                                    '<Label>'+response.section[i+1]+' (%)</Label><br>' +
                                    '<input type="number" class = "sectionActualFinVal" data-section="'+response.section[i+1]+'">' +
                                '</div>';
                            }
                            sectionFinHTML +='</div>';
                        }
                    }
                    $(".sectionPhyActualContainer").html(sectionPhyHTML);
                    $(".sectionFinActualContainer").html(sectionFinHTML);

                    for (var i = 0; i < response.data.length; i++) {
                        let obj = response.data[i]
                        let row = new Date(obj.Sch_Date.date)
                        let rowMonthID = "monthly_" + row.getMonth() + "_" + row.getFullYear();
                        $("#sch_" + rowMonthID).attr("value", obj.Sch_ID)
                        $("#sch_" + rowMonthID + " div:first-child").removeClass("nofile")
                        $("#sch_" + rowMonthID + " div:first-child").addClass("file")
                        if (obj.Revision == true) {
                            $("#sch_" + rowMonthID + " div:last").addClass("revised")
                        }
                    };
                    let nowDate = new Date()
                    nowDate.setDate(1)
                    nowDate.setHours(0)
                    nowDate.setMinutes(0)
                    nowDate.setSeconds(0)
                    $("#scheduleListing li").each(function () {
                        let nodeLi = $(this).children(":first");
                        if (nodeLi.hasClass("nofile")) {
                            nodeDate = new Date($(this).text())
                            let nodeDate_month = nodeDate.getMonth()
                            nodeDate.setMonth(nodeDate_month + 1)
                            nodeDate.setDate(0)
                            if (nodeDate < nowDate) {
                                nodeLi.removeClass("nofile")
                                nodeLi.addClass("late")
                            }
                        }
                    })
                    if (response.data.length == 0) {
                        $(".loader").fadeOut()
                        return
                    }

                    let latestSchedule;
                    let latestScheduleId;
                    $("#scheduleListing li").each(function () {
                        let nodeLi = $(this).children(":first");
                        if (nodeLi.hasClass("file")) {
                            let scheduleId = $(this).attr("id");
                            if (scheduleId == schedName) {
                                latestSchedule = $(this);
                                latestScheduleId = scheduleId;
                            }
                        }
                    });

                    if (latestSchedule) {
                        latestSchedule.trigger("click").addClass("active");
                    }

                    $(".loader").fadeOut()
                    $("#scrollThisCont").scrollTop(0);
                    $("#scrollThisCont").animate({
                        scrollTop: $(latestSchedule).offset().top - 300
                    }, 500);
                    if($('#ganttView').is(':visible')){
                        $('#ganttView')[0].contentWindow.$("#gdiv").html("")
                    }
                }
            });
            break;
        case "Quarterly":
            $("#scheduleListing").html("");
            var sQuarter = Math.floor((fullDate1.getMonth() + 1) / 3) + 1;
            var eQuarter = Math.floor((fullDate2.getMonth() + 1) / 3) + 1;
            var quarterNames = ['Jan', 'Apr', 'Jul', 'Oct'];
            if (eQuarter > 4) {
                eQuarter = 4
            }
            if (sQuarter > 4) {
                sQuarter = 4
            }
            var sYear = fullDate1.getYear() + 1900;
            var eYear = fullDate2.getYear() + 1900;
            var endYear = sYear;
            if (sQuarter > 3) {
                endYear++;
            }
            while (sQuarter != eQuarter || sYear != eYear) {
                let value = sYear + "" + sQuarter
                let QuarID = "Q" + sQuarter + "_" + sYear;
                let quarStart = quarterNames[sQuarter - 1] + " " + sYear;
                let quarEnd = quarterNames[sQuarter] + " " + endYear;
                $("#scheduleListing").append("<li id='sch_" + QuarID + "' dateYear='" + value + "' dataStart='" + quarStart + "' data='" + quarEnd + "' onclick='getScheduleInfo(this)'><div class='status nofile'></div><div class='revision'></div><a>" + QuarID + "</a></li>")
                sQuarter++;
                if (sQuarter > 4) {
                    sQuarter = 1;
                    sYear++;
                }
                if (sQuarter > 3) {
                    endYear++;
                }
            }
            let value = sYear + "" + sQuarter
            let QuarID = "Q" + sQuarter + "_" + sYear;
            let quarStart = quarterNames[sQuarter - 1] + " " + sYear;
            let quarEnd = quarterNames[sQuarter] + " " + endYear;
            $("#scheduleListing").append("<li id='sch_" + QuarID + "' dateYear='" + value + "' dataStart='" + quarStart + "' data='" + quarEnd + "' onclick='getScheduleInfo(this)'><div class='status nofile'></div><div class='revision'></div><a>" + QuarID + "</a></li>")
            $.ajax({
                url: prePrendUrl() + 'getSchedule.php',
                type: "POST",
                data: {
                    schedule_Type: 2
                },
                dataType: 'json',
                success: function (response) {
                    // clear and populate section info
                    var sectionPhyHTML = "";
                    var sectionFinHTML = "";
                    if (response.section) {
                        for (var i = 0; i < response.section.length; i = i + 2) {
                            sectionPhyHTML +='<div class="doubleinput">';
                            sectionPhyHTML += '<div class="column1">' +
                                        '<Label>'+response.section[i]+' (%)</Label><br>' +
                                        '<input type="number" class = "sectionActualPhyVal" data-section="'+response.section[i]+'">' +
                                    '</div>';
                            if (response.section[i+1]) {
                                sectionPhyHTML += '<div class="column2">' +
                                    '<Label>'+response.section[i+1]+' (%)</Label><br>' +
                                    '<input type="number" class = "sectionActualPhyVal" data-section="'+response.section[i+1]+'">' +
                                '</div>';
                            }
                            sectionPhyHTML +='</div>';


                            sectionFinHTML +='<div class="doubleinput">';
                            sectionFinHTML += '<div class="column1">' +
                                        '<Label>'+response.section[i]+' (%)</Label><br>' +
                                        '<input type="number" class = "sectionActualFinVal" data-section="'+response.section[i]+'">' +
                                    '</div>';
                            if (response.section[i+1]) {
                                sectionFinHTML += '<div class="column2">' +
                                    '<Label>'+response.section[i+1]+' (%)</Label><br>' +
                                    '<input type="number" class = "sectionActualFinVal" data-section="'+response.section[i+1]+'">' +
                                '</div>';
                            }
                            sectionFinHTML +='</div>';
                        }
                    }
                    $(".sectionPhyActualContainer").html(sectionPhyHTML);
                    $(".sectionFinActualContainer").html(sectionFinHTML);

                    for (var i = 0; i < response.data.length; i++) {
                        let obj = response.data[i]
                        let row = new Date(obj.Sch_Date.date)
                        let sQuarter = Math.floor((row.getMonth() + 1) / 3) + 1;
                        let QID = "Q" + sQuarter + "_" + row.getFullYear();
                        $("#sch_" + QID).attr("value", obj.Sch_ID)
                        $("#sch_" + QID + " div:first-child").removeClass("nofile")
                        $("#sch_" + QID + " div:first-child").addClass("file")
                        if (obj.Revision == true) {
                            $("#sch_" + QID + " div:last").addClass("revised")
                        }
                    };
                    let nowDate = new Date()
                    let sQuarter = Math.floor((nowDate.getMonth() + 1) / 3);
                    let sYear = nowDate.getFullYear()
                    let nowQuarter = sYear + "" + sQuarter;
                    $("#scheduleListing li").each(function () {
                        let nodeLi = $(this).children(":first");
                        if (nodeLi.hasClass("nofile")) {
                            nodeQuarter = $(this).attr("dateYear")
                            if (nodeQuarter < nowQuarter) {
                                nodeLi.removeClass("nofile")
                                nodeLi.addClass("late")
                            }
                        }
                    })
                    if (response.data.length == 0) {
                        $(".loader").fadeOut()
                        return
                    }
                    
                    let latestSchedule;
                    let latestScheduleId;
                    $("#scheduleListing li").each(function () {
                        let nodeLi = $(this).children(":first");
                        if (nodeLi.hasClass("file")) {
                            let scheduleId = $(this).attr("id");
                            if (scheduleId == schedName) {
                                latestSchedule = $(this);
                                latestScheduleId = scheduleId;
                            }
                        }
                    });

                    if (latestSchedule) {
                        latestSchedule.trigger("click").addClass("active");
                    }

                    $(".loader").fadeOut()
                    $("#scrollThisCont").scrollTop(0);
                    $("#scrollThisCont").animate({
                        scrollTop: $(latestSchedule).offset().top - 300
                    }, 500);
                    if($('#ganttView').is(':visible')){
                        $('#ganttView')[0].contentWindow.$("#gdiv").html("")
                    }
                }
            });

            break;
        case "Baseline":
            $('#ganttView').contents().find("#gdiv").html("");
            $("#scheduleListing").html("");
            $("#scheduleListing").append("<li id='sch_baseline'  dataStart='" + fullDate1 + "' data='" + fullDate2 + "' onclick='getScheduleInfo(this)'><div class='status nofile'></div><div class='revision'></div><a>Baseline</a></li>")
            $.ajax({
                url: prePrendUrl() + 'getSchedule.php',
                type: "POST",
                data: {
                    schedule_Type: 3
                },
                dataType: 'json',
                success: function (response) {
                    for (var i = 0; i < response.data.length; i++) {
                        let obj = response.data[i]
                        $("#sch_baseline").attr("value", obj.Sch_ID)
                        $("#sch_baseline div:first-child").removeClass("nofile")
                        $("#sch_baseline div:first-child").addClass("file")
                        if (obj.Revision == true) {
                            $("#sch_baseline div:last").addClass("revised")
                        }
                    };
                    if (response.data.length == 0) {
                        $(".loader").fadeOut()
                        return
                    }
                    
                    let latestSchedule;
                    let latestScheduleId;
                    $("#scheduleListing li").each(function () {
                        let nodeLi = $(this).children(":first");
                        if (nodeLi.hasClass("file")) {
                            let scheduleId = $(this).attr("id");
                            if (scheduleId == schedName) {
                                latestSchedule = $(this);
                                latestScheduleId = scheduleId;
                            }
                        }
                    });

                    if (latestSchedule) {
                        latestSchedule.trigger("click").addClass("active");
                    }

                    $(".loader").fadeOut()
                    $("#scrollThisCont").scrollTop(0);
                    $("#scrollThisCont").animate({
                        scrollTop: $(latestSchedule).offset().top - 300
                    }, 500);
                    if($('#ganttView').is(':visible')){
                        $('#ganttView')[0].contentWindow.$("#gdiv").html("")
                    }
                }
            });
            break;
    }
    $(".loader").fadeOut()
}

function fetchActualInfo(z){
    let scheduleStartDate = $(z).attr("dataStart")
    let startDate = new Date(scheduleStartDate)
    offset = startDate.getTimezoneOffset();
    startDate = new Date(startDate.getTime() - (offset * 60 * 1000));
    startDate = startDate.toISOString().slice(0, 10)
    let scheduleType;
    switch ($("#scheduleType option:selected").html()) {
        case 'Weekly':
            scheduleType = 0;
            break;
        case 'Monthly':
            scheduleType = 1;
            break;
        case 'Quarterly':
            scheduleType = 2;
            break;
    }

    $.ajax({
        type: "POST",
        url: '../BackEnd/fetchActualValue.php',
        dataType: 'json',
        data: {
            scheduleType: scheduleType,
            startDate :startDate
        },
        success: function (obj) {
            if(obj.result){
                var data = obj.data;
                var physicalHtmlTb = "";
                var financialHtmlTb = "";
                for (const [idx, ele] of Object.entries(data)) {
                    if($(".sectionActualPhyVal[data-section='"+idx+"']")){
                        $(".sectionActualPhyVal[data-section='"+idx+"']").val((ele.ppsa_physical_actual) ? parseFloat(ele.ppsa_physical_actual).toFixed(2) : 0);
                    }
                    if($(".sectionActualFinVal[data-section='"+idx+"']")){
                        $(".sectionActualFinVal[data-section='"+idx+"']").val((ele.ppsa_financial_actual) ? parseFloat(ele.ppsa_financial_actual).toFixed(2) : 0);
                    }
                    $("#physicalActualValue").val((data.overall.ppsa_physical_actual) ? parseFloat(data.overall.ppsa_physical_actual).toFixed(2) : 0);
                    $("#financialActualValue").val((data.overall.ppsa_financial_actual) ? parseFloat(data.overall.ppsa_financial_actual).toFixed(2) : 0);
                    
                    if(idx == 'overall' || $(".sectionActualPhyVal[data-section='"+idx+"']").length != 0){
                        physicalHtmlTb += "<b>"+idx+":</b> "+ parseFloat(ele.ppsa_physical_actual).toFixed(2) + "<br/>";
                        financialHtmlTb +=  "<b>"+idx+":</b> "+ parseFloat(ele.ppsa_financial_actual).toFixed(2) + "<br/>";
                    }
                }

                $("#physicalActTb").html(physicalHtmlTb);
                $("#financialActTb").html(financialHtmlTb);
            }else{
                $(".sectionActualPhyVal").val(0);
                $(".sectionActualFinVal").val(0);
                $("#physicalActualValue").val(0);
                $("#financialActualValue").val(0);
                $("#physicalActTb").html("");
                $("#financialActTb").html("");
            }
        }
    });
}

function getScheduleInfo(ele) {

    //only applicable for obyu
    if(SYSTEM == 'OBYU'){
        fetchActualInfo(ele);
        $("#updateActualBtn").css("display", "inline-block")
    }

    scheduleObj = ele;
    $("#scheduleOwner").text("")
    $("#scheduleUploadedDate").text("")
    $('#scheduleRevision').text("")
    $("#scheduleName").text("")
    $("#revisionList").html("")
    $("#scheduleListing li.active").removeClass("active")
    $(ele).addClass("active")
    let aTag = $(ele).children(":last")
    let Sch_ID = $(ele).val()
    $("#scheduleName").text(aTag.text())
    selectedSchedule = $(ele).attr("id")
    if (Sch_ID == 0) {
        $("#scheduleMessage").show()
        $("#ganttView").hide()
        $(".reviseContainer").hide()
        $("#reviseschedule").css("display", "none")
        $("#updateActualBtn").css("display", "none")
        $(".loader").css("display", "none")
        return
    }
    $("#scheduleMessage").hide()
    $("#ganttView").show()
    $("#reviseschedule").css("display", "inline-block")
    
    $.ajax({
        url: prePrendUrl() + 'ScheduleV3.php',
        type: "POST",
        dataType: 'json',
        data: {
            schID: Sch_ID,
            function_name : 'getScheduleDetails'

        },
        success: function (response) {
            if (response.revision.length > 0) {
                var revisedData
                $('#scheduleRevision').text("Revised")
                let myArray = response.revision
                myArray.forEach(element => {
                    revisedData = element;
                    var reasoning = $("#revisionreason option").filter(
                        function () {
                            return $(this).val() == element.ReasoningID
                        }
                    )
                    $("#revisionList").prepend("<li style='text-align: center;' title ='Uploaded on " + (new Date(element.Upload_Date.date)).toDateString() + "\n\
                Uploaded by " + element.Uploaded_By + "\n\
                Reason: " + $(reasoning).text() + "\n\
                Comment: " + element.Comment + "' onclick = 'viewRevisionSchedule(this)' data='" + element.Sch_Ver + "' value='" + element.URL + "'>Version " + element.Sch_Ver + "</li>")
                });
                let firstLi = $("#revisionList li:first-child")[0]
                $(firstLi).addClass("active");
                viewSchedule($(firstLi).attr("value"))
                $("#scheduleOwner").text(revisedData.Uploaded_By)
                $("#scheduleUploadedDate").text(new Date(revisedData.Upload_Date.date).toDateString())
            } else {
                $('#scheduleRevision').text("No revision")
                $("#revisionList").prepend("<li style='text-align: center;' onclick = 'viewRevisionSchedule(this)'\
                title ='Uploaded on " + (new Date(response.data.Upload_Date.date)).toDateString() + "\n\
                Uploaded by " + response.data.Uploaded_By + "\n\
                Reason: New Schedule\n\
                Comment: null\
                'data='" + response.data.Sch_Ver + "' value='" + response.data.URL + "'><a align='center'>Version " + response.data.Sch_Ver + "</a></div></li>")
                $("#scheduleOwner").text(response.data.Uploaded_By)
                $("#scheduleUploadedDate").text(new Date(response.data.Upload_Date.date).toDateString())
                viewSchedule(response.data.URL)
            }
        }
    });
    cancelScheduleGantt();
}

function viewRevisionSchedule(ele) {
    $("#revisionList li.active").removeClass("active")
    let element = $(ele)[0]
    $(element).addClass("active");
    viewSchedule($(element).attr("value"))
}


saveScheduleGantt = () => {
    let scheduleName = selectedSchedule
    let scheduleStart = $("#scheduledatestart").val()
    let revisionnumber = $("#revisionnumber").val()
    let revisionreason = $("#revisionreason").val()
    let revisionremarks = $("#revisionremarks").val()
    let xmlFile = document.getElementById("xmlInp");
    let scheduleType;
    $('#scheduleMessage').hide();
    $("#ganttView").show();
   
    switch ($("#scheduletype").val()) {
        case 'Weekly':
            scheduleType = 0;
            break;
        case 'Monthly':
            scheduleType = 1;
            break;
        case 'Quarterly':
            scheduleType = 2;
            break;
        case 'Baseline':
            scheduleType = 3;
            break;
    }
    var pro_Inp = xmlFile.files[0];
    if (typeof pro_Inp == 'undefined') {
        $.alert({
            boxWidth: '30%',
            useBootstrap: false,
            title: 'Message',
            content: 'Please choose a project schedule in XML format',
        });
        return
    }
    var reg = /(.*?)\.(xml)$/;
    if (!pro_Inp.name.toLowerCase().match(reg)) {
        $.alert({
            boxWidth: '30%',
            useBootstrap: false,
            title: 'Message',
            content: 'Input file format is not supported!',
        });
        xmlFile.value = "";
        return
    }
    $(".loader").fadeIn();
    var formdata = new FormData();
    formdata.append('function_name', "saveSchedule");
    formdata.append('scheduleName', scheduleName);
    formdata.append('scheduleStart', scheduleStart);
    formdata.append('revisionnumber', revisionnumber);
    formdata.append('revisionreason', revisionreason);
    formdata.append('revisionremarks', revisionremarks);
    formdata.append('scheduleType', scheduleType);
    formdata.append('xmlInp', pro_Inp);
    formdata.append('revisionremarks', revisionremarks);
    //check file existence
    validateXML(pro_Inp.name, formdata)
    cancelScheduleGantt();
};

function sendFormData(formdata) {
    var request = new XMLHttpRequest();
    request.open("POST", prePrendUrl() + "ScheduleV3.php", true);
    request.send(formdata);
    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == "200") {
            var response = JSON.parse(request.response);
            if(response['msg'] && response['msg'] == 'Success'){
                var schedName = response['schedName'];
                $("#addschedulecancel").trigger("click")
                showNewlyAddedSchedule(schedName)
                return
            }else{
                $.alert({
                    boxWidth: '30%',
                    useBootstrap: false,
                    title: 'Message',
                    content: response['msg']
                });
                return
            }
        };
    };
}

function validateXML(val, formdata) {
    $.ajax({
        type: "POST",
        url: prePrendUrl() + 'validateXML.php',
        dataType: 'json',
        data: {
            name: val
        },
        success: function (obj, textstatus) {
            if (obj.result) { //clash detected
                $.confirm({
                    boxWidth: '30%',
                    useBootstrap: false,
                    title: 'Confirm!',
                    content: 'Schedule file, ' + val + ' already exist in the server. Save this file as <input id="revisedFilename" type="text" placeholder="e.g. Jan2019"/>',
                    buttons: {
                        confirm: function () {
                            var ask = this.$content.find('input#revisedFilename');
                            let value = $(ask).val();
                            var rename;
                            value = value.toLowerCase();
                            if (value.search(".xml") < 0) {
                                rename = value + ".xml"
                            } else {
                                rename = value
                            }
                            validateXMLinput(rename, formdata, sendFormData)
                        },
                        cancel: function () {
                            return
                        }
                    }
                })
            } else {
                sendFormData(formdata)
                //no clash detected
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            var str = textStatus + " " + errorThrown;
            console.log(str);
        }
    })
}


function validateXMLinput(val, formdata, callback) {
    $.ajax({
        type: "POST",
        url: prePrendUrl() + 'validateXML.php',
        dataType: 'json',
        data: {
            name: val
        },
        success: function (obj, textstatus) {
            if (obj.result) { //clash detected
                $.confirm({
                    boxWidth: '30%',
                    useBootstrap: false,
                    title: 'Confirm!',
                    content: 'Schedule file, ' + val + ' already exist in the server. Save this file as <input id="revisedFilename" type="text" placeholder="e.g. Jan2019"/>',
                    buttons: {
                        confirm: function () {
                            var ask = this.$content.find('input#revisedFilename');
                            let value = $(ask).val();
                            value = value.toLowerCase();
                            if (value.search(".xml") < 0) {
                                val = value + ".xml"
                            } else {
                                val = value
                            }
                            validateXMLinput(val, formdata, callback)
                        },
                        cancel: function () {
                            return
                        }
                    }
                })
            } else {
                formdata.append('rename', val)
                if (callback) {
                    callback(formdata)
                };
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            var str = textStatus + " " + errorThrown;
            console.log(str);
        }
    })
}

function viewSchedule(URL) {
    $('.loader').fadeIn();
    // post it to ganttView for display in iframe
    var ganttSrc = prePrendUrl() + "ganttView.php"
     $("#ganttView").attr("src", ganttSrc)
     $("#ganttView").attr('data-url', URL)
     $("#ganttView").attr('data-theme', localStorage.themeJoget)
 
}

function onChangeScheduleFileName() {
    let url = $('#scheduleFileName option:selected').val();
    $.ajax({
        url: prependUrlIframe() + 'ScheduleV3.php',
        type: "POST",
        dataType: 'json',
        data: {
            url : url,
            function_name : 'getScheduleTaskNames'
        },
        success: function (response) {
            let data = response['data'];
            if(response['data']){
                let type = response['oNumber'];
                let taskTree = [];
                if (taskTreeFlag) {
                    $('#scheduleMapRootNode').jstree("destroy").empty();
                    taskTreeFlag = false;
                }
                if(type == "number"){
                    for(var i=0; i<data.length; i++){
                        if (data[i].outlineLevel == 0) {// root
                            let id = "t" + data[i].outlineNumber;

                            taskTree.push({
                                id: id,
                                parent: "#",
                                text: data[i].name,
                                icon: 'Images/calendar.png'
                            });
                        } else if (data[i].outlineLevel == 1) {
                            let j = 0;
                            let parentid = "t" + (data[i].outlineLevel - 1);
                            while (j < taskTree.length) {
                                if (taskTree[j].id == parentid) {
                                    let id = "t" + data[i].outlineNumber;
                                    taskTree.push({
                                        id: id,
                                        parent: parentid,
                                        text: data[i].name,
                                        icon: 'Images/gantt.png'
                                    })
                                    break;
                                }
                                j++;
                            }

                        } else {
                            if(data[i].outlineNumber == ''){
                                continue;
                            }
                            let j = 0
                            let pos = data[i].outlineNumber.lastIndexOf(".");
                            let parentid = "t" + data[i].outlineNumber.substring(0, pos);
                            while (j < taskTree.length) {
                                if (taskTree[j].id == parentid) {
                                    let id = "t" + data[i].outlineNumber;
                                    taskTree.push({
                                        id: id,
                                        parent: parentid,
                                        text: data[i].name,
                                        icon: 'Images/graph.png'
                                    })
                                    break;
                                }
                                j++;
                            }
                        }
                    }
                }else{
                    for(var i=0; i<data.length; i++){
                        let id = "t"+i+data[i].outlineLevel;
                        taskTree.push({
                            id: id,
                            parent: "#",
                            text: data[i].name,
                            icon: 'Images/calendar.png'
                        });
                    }

                }
                $('#scheduleMapRootNode').jstree({
                    'core': {
                        'data': taskTree,
                        'check_callback': true
                    },
                    'plugins': ["sort"]
                });
                taskTreeFlag = true;
            }else{
                $.alert({
                    boxWidth: '30%',
                    useBootstrap: false,
                    title: 'Message',
                    content: response['error']
                });
            }
          
        },
        error: function (xhr, textStatus, errorThrown) {
            var str = textStatus + " " + errorThrown;
            $.alert({
                boxWidth: '30%',
                useBootstrap: false,
                title: 'Message',
                content: str
            });

        }
    });

}

function mapSchedule() {
    $.ajax({
        url: prependUrlIframe() + 'getScheduleList.php',
        type: "GET",
        dataType: 'json',
        success: function (response) {
            let data = response['data'];

            document.querySelectorAll('#scheduleFileName option').forEach(option => option.remove());
            let mySelect = document.getElementById('scheduleFileName');
            var myoption = document.createElement("option");
            myoption.value = "";
            myoption.text = "Please Select ...";
            myoption.disabled = true;
            mySelect.appendChild(myoption);
            for (var i = 0; i < data.length; i++) {
                let j = 0;
                let flag = false;
                var name ;
                if (data[i].Sch_Date != null) {
                    name = new Date(data[i].Sch_Date.date).toDateString();
                }
                while (j < mySelect.options.length) {
                    if (name == mySelect.options[j].text) {
                        flag = true;
                        break;
                    }
                    j++;
                }
               
                if (!flag) {
                    var myoption = document.createElement("option");
                    myoption.value = data[i].URL;
                    myoption.text = name;
                    mySelect.appendChild(myoption);

                }
            }
            mySelect.selectedIndex =0;

            //get the mappings and display
            let mapdata = response['mapping'];
            $("#scheduleMapInput").html("");
            for(var j=0; j<mapdata.length; j++){
                $("#scheduleMapInput").append(
                    "<div class='doubleinput'>\
                        <div class='column1'>\
                            <input type='checkbox' class ='schMapChk'>\
                        </div>\
                        <div class='column2'>\
                            <input type='text' value = '"+ mapdata[j].schName+ "' readonly class ='schMap'>\
                        </div>\
                        <div class='column3'>\
                            <img src='Images/icons/admin_page/schedulemapping/double-arrow.png'>\
                        </div>\
                        <div class='column4'>\
                            <input type='text' value ='"+ mapdata[j].locName +"' readonly class ='schMap'>\
                        </div>\
                    </div>"
                );
            }

        },
        error: function (xhr, textStatus, errorThrown) {
            var str = textStatus + " " + errorThrown;
            $.alert({
                boxWidth: '30%',
                useBootstrap: false,
                title: 'Message',
                content: str
            });

        }
    });

    // need tp reset all values and the trees here yet

    var xhr = new XMLHttpRequest();
    let data = "project_id=" + localStorage.p_id;
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4 && this.status == 200) {
            let locations = JSON.parse(this.responseText).locations;
            let locationsTreeList = [];
            locationsTreeList.push({
                id: "regions",
                parent: "#",
                text: "Regions",
                state: { "disabled": true },
                icon: 'Images/isobars.png'
            });
            for (var i = 0; i < locations.length; i++) {
                var ID = locations[i].locationID;
                var myname = locations[i].locationName;
                var isRegion = false;
                var isSubregion = false;
                for (var j = 0; j < locationsTreeList.length; j++) {
                    if (locationsTreeList[j].id == locations[i].region) {
                        isRegion = true;
                    };
                };
                if (!isRegion) {
                    locationsTreeList.push({
                        id: locations[i].region,
                        parent: "regions",
                        text: locations[i].region,
                        state: { "disabled": true },
                        icon: 'Images/map.png'
                    });
                };

                locationsTreeList.push({
                    id: myname,
                    parent: locations[i].region,
                    text: myname,
                    'icon': 'Images/pintree.png'

                });
            };
            $('#scheduleMapLocationRootNode').jstree({
                'core': {
                    'data': locationsTreeList,
                    'check_callback': true
                },
                
				'plugins': ["sort" ]
			});
		}
	});
	xhr.open("POST", prependUrlIframe() + "getLocationsData.php");
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.setRequestHeader("Accept", "*/*");
    xhr.send(data);
}

function onClickResetScheduleSelection() {
    $('#scheduleMapRootNode').jstree('deselect_all');
    $('#scheduleMapLocationRootNode').jstree('deselect_all');
}
function onClickAddScheduleMapping() {

    let sch = $('#scheduleMapRootNode').jstree().get_selected();
    let locSelected = $('#scheduleMapLocationRootNode').jstree().get_selected();
    console.log(sch + " " + locSelected);
    // need to check if nothing is selected. 
    if (sch.length == 0 || locSelected.length == 0) {
        $.alert({
            boxWidth: '30%',
            useBootstrap: false,
            title: 'Message',
            content: 'Please choose the tasks and locations for mapping!',
        });
        return;
    }
    let schSelected = $('#scheduleMapRootNode').jstree().get_selected(true)[0].text;
    $("#scheduleMapInput").append(
        "<div class='doubleinput'>\
            <div class='column1'>\
                <input type='checkbox' class ='schMapChk'>\
            </div>\
            <div class='column2'>\
                <input type='text' value = '"+ schSelected + "' readonly class ='schMap'>\
            </div>\
            <div class='column3'>\
                <img src='Images/icons/admin_page/schedulemapping/double-arrow.png'>\
            </div>\
            <div class='column4'>\
                <input type='text' value ='"+ locSelected + "' readonly class ='schMap'>\
            </div>\
        </div>"
    );

}

function onClickSaveScheduleMapping() {
    let i = 0;
    let mapArr = [], schName = "", locName = "";
    $(".schMap").each(function () {
        if (i % 2 == 0) {
            schName = this.value;
        } else {
            locName = this.value;
            mapArr.push({
                schName: schName,
                locName: locName
            });
        }
        i++;

    });
    $.ajax({
        url: prependUrlIframe() + 'saveSchLocMapping.php',
        type: "POST",
        dataType: 'json',
        data: {
           array: JSON.stringify(mapArr)
        },
        success: function (response) {
            console.log(response);
            $.alert({
                boxWidth: '30%',
                useBootstrap: false,
                title: 'Message',
                content: response['msg']
            });
        },
        error: function (xhr, textStatus, errorThrown) {
            var str = textStatus + " " + errorThrown;
            $.alert({
                boxWidth: '30%',
                useBootstrap: false,
                title: 'Message',
                content: str
            });

        }
    });
}
function onClickDeleteScheduleMapping() {

    $("input[type=checkbox].schMapChk").each(function () {
        if (this.checked) {
            $(this).parent().parent().remove()
        }
    })

}