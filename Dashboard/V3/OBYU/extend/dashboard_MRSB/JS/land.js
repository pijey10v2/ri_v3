var landData;
var monthHalftext = {1:"Jan",2:"Feb",3:"Mar",4:"Apr",5:"May",6:"Jun",7:"Jul",8:"Aug",9:"Sep",10:"Oct",11:"Nov",12:"Dec"};
var monthNumtoHalftext = {"01":"Jan","02":"Feb","03":"Mar","04":"Apr","05":"May","06":"Jun","07":"Jul","08":"Aug","09":"Sep","10":"Oct","11":"Nov","12":"Dec"};
var dataColorArr = ['#54a992', '#8fb59c', '#eddbc3', '#e8c571', '#d94c3a', '#813a26', '#E74C3C']
var monthHalfPrev = {"Jan":"Dec","Feb":"Jan","Mar":"Feb","Apr":"Mar","May":"Apr","Jun":"May","Jul":"Jun","Aug":"Jul","Sep":"Aug","Oct":"Sep","Nov":"Oct","Dec":"Nov"};

var currYear;
var currMonth;
var prevYear;
var prevMonth;
var timelineJSON;

function openConOpDashboardLand(year, month){

    var linkParamArr = [year, month];
    var postParam = {function:"openConOpDashboard",processType:"LAND", conOpTabId:"conopTab18", linkName:"construct_dash_conop_land_management", linkParam:linkParamArr, linkWinTitle: 'Land Management'};
    if(localStorage.ui_pref == 'ri_v3'){
        window.parent.widgetConopOpen("LAND", "construct_dash_conop_land_management", linkParamArr, "Land Management");
    }else{
        parent.postMessage(postParam ,"*");
    }
}

function openConOpDashboardLandTimeData(year, month, category){
    //if(idFilter == '') return 
    //var linkParamArr = [idFilter];

    var linkParamArr = [year, month, category];
    var postParam = {function:"openConOpDashboard",processType:"LAND", conOpTabId:"conopTab17", linkName:"construct_dash_conop_land_timeline", linkParam:linkParamArr, linkWinTitle: 'Land Timeline & Database'};
    if(localStorage.ui_pref == 'ri_v3'){
        window.parent.widgetConopOpen("LAND", "construct_dash_conop_land_timeline", linkParamArr, "Land Management");
    }else{
        parent.postMessage(postParam ,"*");
    }
}

// First Page Pie Chart
function landAcquisitionChart(data, yearFilter, monthFilter) {

    let latestYear = null;
    let latestMonth = null;
    let latestData = null;

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    if (yearFilter === "all") {
        if (monthFilter === "all") {
            for (let year in data) {
                if (!isNaN(year)) {
                    for (let month in data[year]) {
                        if (months.includes(month)) {
                            if (latestYear === null || year > latestYear || (year === latestYear && months.indexOf(month) > months.indexOf(latestMonth))) {
                                latestYear = year;
                                latestMonth = month;
                                latestData = data[year][month];
                            }
                        }
                    }
                }
            }
        }
    } else {
        if (!data.hasOwnProperty(yearFilter)) {
            return;
        }

        if (monthFilter === "all") {
            for (let month in data[yearFilter]) {
                if (months.includes(month)) {
                    if (latestMonth === null || months.indexOf(month) > months.indexOf(latestMonth)) {
                        latestMonth = month;
                        latestData = data[yearFilter][month];
                    }
                }
            }
        } else {
            latestData = data[yearFilter][monthFilter];
        }
    }

    var yearData = '';
    var monthData = '';

    if (yearFilter === "all") {
        yearData = '';
    } else {
        const monthNames = {
            Jan: "01",
            Feb: "02",
            Mar: "03",
            Apr: "04",
            May: "05",
            Jun: "06",
            Jul: "07",
            Aug: "08",
            Sep: "09",
            Oct: "10",
            Nov: "11",
            Dec: "12"
        };
        
        if (monthFilter === "all") {
            monthData = '';
        } else {
            monthData = monthNames[monthFilter] ? monthNames[monthFilter] : '';
        }

        yearData = yearFilter;
    }

    const sectionToChart = {
        "": { title: "NCH", div: "overallChart" },
        "LW 1": { title: "LW 1", div: "lawas01Chart" },
        "LAW01": { title: "LAW01", div: "lawas01Chart" },
        "LW 2": { title: "LW 2", div: "lawas02Chart" },
        "LAW02": { title: "LAW02", div: "lawas02Chart" },
        "LB 1": { title: "LB 1", div: "limbang01Chart" },
        "LIM01": { title: "LIM01", div: "limbang01Chart" },
        "LB 2": { title: "LB 2", div: "limbang02Chart" },
        "LIM02": { title: "LIM02", div: "limbang02Chart" },
        "LB 3": { title: "LB 3", div: "limbang03Chart" },
        "LIM03": { title: "LIM03", div: "limbang03Chart" }
    };

    if (!latestData || Object.keys(latestData).length === 0) {
        for (const section in sectionToChart) {
            const { title: centerTitle, div: chartDiv } = sectionToChart[section] ? sectionToChart[section] : '';

            if (!document.getElementById(chartDiv)) {
                continue;
            }

            Highcharts.chart(chartDiv, {
                chart: {
                    type: 'pie',
                    custom: {},
                    events: {
                        render() {
                            const chart = this,
                                series = chart.series[0];
                            let customLabel = chart.options.chart.custom.label;

                            if (!customLabel) {
                                customLabel = chart.options.chart.custom.label =
                                    chart.renderer.label(centerTitle + '<br/>')
                                        .css({ color: '#000', textAnchor: 'middle' })
                                        .add();
                            }

                            if (series && series.center) {
                                const x = series.center[0] + chart.plotLeft;
                                const y = series.center[1] + chart.plotTop - (customLabel.attr('height') / 2);
                    
                                customLabel.attr({ x: x, y: y });
                                customLabel.css({ fontSize: `${series.center[2] / 12}px` });
                            }
                        }
                    }
                },
                accessibility: {
                    point: { valueSuffix: '%' }
                },
                title: { text: '' },
                subtitle: { text: '' },
                tooltip: { pointFormat: '' },
                plotOptions: {
                    pie: {
                        dataLabels: {
                            enabled: true,
                            format: '{point.y}km',
                            style: {
                                fontSize: '8px'
                            }
                        },
                        showInLegend: true
                    }
                },
                legend: {
                    itemStyle: {
                        fontSize: '10px',
                        color: '#333'
                    }
                },
                series: [{
                    name: centerTitle,
                    colorByPoint: true,
                    innerSize: '85%',
                    size: '95%',
                    data: []
                }],
                credits: { enabled: false },
            });
        }
        return;
    }

    for (const section in latestData) {
        const { title: centerTitle, div: chartDiv } = sectionToChart[section] ? sectionToChart[section] : {};

        if (!centerTitle || !chartDiv) {
            continue;
        }

        const chartData = latestData[section] ? latestData[section] : {};

        const landAcData = [
            {
                name: "Land Acquisition Status To Date (KM)",
                y: parseFloat((chartData.cumulativeStatusKM ? chartData.cumulativeStatusKM : 0).toFixed(0)),
                color: 'cornflowerblue'
            },
            {
                name: "Land Acquisition Status Balance (KM)",
                y: parseFloat((chartData.cumulativeBalStatusKM ? chartData.cumulativeBalStatusKM : 0).toFixed(1)),
                color: 'coral'
            }
        ];

        const landDisData = [
            {
                name: "Land Disputed To Date (KM)",
                y: parseFloat((chartData.cumulativeDisputeKM ? chartData.cumulativeDisputeKM : 0).toFixed(0)),
                color: 'darkseagreen'
            }
        ];

        if (!document.getElementById(chartDiv)) {
            continue;
        }

        let updateOnce = false;

        Highcharts.chart(chartDiv, {
            chart: {
                marginTop: 3.7,
                marginLeft: 100,
                marginBottom: 4.5,
                type: 'pie',
                custom: {},
                events: {
                    render() {
                        const chart = this,
                            series = chart.series[0];
                        let customLabel = chart.options.chart.custom.label;

                        if (document.fullscreenElement && !updateOnce) {
                            updateOnce = true;
                            
                            if (!customLabel) {
                                customLabel = chart.options.chart.custom.label =
                                    chart.renderer.label(centerTitle + '<br/>')
                                        .css({ color: '#000', textAnchor: 'middle' })
                                        .add();
                            }
                        
                            if (series && series.center) {
                                const x = series.center[0] + chart.plotLeft;
                                const y = series.center[1] + chart.plotTop - (customLabel.attr('height') / 2);
                        
                                customLabel.attr({ x: x, y: y });
                                customLabel.css({ fontSize: `${series.center[2] / 12}px` });
                            }

                            chart.series.forEach(function (series) {

                                series.update({
                                    dataLabels: {
                                        enabled: true,
                                        distance: 30,
                                        format: '{point.y}km',
                                        style: {
                                            fontSize: '20px'
                                        }
                                    }
                                }, false); 
                            });
                    
                            chart.redraw();
                        
                            chart.update({                               
                                legend: {
                                    layout: 'vertical',
                                    align: 'left',
                                    itemStyle: {
                                        fontSize: '20px',
                                        color: '#333',
                                        width: 'auto'
                                    }
                                }
                            });
                        }

                        if (!customLabel) {
                            customLabel = chart.options.chart.custom.label =
                                chart.renderer.label(centerTitle + '<br/>')
                                    .css({ color: '#000', textAnchor: 'middle' })
                                    .add();
                        }

                        if (series && series.center) {
                            const x = series.center[0] + chart.plotLeft;
                            const y = series.center[1] + chart.plotTop - (customLabel.attr('height') / 2);
                
                            customLabel.attr({ x: x, y: y });
                            customLabel.css({ fontSize: `${series.center[2] / 12}px` });
                        }
                    }
                }
            },
            accessibility: {
                point: { valueSuffix: '%' }
            },
            title: { text: '' },
            subtitle: { text: '' },
            tooltip: { pointFormat: '' },
            legend: {
                layout: 'vertical',
                align: 'left',
                itemStyle: {
                    fontSize: '8.5px',
                    color: '#333',
                    width: 80,
                    textOverflow: null
                }
            },
            plotOptions: {
                pie: {
                    borderRadius: 0,
                    showInLegend: true
                }
            },
            series: [{
                name: "Land Disputed",
                colorByPoint: true,
                size: '60%',
                innerSize: '60%',
                data: landDisData,
                dataLabels: {
                    enabled: true,
                    distance: 40,
                    format: '{point.y}km',
                    style: {
                        fontSize: '9px'
                    }
                },
                events: {
                    click: function (event) {
                        var linkParamArr = [yearData, monthData];
                        var postParam = { function: "openConOpDashboard", processType: "LAND", conOpTabId: "conopTab18", linkName: "construct_dash_conop_land_management", linkParam: linkParamArr, linkWinTitle: 'Land Management' };
                        if (localStorage.ui_pref == "ri_v3") {
                            window.parent.widgetConopOpen("LAND", "construct_dash_conop_land_management", linkParamArr, "Land Management");
                        } else {
                            parent.postMessage(postParam, "*");
                        }
                    }
                }
            },
            {
                name: "Land Acquisition Status",
                colorByPoint: true,
                size: '90%',
                innerSize: '80%',
                data: landAcData,
                dataLabels: {
                    enabled: true,
                    distance: 5,
                    format: '{point.y}km',
                    style: {
                        fontSize: '9px'
                    }
                },
                events: {
                    click: function (event) {
                        var linkParamArr = [yearData, monthData];
                        var postParam = { function: "openConOpDashboard", processType: "LAND", conOpTabId: "conopTab18", linkName: "construct_dash_conop_land_management", linkParam: linkParamArr, linkWinTitle: 'Land Management' };
                        if (localStorage.ui_pref == "ri_v3") {
                            window.parent.widgetConopOpen("LAND", "construct_dash_conop_land_management", linkParamArr, "Land Management");
                        } else {
                            parent.postMessage(postParam, "*");
                        }
                    }
                }
            }],
            credits: { enabled: false },
        });
    }
}

// First Page Table
function landAcquisitionTable(data, yearFilter, monthFilter) {

    let latestYear = null;
    let latestMonth = null;
    let latestData = null;

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    if (yearFilter === "all") {
        if (monthFilter === "all") {
            for (let year in data) {
                if (!isNaN(year)) {
                    for (let month in data[year]) {
                        if (months.includes(month)) {
                            if (latestYear === null || year > latestYear || (year === latestYear && months.indexOf(month) > months.indexOf(latestMonth))) {
                                latestYear = year;
                                latestMonth = month;
                                latestData = data[year][month];
                            }
                        }
                    }
                }
            }
        }   
    } else {
        if (!data.hasOwnProperty(yearFilter)) {
            return;
        }

        if (monthFilter === "all") {
            for (let month in data[yearFilter]) {
                if (months.includes(month)) {
                    if (latestMonth === null || months.indexOf(month) > months.indexOf(latestMonth)) {
                        latestMonth = month;
                        latestData = data[yearFilter][month];
                    }
                }
            }
        } else {
            latestData = data[yearFilter][monthFilter];
        }
    }

    var yearData = '';
    var monthData = '';

    if (yearFilter === "all") {
        yearData = '';
    } else {
        const monthNames = {
            Jan: "01",
            Feb: "02",
            Mar: "03",
            Apr: "04",
            May: "05",
            Jun: "06",
            Jul: "07",
            Aug: "08",
            Sep: "09",
            Oct: "10",
            Nov: "11",
            Dec: "12"
        };
    
        if (monthFilter === "all") {
            monthData = '';
        } else {
            monthData = monthNames[monthFilter] ? monthNames[monthFilter] : '';
        }
    
        yearData = yearFilter;
    }

    if (!latestData || Object.keys(latestData).length === 0) {
        const noDataHTML = '<tr><td colspan="5"><center>No Data Available</center></td></tr>';
        ["overallTBody", "lawas01TBody", "lawas02TBody", "limbang01TBody", "limbang02TBody", "limbang03TBody"].forEach(id => {
            $("#" + id).html(noDataHTML);
        });
        return;
    }

    const sectionToTBody = {
        "": "overallTBody",
        "LW 1": "lawas01TBody",
        "LAW01": "lawas01TBody",
        "LW 2": "lawas02TBody",
        "LAW02": "lawas02TBody",
        "LB 1": "limbang01TBody",
        "LIM01": "limbang01TBody",
        "LB 2": "limbang02TBody",
        "LIM02": "limbang02TBody",
        "LB 3": "limbang03TBody",
        "LIM03": "limbang03TBody"
    };

    for (const section in latestData) {
        const tBody = sectionToTBody[section];
        const tData = latestData[section] || {};
        
        $("#" + tBody).html("");

        const cumuStatKM = tData.cumulativeStatusKM ? tData.cumulativeStatusKM : 0;
        const cumuBalStatKM = tData.cumulativeBalStatusKM ? tData.cumulativeBalStatusKM : 0;
        const cumuDisputeKM = tData.cumulativeDisputeKM ? tData.cumulativeDisputeKM : 0;
        const totalOverall = cumuStatKM + cumuBalStatKM;

        let chartTBodyHTML = '';

        if (totalOverall === 0) {
            chartTBodyHTML += '<tr><td colspan="5"><center>No Data Available</center></td></tr>';
        } else {
            const roundedStatusPercent = Math.round((cumuStatKM / totalOverall) * 100);
            const roundedBalStatusPercent = Math.round((cumuBalStatKM / totalOverall) * 100);
            const roundedDisputePercent = Math.round((cumuDisputeKM / totalOverall) * 100);
            const roundedToTwoDecimals = totalOverall.toFixed(1);
            const roundedcumuBalStatKM = cumuBalStatKM.toFixed(1);

            chartTBodyHTML += `
                <tr>
                    <td>Land Acquisition Status</td>
                    <td onclick="openConOpDashboardLand('${yearData}', '${monthData}')">${cumuStatKM}</td>
                    <td onclick="openConOpDashboardLand('${yearData}', '${monthData}')">${roundedStatusPercent} %</td>
                    <td onclick="openConOpDashboardLand('${yearData}', '${monthData}')">${roundedcumuBalStatKM}</td>
                    <td onclick="openConOpDashboardLand('${yearData}', '${monthData}')">${roundedBalStatusPercent} %</td>
                </tr>
                <tr>
                    <td>Land Disputed</td>
                    <td onclick="openConOpDashboardLand('${yearData}', '${monthData}')">${cumuDisputeKM}</td>
                    <td onclick="openConOpDashboardLand('${yearData}', '${monthData}')">${roundedDisputePercent} %</td>
                    <td class="landColor"></td>
                    <td class="landColor"></td>
                </tr>
                <tr>
                    <td><b>Total Overall (KM)</b></td>
                    <td colspan="4" onclick="openConOpDashboardLand('${yearData}', '${monthData}')"><center>${roundedToTwoDecimals}</center></td>
                </tr>
            `;
        }

        $("#" + tBody).html(chartTBodyHTML);
    }
}

// Second Page Land Summary
function updateSynopsis(data, allData){
    let landTbHTML = '';
    $("#landSynopsis").html("");

    var year = (allData && allData.year) ? allData.year : '';
    var month = (allData && allData.month) ? allData.month : '';

    data.forEach(function(ele,idx){
        landTbHTML += '<div class="paragraph" ><i class="fa-solid fa-chart-column"></i><p><span style="cursor: pointer;" onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')">'+ele+'</p></div>'; 
    })

    $("#landSynopsis").html(landTbHTML);  
}

// Second Page Land Database - Year and Month Filter
function updateLandDatabase(data, yearFilter, monthFilter) {

    let latestYear = null;
    let latestMonth = null;
    let latestData = null;

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    if (yearFilter === "all") {
        if (monthFilter === "all") {
            for (let year in data) {
                if (!isNaN(year)) {
                    for (let month in data[year]) {
                        if (months.includes(month)) {
                            if (data[year][month] && data[year][month]['landDatabase']) {
                                if (latestYear === null || year > latestYear || (year === latestYear && months.indexOf(month) > months.indexOf(latestMonth))) {
                                    latestYear = year;
                                    latestMonth = month;
                                    latestData = data[year][month]['landDatabase'];
                                }
                            }
                        }
                    }
                }
            }
        }
    } else {
        if (!data.hasOwnProperty(yearFilter)) {
            return;
        }

        if (monthFilter === "all") {
            for (let month in data[yearFilter]) {
                if (months.includes(month)) {
                    if (data[yearFilter][month] && data[yearFilter][month]['landDatabase']) {
                        if (latestMonth === null || months.indexOf(month) > months.indexOf(latestMonth)) {
                            latestMonth = month;
                            latestData = data[yearFilter][month]['landDatabase'];
                        }
                    }
                }
            }
        } else {
            latestData = data[yearFilter][monthFilter] && data[yearFilter][monthFilter]['landDatabase'] ? data[yearFilter][monthFilter]['landDatabase'] : null;
        }
    }

    if (!latestData) {
        latestData = [];
    }

    var yearData = '';
    var monthData = '';

    const monthNames = {
        Jan: "01",
        Feb: "02",
        Mar: "03",
        Apr: "04",
        May: "05",
        Jun: "06",
        Jul: "07",
        Aug: "08",
        Sep: "09",
        Oct: "10",
        Nov: "11",
        Dec: "12"
    };

    if (yearFilter === "all") {
        yearData = latestYear;
        monthData = monthNames[latestMonth];
    } else {
        if (monthFilter === "all") {
            monthData = '';
        } else {
            monthData = monthNames[monthFilter] ? monthNames[monthFilter] : '';
        }
    
        yearData = yearFilter;
    }

    $("#landDatabaseHead").html("");
    $("#landDatabaseBody").html("");

    var catArr = [];
    var sectionArr = [];

    let databaseHeadTbHTML = '';
    let databaseBodyTbHTML = '';

    const sectionMapping = {
        "Limbang 1": "LIM01",
        "Limbang 01": "LIM01",
        "Limbang 2": "LIM02",
        "Limbang 02": "LIM02",
        "Limbang 3": "LIM03",
        "Limbang 03": "LIM03",
        "Lawas 1": "LAW01",
        "Lawas 01": "LAW01",
        "Lawas 2": "LAW02",
        "Lawas 02": "LAW02"
    };

    const sectionOrder = ["LIM01", "LIM02", "LIM03", "LAW01", "LAW02"];

    if (latestData) {
        for (const [idx, ele] of Object.entries(latestData)) {
            catArr.push(idx);
            for (const [idx2, ele2] of Object.entries(ele)) {
                if (!sectionArr.includes(idx2)) {
                    sectionArr.push(idx2);
                }
            }
        }

        let mappedSections = sectionArr.map(section => sectionMapping[section] || section);
        mappedSections.sort((a, b) => sectionOrder.indexOf(a) - sectionOrder.indexOf(b));

        // FOR Table Header
        databaseHeadTbHTML += '<tr>';
        databaseHeadTbHTML += '<th style="text-align: center;">Category</th>';
        for (const section of mappedSections) {
            databaseHeadTbHTML += '<th style="text-align: center;">' + section + '</th>';
        }
        databaseHeadTbHTML += '<th style="text-align: center;">Total</th>';
        databaseHeadTbHTML += '</tr>';

        // FOR Table Body
        for (const category of catArr) {
            let total = 0;
            databaseBodyTbHTML += '<tr>';
            databaseBodyTbHTML += '<td style="text-align: center;">' + category + '</td>';
            for (const section of mappedSections) {
                const originalSection = sectionArr.find(key => sectionMapping[key] === section);
                const value = latestData[category][originalSection] || 0;
                databaseBodyTbHTML += `<td onclick="openConOpDashboardLandTimeData('${yearData}', '${monthData}', 'Database')" style="text-align: center;">` + value + `</td>`;
                total += parseFloat(value);
            }
            databaseBodyTbHTML += `<td onclick="openConOpDashboardLandTimeData('${yearData}', '${monthData}' , 'Database')" style="text-align: center;">` + total + `</td>`;
            databaseBodyTbHTML += '</tr>';
        }

        $("#landDatabaseHead").html(databaseHeadTbHTML);
        $("#landDatabaseBody").html(databaseBodyTbHTML);
    }
}

// Third Page Land Timeline
function updateLandTimeline(data, yearFilter, monthFilter) {
    let latestYear = null;
    let latestMonth = null;
    let latestData = null;

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    if (yearFilter === "all") {
        if (monthFilter === "all") {
            for (let year in data) {
                if (!isNaN(year)) {
                    for (let month in data[year]) {
                        if (months.includes(month)) {
                            if (data[year][month] && data[year][month]['landTimeline']) {
                                if (latestYear === null || year > latestYear || (year === latestYear && months.indexOf(month) > months.indexOf(latestMonth))) {
                                    latestYear = year;
                                    latestMonth = month;
                                    latestData = data[year][month]['landTimeline'];
                                }
                            }
                        }
                    }
                }
            }
        }
    } else {
        if (!data.hasOwnProperty(yearFilter)) {
            return;
        }

        if (monthFilter === "all") {
            for (let month in data[yearFilter]) {
                if (months.includes(month)) {
                    if (data[yearFilter][month] && data[yearFilter][month]['landTimeline']) {
                        if (latestMonth === null || months.indexOf(month) > months.indexOf(latestMonth)) {
                            latestMonth = month;
                            latestData = data[yearFilter][month]['landTimeline'];
                        }
                    }
                }
            }
        } else {
            latestData = data[yearFilter][monthFilter] && data[yearFilter][monthFilter]['landTimeline'] ? data[yearFilter][monthFilter]['landTimeline'] : null;
        }
    }

    if (!latestData) {
        latestData = [];
    }

    var yearData1 = '';
    var monthData1 = '';

    const monthNames = {
        Jan: "01",
        Feb: "02",
        Mar: "03",
        Apr: "04",
        May: "05",
        Jun: "06",
        Jul: "07",
        Aug: "08",
        Sep: "09",
        Oct: "10",
        Nov: "11",
        Dec: "12"
    };

    if (yearFilter === "all") {
        yearData1 = latestYear;
        monthData1 = monthNames[latestMonth];
    } else {
        if (monthFilter === "all") {
            monthData1 = '';
        } else {
            monthData1 = monthNames[monthFilter] ? monthNames[monthFilter] : '';
        }
    
        yearData1 = yearFilter;
    }

    let timeHeadTbHTML = '';
    let timeBodyTbHTML = '';

    $("#timelineHead").html("");
    $("#timelineBody").html("");

    flagThFirst = false;
    flagMilestonesFirst = false;
    flagMilestonesSecond = false;
    flagMilestonesLast = false;
    flagEventFirst = false;
    flagEventSecond = false;
    flagHaveAssump = false;

    var dateAssumpt = '';
    var textAssumpt = '';
    var indicatorAssumpt = '';
    var indicatorAssumpt = '';
    var indicatorClass = '';
    var indicatorFixed = '';

    var count = 0;
    var lengthData = (latestData && latestData.data) ? (latestData.data).length : 0;
    var eleCount = 0;

    if (latestData && Array.isArray(latestData.data)) {
        let uniqueMonthTimelines = new Map();
        let currentColumn = 1;

        // FIRST LOOP IS FOR THE HEADER
        for (const ele of latestData.data) {
            eleCount++;
            var createDate = new Date(ele.year + "-" + ele.month + "-01");
            var createYear = createDate.getFullYear();
            var createMonth = createDate.getMonth();
            var mthYr = monthNumtoHalftext[ele.month] + ' ' + ele.year;
            var monthCheck = "";

            if (ele.month_timeline) {
                monthCheck = ele.month_timeline;

                if (!uniqueMonthTimelines.has(monthCheck)) {
                    uniqueMonthTimelines.set(monthCheck, currentColumn);
                    currentColumn++;

                    if (!flagThFirst) {
                        timeHeadTbHTML += '<tr>';
                        timeHeadTbHTML += '<th></th>';
                        flagThFirst = true;
                    }
                    timeHeadTbHTML += '<th>' + monthCheck + '</th>';
                }
            }
        }
        if (flagThFirst) {
            timeHeadTbHTML += '</tr>';
        }

        // FIRST LOOP FOR THE BODY
        let totalColumns = uniqueMonthTimelines.size;
        let rowCells = Array(totalColumns).fill('<td></td>');

        flagThFirst = false;
        currentColumn = 1;
        uniqueMonthTimelines.clear();
        for (const ele of latestData.data) {
            let useMonthYear = monthNumtoHalftext[ele.month] + ' ' + ele.year;
            monthCheck = ele.month_timeline;

            if (ele.month_timeline) {
                if (!flagThFirst) {
                    if (!uniqueMonthTimelines.has(monthCheck)) {
                        timeHeadTbHTML += '<tr>'
                        timeHeadTbHTML += '<th></th>'
                        timeHeadTbHTML += '<th>' + useMonthYear + '</th>'

                        flagThFirst = true;
                        uniqueMonthTimelines.set(monthCheck, currentColumn);
                        currentColumn++;
                    }
                } else {
                    if (!uniqueMonthTimelines.has(monthCheck)) {
                        timeHeadTbHTML += '<th>' + useMonthYear + '</th>'
                        uniqueMonthTimelines.set(monthCheck, currentColumn);
                        currentColumn++;
                    }
                }
            }
        }

        currentColumn = 1;
        uniqueMonthTimelines.clear();
        let columnMilestones = new Map();
        
        for (const ele of latestData.data) {
            let milesVal = '';
        
            if (ele.month_timeline) {
                let monthCheck = ele.month_timeline;
        
                if (!uniqueMonthTimelines.has(monthCheck)) {
                    uniqueMonthTimelines.set(monthCheck, currentColumn);
                    currentColumn++;
        
                    if (ele.milestone === "Construction") {
                        milesVal = ele.milestone;
                    } else {
                        milesVal = '';
                    }
        
                    columnMilestones.set(monthCheck, milesVal);
                } else {
                    if (ele.milestone === "Construction") {
                        columnMilestones.set(monthCheck, ele.milestone);
                    }
                }
            }
        }
        
        timeBodyTbHTML += '<tr>';
        rowCells = Array(currentColumn).fill('<td></td>');
        let currentMilestone = null;
        let milestoneCount = 1;
        let milestoneStartIndex = null;
        
        for (const [month, milestone] of columnMilestones.entries()) {
            let columnIndex = uniqueMonthTimelines.get(month);
        
            if (milestone === currentMilestone && columnIndex === milestoneStartIndex + milestoneCount) {
                milestoneCount++;
            } else {
                if (currentMilestone) {
                    let cellContent = '<td' +
                        (milestoneCount > 1 ? ' colspan="' + milestoneCount + '"' : '') +
                        ' style="background-color: yellow; text-align: center;" onclick="openConOpDashboardLandTimeData(\'' + yearData1 + '\' , \'' + monthData1 + '\', \'Timeline\')">' + currentMilestone + '</td>';
                    rowCells[milestoneStartIndex] = cellContent;
                    for (let i = 1; i < milestoneCount; i++) {
                        rowCells[milestoneStartIndex + i] = '';
                    }
                }
                currentMilestone = milestone;
                milestoneCount = 1;
                milestoneStartIndex = columnIndex;
            }
        }
        
        // Handle the last milestone
        if (currentMilestone) {
            let cellContent = '<td' +
                (milestoneCount > 1 ? ' colspan="' + milestoneCount + '"' : '') +
                ' style="background-color: yellow; text-align: center;" onclick="openConOpDashboardLandTimeData(\'' + yearData1 + '\' , \'' + monthData1 + '\', \'Timeline\')">' + currentMilestone + '</td>';
            rowCells[milestoneStartIndex] = cellContent;
            for (let i = 1; i < milestoneCount; i++) {
                rowCells[milestoneStartIndex + i] = '';
            }
        }
        
        timeBodyTbHTML += rowCells.join('') + '</tr>';
        currentColumn = 1;
        uniqueMonthTimelines.clear();
        for (const ele of latestData.data) {
            var milesWords = (ele.milestone) ? ele.milestone : 'N/A';
            var milesVal = '';
            monthCheck = ele.month_timeline;

            if (!uniqueMonthTimelines.has(monthCheck)) {
                if (ele.milestone == "LAP Submission" || ele.milestone == "Funds Available") {
                    milesVal = ele.milestone;
                } else {
                    milesVal = '';
                }
                    
                if (milesWords) {
                    if (!flagMilestonesSecond) {
                        timeBodyTbHTML += '<tr>'
                        timeBodyTbHTML += '<th>KEY LAND MILESTONES</th>'

                        flagMilestonesSecond = true;
                    }
                    timeBodyTbHTML += '<td onclick="openConOpDashboardLandTimeData(\'' + yearData1 + '\' , \'' + monthData1 + '\', \'Timeline\')">' + milesVal + '</td>'
                }
                uniqueMonthTimelines.set(monthCheck, currentColumn);
                currentColumn++;
            }
        }
        timeBodyTbHTML += '</tr>'
        timeBodyTbHTML += '<tr>'
        timeBodyTbHTML += '<th>LAND ACQUISITION STAGE 1 (LAND ACQUISITION STATUS) - 88KM</th>'

        rowCells = Array(totalColumns).fill('<td></td>');

        let currentEvent = null;
        let eventCount = 0;
        let eventStartIndex = null;

        for (const ele of latestData.data) {
            let eventWords = ele.event ? ele.event : 'N/A';
            let monthCheck = ele.month_timeline;

            if (ele.milestone === "Land Acquisition Stage 1 (Land Acquisition Status) - 88KM") {
                let columnIndex = uniqueMonthTimelines.get(monthCheck) - 1;

                if (currentEvent === eventWords && columnIndex === eventStartIndex + eventCount) {
                    eventCount++;
                } else {
                    if (currentEvent) {
                        let bgColor = '';
                        if (currentEvent === "Land Acquisition and Compensation") {
                            bgColor = 'skyblue';
                        } else if (currentEvent === "Notice Pemberitahuan Awal (NPA)") {
                            bgColor = 'lightgreen';
                        } else if (currentEvent === "Query Session") {
                            bgColor = 'orange';
                        } else if (currentEvent === "Enforcement by Authority" || currentEvent === "Notice to Quit from Authority (NTQ)") {
                            bgColor = 'mediumseagreen';
                        }

                        let cellContent = '<td' + 
                                        (eventCount > 1 ? ' colspan="' + eventCount + '"' : '') + 
                                        (bgColor ? ' style="background-color: ' + bgColor + '; text-align: center;"' : ' style="text-align: center;"') +
                                        ' onclick="openConOpDashboardLandTimeData(\'' + yearData1 + '\' , \'' + monthData1 + '\', \'Timeline\')">' + currentEvent + '</td>';
                        rowCells[eventStartIndex] = cellContent;
                        for (let i = 1; i < eventCount; i++) {
                            rowCells[eventStartIndex + i] = '';
                        }
                    }
                    currentEvent = eventWords;
                    eventCount = 1;
                    eventStartIndex = columnIndex;
                }
            }
        }

        if (currentEvent) {
            let bgColor = '';
            if (currentEvent === "Land Acquisition and Compensation") {
                bgColor = 'skyblue';
            } else if (currentEvent === "Notice Pemberitahuan Awal (NPA)") {
                bgColor = 'lightgreen';
            } else if (currentEvent === "Query Session") {
                bgColor = 'orange';
            } else if (currentEvent === "Enforcement by Authority" || currentEvent === "Notice to Quit from Authority (NTQ)") {
                bgColor = 'mediumseagreen';
            }

            let cellContent = '<td' + 
                            (eventCount > 1 ? ' colspan="' + eventCount + '"' : '') + 
                            (bgColor ? ' style="background-color: ' + bgColor + '; text-align: center;"' : ' style="text-align: center;"') +
                            ' onclick="openConOpDashboardLandTimeData(\'' + yearData1 + '\' , \'' + monthData1 + '\', \'Timeline\')">' + currentEvent + '</td>';
            rowCells[eventStartIndex] = cellContent;
            for (let i = 1; i < eventCount; i++) {
                rowCells[eventStartIndex + i] = '';
            }
        }

        // Build the final table body row
        timeBodyTbHTML += rowCells.join('') + '</tr>';
        timeBodyTbHTML += '<tr>'
        timeBodyTbHTML += '<th>LAND ACQUISITION STAGE 2 (LAND DISPUTED) - 88KM</th>'

        rowCells = Array(totalColumns).fill('<td></td>');
        currentEvent = null;
        eventCount = 0;
        eventStartIndex = null;
        flagEventSecond = false;
        
        for (const ele of latestData.data) {
            let eventWords = ele.event ? ele.event : '';
            let monthCheck = ele.month_timeline;
        
            if (ele.milestone === "Land Acquisition Stage 1 (Land Acquisition Status) - 88KM" || 
                ele.milestone === "LAP Submission" || 
                ele.milestone === "Funds Available") {
                continue;
            } else {
                if (eventWords) {
                    if (!flagEventSecond) {
                        flagEventSecond = true;
                    }
        
                    let columnIndex = uniqueMonthTimelines.get(monthCheck) - 1;
        
                    if (currentEvent === eventWords && columnIndex === eventStartIndex + eventCount) {
                        eventCount++;
                    } else {
                        if (currentEvent) {
                            let bgColor = '';
                            if (currentEvent === "Land Acquisition and Compensation") {
                                bgColor = 'skyblue';
                            } else if (currentEvent === "Notice Pemberitahuan Awal (NPA)") {
                                bgColor = 'lightgreen';
                            } else if (currentEvent === "Query Session") {
                                bgColor = 'orange';
                            } else if (currentEvent === "Enforcement by Authority" || currentEvent === "Notice to Quit from Authority (NTQ)") {
                                bgColor = 'mediumseagreen';
                            }
        
                            let cellContent = '<td' + 
                                              (eventCount > 1 ? ' colspan="' + eventCount + '"' : '') + 
                                              (bgColor ? ' style="background-color: ' + bgColor + '; text-align: center;"' : ' style="text-align: center;"') +
                                              ' onclick="openConOpDashboardLandTimeData(\'' + yearData1 + '\' , \'' + monthData1 + '\', \'Timeline\')">' + currentEvent + '</td>';
                            rowCells[eventStartIndex] = cellContent;
                            for (let i = 1; i < eventCount; i++) {
                                rowCells[eventStartIndex + i] = '';
                            }
                        }
                        currentEvent = eventWords;
                        eventCount = 1;
                        eventStartIndex = columnIndex;
                    }
                }
            }
        }
        
        if (currentEvent) {
            let bgColor = '';
            if (currentEvent === "Land Acquisition and Compensation") {
                bgColor = 'skyblue';
            } else if (currentEvent === "Notice Pemberitahuan Awal (NPA)") {
                bgColor = 'lightgreen';
            } else if (currentEvent === "Query Session") {
                bgColor = 'orange';
            } else if (currentEvent === "Enforcement by Authority" || currentEvent === "Notice to Quit from Authority (NTQ)") {
                bgColor = 'mediumseagreen';
            }
        
            let cellContent = '<td' + 
                              (eventCount > 1 ? ' colspan="' + eventCount + '"' : '') + 
                              (bgColor ? ' style="background-color: ' + bgColor + '; text-align: center;"' : ' style="text-align: center;"') +
                              ' onclick="openConOpDashboardLandTimeData(\'' + yearData1 + '\' , \'' + monthData1 + '\', \'Timeline\')">' + currentEvent + '</td>';
            rowCells[eventStartIndex] = cellContent;
            for (let i = 1; i < eventCount; i++) {
                rowCells[eventStartIndex + i] = '';
            }
        }
        
        timeBodyTbHTML += rowCells.join('') + '</tr>';
        timeBodyTbHTML += '<td class="indicatorData"></td>';

        currentColumn = 1;
        uniqueMonthTimelines.clear();
        for (const [idx, ele] of Object.entries(latestData.data)) {
            eleCount++;
            var createDate = new Date(ele.year + "-" + ele.month + "-01");
            var createYear = createDate.getFullYear();
            var createMonth = createDate.getMonth() + 1;

            let assumptions = [];

            if (latestData.assumption) {
                for (const [idx2, ele2] of Object.entries(latestData.assumption)) {
                    var createDate2 = new Date(ele2.date);
                    var createYear2 = createDate2.getFullYear();
                    var createMonth2 = createDate2.getMonth() + 1;
                    var createDay2 = createDate2.getDate();

                    if ((createYear == createYear2) && (createMonth == createMonth2)) {
                        var createMonthNeedChange = createDate2.getMonth() + 1;
                        var dateAssumpt = createDay2 + '/' + createMonthNeedChange + '/' + createYear2;
                        var textAssumpt = ele2.target_assumption;

                        var indicatorClass = '';
                        if (createDay2 == 1) {
                            indicatorClass = 'early';
                        } else if (createDay2 == 30 || createDay2 == 31 || createDay2 == 28 || createDay2 == 29) {
                            indicatorClass = 'late';
                        } else {
                            indicatorClass = 'mid';
                        }

                        var indicatorFixed = '';
                        if (eleCount == lengthData) {
                            indicatorFixed = 'fixed';
                        }

                        assumptions.push({
                            dateAssumpt: dateAssumpt,
                            textAssumpt: textAssumpt,
                            indicatorClass: indicatorClass,
                            indicatorFixed: indicatorFixed
                        });

                        flagHaveAssump = true;
                    }
                }
            }

            if (ele.month_timeline) {
                let indicatorAssumpt = '';
                if (flagHaveAssump) {
                    indicatorAssumpt = assumptions.map(assumption => 
                        `<div class="indicator ${assumption.indicatorClass} ${assumption.indicatorFixed}" onclick="openConOpDashboardLandTimeData('${yearData1}' , '${monthData1}', 'Timeline')">
                            <i class="fa-sharp fa-solid fa-arrow-down"></i>
                            <div class="text" title="${assumption.textAssumpt} : ${assumption.dateAssumpt}"><div>${assumption.textAssumpt}<br>${assumption.dateAssumpt}</div></div>
                        </div>`
                    ).join('');
                }

                monthCheck = ele.month_timeline;
                if (!uniqueMonthTimelines.has(monthCheck)) {
                    timeBodyTbHTML += '<td class="indicatorData">' + indicatorAssumpt + '</td>';
                    uniqueMonthTimelines.set(monthCheck, currentColumn);
                    currentColumn++;
                } else {
                    timeBodyTbHTML = timeBodyTbHTML.replace(
                        `<td class="indicatorData">${uniqueMonthTimelines.get(monthCheck)}</td>`,
                        `<td class="indicatorData">${uniqueMonthTimelines.get(monthCheck)}${indicatorAssumpt}</td>`
                    );
                }
            }
            flagHaveAssump = false;
            count++;
        }
        timeBodyTbHTML += '</tr>'
    }

    $("#timelineHead").html(timeHeadTbHTML);
    $("#timelineBody").html(timeBodyTbHTML);

    $(".indicatorData:empty").css('visibility', 'hidden')
}

// Third Page Land Management Report
function updateTableLMRSection(currData, prevData, ttlCurrData, ttlPrevData, allData, allDataPrev){
    var tempArr = [];
    var arrayForTable = [];
    let lmrSectionTbHTML = '';
    let lmrFootTbHTML = '';

    $("#lmrSectionTable").html("");
    $("#lmrFootTable").html("");

    var year = (allData && allData.year) ? allData.year : '';
    var month = (allData && allData.month) ? allData.month : '';

    var yearPrev = (allDataPrev && allDataPrev.year) ? allDataPrev.year : '';
    var monthPrev = (allDataPrev && allDataPrev.month) ? allDataPrev.month : '';

    if(currData){
        for (const [idx, ele] of Object.entries(currData)) {
            if (!tempArr[idx]) tempArr[idx] = [];
            if (!tempArr[idx]['current']) tempArr[idx]['current'] = [];
            tempArr[idx]['current'].push(ele);
        }
    }

    if(prevData){
        for (const [idx, ele] of Object.entries(prevData)) {
            if (!tempArr[idx]) tempArr[idx] = [];
            if (!tempArr[idx]['previous']) tempArr[idx]['previous'] = [];
            tempArr[idx]['previous'].push(ele);
        }
    }

    for (const [idx, ele] of Object.entries(tempArr)) {
        for (const [idx2, ele2] of Object.entries(ele)) {
            //idx2 = current / previous
            if(idx2 == 'current'){
                for (const [idx3, ele3] of Object.entries(ele2)) {
                    if (!arrayForTable[idx]) arrayForTable[idx] = [];

                    // for # of issues
                    if (!arrayForTable[idx]['unresolvedIssue']) arrayForTable[idx]['unresolvedIssue'] = [];
                    if (!arrayForTable[idx]['unresolvedIssue']['current']) arrayForTable[idx]['unresolvedIssue']['current'] = [];

                    var unresolvedIssue = (ele3.unresolved_issues) ? ele3.unresolved_issues : 0;

                    arrayForTable[idx]['unresolvedIssue']['current'].push(unresolvedIssue);

                    if (!arrayForTable[idx]['newIssue']) arrayForTable[idx]['newIssue'] = [];
                    if (!arrayForTable[idx]['newIssue']['current']) arrayForTable[idx]['newIssue']['current'] = [];

                    var newIssue = (ele3.new_issues) ? ele3.new_issues : 0;

                    arrayForTable[idx]['newIssue']['current'].push(newIssue);

                    if (!arrayForTable[idx]['solvedIssue']) arrayForTable[idx]['solvedIssue'] = [];
                    if (!arrayForTable[idx]['solvedIssue']['current']) arrayForTable[idx]['solvedIssue']['current'] = [];

                    var solvedIssue = (ele3.solved_issues) ? ele3.solved_issues : 0;
                   
                    arrayForTable[idx]['solvedIssue']['current'].push(solvedIssue);

                    if (!arrayForTable[idx]['balCumulative']) arrayForTable[idx]['balCumulative'] = [];
                    if (!arrayForTable[idx]['balCumulative']['current']) arrayForTable[idx]['balCumulative']['current'] = [];

                    var balCumulative = (ele3.bal_cumulative) ? ele3.bal_cumulative : 0;

                    arrayForTable[idx]['balCumulative']['current'].push(balCumulative);

                    if (!arrayForTable[idx]['balCumulativeResolve']) arrayForTable[idx]['balCumulativeResolve'] = [];
                    if (!arrayForTable[idx]['balCumulativeResolve']['current']) arrayForTable[idx]['balCumulativeResolve']['current'] = [];

                    var balCumulativeResolve = (ele3.bal_cumulative_resolved) ? ele3.bal_cumulative_resolved : 0;

                    arrayForTable[idx]['balCumulativeResolve']['current'].push(balCumulativeResolve);

                    if (!arrayForTable[idx]['balCumulativeOpen']) arrayForTable[idx]['balCumulativeOpen'] = [];
                    if (!arrayForTable[idx]['balCumulativeOpen']['current']) arrayForTable[idx]['balCumulativeOpen']['current'] = [];

                    var balCumulativeOpen = (ele3.bal_unresolved_issues) ? ele3.bal_unresolved_issues : 0;

                    arrayForTable[idx]['balCumulativeOpen']['current'].push(balCumulativeOpen);
                }
            }

            else if(idx2 == 'previous'){
                for (const [idx4, ele4] of Object.entries(ele2)) {
                    if (!arrayForTable[idx]) arrayForTable[idx] = [];

                    // for # of issues
                    if (!arrayForTable[idx]['unresolvedIssue']) arrayForTable[idx]['unresolvedIssue'] = [];
                    if (!arrayForTable[idx]['unresolvedIssue']['previous']) arrayForTable[idx]['unresolvedIssue']['previous'] = [];
                    
                    // var unresolvedIssue = (ele4.unresolved_issues) ? ele4.unresolved_issues : 0;
                    var cumulUnresolvedIssue = (ele4.bal_unresolved_issues	) ? ele4.bal_unresolved_issues	 : 0;

                    arrayForTable[idx]['unresolvedIssue']['previous'].push(cumulUnresolvedIssue);

                    if (!arrayForTable[idx]['newIssue']) arrayForTable[idx]['newIssue'] = [];
                    if (!arrayForTable[idx]['newIssue']['previous']) arrayForTable[idx]['newIssue']['previous'] = [];

                    var newIssue = (ele4.new_issues) ? ele4.new_issues : 0;

                    arrayForTable[idx]['newIssue']['previous'].push(newIssue);

                    if (!arrayForTable[idx]['solvedIssue']) arrayForTable[idx]['solvedIssue'] = [];
                    if (!arrayForTable[idx]['solvedIssue']['previous']) arrayForTable[idx]['solvedIssue']['previous'] = [];

                    var cumulsolvedIssue = (ele4.bal_cumulative_resolved) ? ele4.bal_cumulative_resolved : 0;
                    // var solvedIssue = (ele4.solved_issues) ? ele4.solved_issues : 0;

                    arrayForTable[idx]['solvedIssue']['previous'].push(cumulsolvedIssue);

                    if (!arrayForTable[idx]['balCumulative']) arrayForTable[idx]['balCumulative'] = [];
                    if (!arrayForTable[idx]['balCumulative']['previous']) arrayForTable[idx]['balCumulative']['previous'] = [];

                    var balCumulative = (ele4.bal_cumulative) ? ele4.bal_cumulative : 0;

                    arrayForTable[idx]['balCumulative']['previous'].push(balCumulative);
                }
            }
        }
    }

    var prevTotalCumulative = 0;
    var prevTotalIssueResolve = 0;
    var prevTotalOpen = 0;
    var currTotalNewIssue = 0;
    var currTotalIssueResolve = 0;
    var currTotalIssueOpen = 0;
    var currTotalCumulative = 0;
    var currTotalCumulativeResolve = 0;
    var currTotalCumulativeOpen = 0;

    //LAST LOOP FOR TABLE
    for (const [idx, ele] of Object.entries(arrayForTable)) {

        for (const [idx2, ele2] of Object.entries(ele)) {

            if(idx2 == 'unresolvedIssue'){
                var prevIssueNo = (ele2['previous'] && ele2['previous'][0]) ? ele2['previous'][0] : 0;
                var currIssueNo = (ele2['current'] && ele2['current'][0]) ? ele2['current'][0] : 0;
                currTotalIssueOpen += parseInt(currIssueNo);
                prevTotalOpen += parseInt(prevIssueNo);
            }

            if(idx2 == 'newIssue'){
                var prevNewIssue = (ele2['previous'] && ele2['previous'][0]) ? ele2['previous'][0] : 0;
                var currNewIssue = (ele2['current'] && ele2['current'][0]) ? ele2['current'][0] : 0;
                currTotalNewIssue += parseInt(currNewIssue);
            }

            if(idx2 == 'solvedIssue'){
                var prevSolvedIssue = (ele2['previous'] && ele2['previous'][0]) ? ele2['previous'][0] : 0;
                var currSolvedIssue = (ele2['current'] && ele2['current'][0]) ? ele2['current'][0] : 0;
                prevTotalIssueResolve += parseInt(prevSolvedIssue);
                currTotalIssueResolve += parseInt(currSolvedIssue);
            }

            if(idx2 == 'balCumulative'){
                var prevBalUnresolvedIssue = (ele2['previous'] && ele2['previous'][0]) ? ele2['previous'][0] : 0;
                var currBalUnresolvedIssue = (ele2['current'] && ele2['current'][0]) ? ele2['current'][0] : 0;
                currTotalCumulative += parseInt(currBalUnresolvedIssue);
                prevTotalCumulative += parseInt(prevBalUnresolvedIssue);
            }

            if(idx2 == 'balCumulativeResolve'){
                var currBalCumulativeResolve = (ele2['current'] && ele2['current'][0]) ? ele2['current'][0] : 0;
                currTotalCumulativeResolve += parseInt(currBalCumulativeResolve);

            }

            if(idx2 == 'balCumulativeOpen'){
                var currBalCumulativeOpen = (ele2['current'] && ele2['current'][0]) ? ele2['current'][0] : 0;
                currTotalCumulativeOpen += parseInt(currBalCumulativeOpen);
            }
            
        }

        lmrSectionTbHTML += '<tr>';
        lmrSectionTbHTML += '<th>' + idx + '</th>';
        lmrSectionTbHTML += '<td onclick="openConOpDashboardLand(\'' + yearPrev + '\', \'' + monthPrev + '\')" style="text-align: center;">' + prevBalUnresolvedIssue + '</td>';
        lmrSectionTbHTML += '<td onclick="openConOpDashboardLand(\'' + yearPrev + '\', \'' + monthPrev + '\')" style="text-align: center;">' + prevSolvedIssue + '</td>';
        lmrSectionTbHTML += '<td onclick="openConOpDashboardLand(\'' + yearPrev + '\', \'' + monthPrev + '\')" style="text-align: center;">' + prevIssueNo + '</td>';
        lmrSectionTbHTML += '<td onclick="openConOpDashboardLand(\'' + year + '\', \'' + month + '\')" style="text-align: center;">' + currNewIssue + '</td>';
        lmrSectionTbHTML += '<td onclick="openConOpDashboardLand(\'' + year + '\', \'' + month + '\')" style="text-align: center;">' + currSolvedIssue + '</td>';
        lmrSectionTbHTML += '<td onclick="openConOpDashboardLand(\'' + year + '\', \'' + month + '\')" style="text-align: center;">' + currIssueNo + '</td>';
        lmrSectionTbHTML += '<td onclick="openConOpDashboardLand(\'' + year + '\', \'' + month + '\')" style="text-align: center;">' + (currBalUnresolvedIssue || 0) + '</td>';
        lmrSectionTbHTML += '<td onclick="openConOpDashboardLand(\'' + year + '\', \'' + month + '\')" style="text-align: center;">' + (currBalCumulativeResolve || 0) + '</td>';
        lmrSectionTbHTML += '<td onclick="openConOpDashboardLand(\'' + year + '\', \'' + month + '\')" style="text-align: center;">' + (currBalCumulativeOpen || 0) + '</td>';
        lmrSectionTbHTML += '</tr>';


    }

    $("#lmrSectionTable").html(lmrSectionTbHTML);

    //FOR FOOTER
    lmrFootTbHTML += '<tr>'
    lmrFootTbHTML += '<th>TOTAL</td>'
    lmrFootTbHTML += '<td onclick="openConOpDashboardLand(\''+yearPrev+'\', \''+monthPrev+'\')" style="text-align: center;">'+prevTotalCumulative+'</td>'
    lmrFootTbHTML += '<td onclick="openConOpDashboardLand(\''+yearPrev+'\', \''+monthPrev+'\')" style="text-align: center;">'+prevTotalIssueResolve+'</td>'
    lmrFootTbHTML += '<td onclick="openConOpDashboardLand(\''+yearPrev+'\', \''+monthPrev+'\')" style="text-align: center;">'+prevTotalOpen+'</td>'
    lmrFootTbHTML += '<td onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')" style="text-align: center;">'+currTotalNewIssue+'</td>'
    lmrFootTbHTML += '<td onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')" style="text-align: center;">'+currTotalIssueResolve+'</td>'
    lmrFootTbHTML += '<td onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')" style="text-align: center;">'+currTotalIssueOpen+'</td>'
    lmrFootTbHTML += '<td onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')" style="text-align: center;">'+currTotalCumulative+'</td>'
    lmrFootTbHTML += '<td onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')" style="text-align: center;">'+currTotalCumulativeResolve+'</td>'
    lmrFootTbHTML += '<td onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')" style="text-align: center;">'+currTotalCumulativeOpen+'</td>'
    lmrFootTbHTML += '</tr>';
    
    $("#lmrFootTable").html(lmrFootTbHTML);
}

// Fourth Page
function updateTableLandTrack(data, allData) {
    var lengthPackage = '';
    var lengthSection = '';
    var arrlength = [];
    var arrlengthSection = [];

    var flagFirstTr = false;
    var flagSecondTr = false;
    var flagThirdTrStart = false;
    var countHeadSec = 0;

    let landTrackHead = '';
    let landTrackingBody = '';

    $("#landTrackHead").html("");
    $("#landTrackingBody").html("");

    var year = (allData && allData.year) ? allData.year : '';
    var month = (allData && allData.month) ? allData.month : '';

    if (data.count) {
        for (const [idx, ele] of Object.entries(data.count)) {
            lengthPackage = Object.keys(ele).length;
            for (const [idx2, ele2] of Object.entries(ele)) {
                lengthSection = Object.keys(ele2).length;
                arrlength.push(lengthSection);
                ele2.sort();
                if (!arrlengthSection[idx2]) arrlengthSection[idx2] = [];
                arrlengthSection[idx2].push(...ele2);
            }
        }

        // Create table header
        if (!flagFirstTr) {
            landTrackHead += '<tr class="firstTr">'
                + '<th style="text-align: center;" rowspan="4">Critical Milestone</th>'
                + '<th style="text-align: center;" rowspan="4">Stage</th>';

            for (let i = 0; i < lengthPackage; i++) {
                var needToAdd = arrlength[i] + 1;
                landTrackHead += '<th style="text-align: center;" scope="col" colspan="' + needToAdd + '">% Completion (Stage)</th>';
            }

            landTrackHead += '<th style="text-align: center;" scope="col">% Completion (Stage)</th></tr>';
            flagFirstTr = true;
        }

        if (!flagSecondTr) {
            landTrackHead += '<tr class="secondTr">';
            for (const [idx3, ele3] of Object.entries(arrlengthSection)) {
                var lengthEach = Object.keys(ele3).length;
                var addForTotal = lengthEach + 1;
                landTrackHead += '<th style="text-align: center;" colspan="' + addForTotal + '">' + idx3 + '</th>';
            }
            landTrackHead += '<th style="text-align: center;" rowspan="3" id="ttlId_1">Total</th></tr>';
            flagSecondTr = true;
        }

        if (!flagThirdTrStart) {
            landTrackHead += '<tr class="thirdTr">';
            for (const [idx3, ele3] of Object.entries(arrlengthSection)) {
                countHeadSec++;
                for (const [idx4, ele4] of Object.entries(ele3)) {
                    landTrackHead += '<th style="text-align: center;">' + ele4 + '</th>';
                }
                landTrackHead += '<th style="text-align: center;" id="ttlSecId_' + countHeadSec + '">Total</th>';
            }
            landTrackHead += '</tr>';
            flagThirdTrStart = true;
        }

        // Create table body
        let rowspanCount = {};
        for (const [idx, ele] of Object.entries(data.data)) {
            for (const [idx2, ele2] of Object.entries(ele)) {
                if (!rowspanCount[idx]) {
                    rowspanCount[idx] = 0;
                }
                rowspanCount[idx]++;
            }
        }

        let idxTracker = {};
        for (const [idx, ele] of Object.entries(data.data)) {
            for (const [idx2, ele2] of Object.entries(ele)) {
                landTrackingBody += '<tr>';
                if (!idxTracker[idx]) {
                    idxTracker[idx] = 0;
                }

                if (idxTracker[idx] === 0) {
                    landTrackingBody += '<th rowspan="' + rowspanCount[idx] + '">' + idx + '</th>';
                }
                idxTracker[idx]++;
                landTrackingBody += '<th>' + idx2 + '</th>';

                let countToCalculate = 0;
                let ttlCompletionAll = 0;
                let ttlcompletion = 0;

                for (const [idx3, ele3] of Object.entries(ele2)) {
                    let totalCompletion = 0;
                    let countCompletion = 0;
                    countToCalculate++;
                    for (const [idxCompletion, eleCompletion] of Object.entries(ele3)) {
                        for (const [idx5, ele5] of Object.entries(eleCompletion)) {
                            for (const [idxLength, eleLength] of Object.entries(arrlengthSection)) {
                                if (idx3 == idxLength) {
                                    for (const [idxLength2, eleLength2] of Object.entries(eleLength)) {
                                        if (idxCompletion == eleLength2) {
                                            const compleProgress = ele5.completion_progress ? ele5.completion_progress : 0;
                                            totalCompletion += parseInt(compleProgress);
                                            landTrackingBody += '<th style="text-align: center;" onclick="openConOpDashboardLand(\'' + year + '\', \'' + month + '\')">' + compleProgress + '%</th>';
                                            break;
                                        }
                                    }
                                    break;
                                }
                            }
                            break;
                        }
                        countCompletion++;
                    }

                    let averageCompletion = 0;
                    if (countCompletion > 0) {
                        averageCompletion = Math.round(totalCompletion / countCompletion);
                    }
                    ttlCompletionAll += averageCompletion;
                    landTrackingBody += '<th style="text-align: center;">' + averageCompletion + '%</th>';
                }

                if (countToCalculate > 0) {
                    ttlcompletion = ttlCompletionAll / countToCalculate;
                } else {
                    ttlcompletion = 0;
                }

                landTrackingBody += '<th style="text-align: center;" onclick="openConOpDashboardLand(\'' + year + '\', \'' + month + '\')">' + ttlcompletion + '%</th>';
                landTrackingBody += '</tr>';
            }
        }
    }

    $("#landTrackHead").html(landTrackHead);
    $("#landTrackingBody").html(landTrackingBody);
}

function refreshInformation(proj = 'overall', year = 'all', month = 'all'){

    var dataYearMonth = "Month:" +month+ " - " + "Year:" +year;
    var landManage = (landData && landData.landManagement && landData.landManagement[proj]) ? landData.landManagement[proj] : [];
    var landTimelineDb = (landData && landData.landTimelineDatabase && landData.landTimelineDatabase[proj]) ? landData.landTimelineDatabase[proj] : [];
    var landAcquisition = (landData && landData.landAcquisitionData && landData.landAcquisitionData['overall']) ? landData.landAcquisitionData['overall'] : [];
    var allData = (landTimelineDb && landTimelineDb['all'] && landTimelineDb['all']['all'] && landTimelineDb['all']['all'].allData) ? landTimelineDb['all']['all'].allData : [];

    var currDate = new Date();

    if(year == 'all'){
        currYear = currDate.getFullYear();
        prevYear = currDate.getFullYear();

        currMonth = monthHalftext[currDate.getMonth() + 1];
        prevMonth = monthHalftext[currDate.getMonth()];

        if(prevMonth == 'Jan'){
            prevYear = currDate.getFullYear() - 1;
        }
    }
    else{
        currYear = year;
        prevYear = year;

        if(month == 'all'){
            currMonth = monthHalftext[currDate.getMonth() + 1];
            prevMonth = monthHalftext[currDate.getMonth()];
        }
        else{
            currMonth = month;
            prevMonth = monthHalfPrev[month];

            if(prevMonth == 'Dec'){
                prevYear = prevYear - 1;
            }
        }
    }

    setCutOffDateCurr(currYear, currMonth)
    setCutOffDatePrev(prevYear, prevMonth)

    var landId = (landData && landData.landManagement && landData.landManagement && landData.landManagement['idForEach'] && landData.landManagement['idForEach'][currYear] && landData.landManagement['idForEach'][currYear][currMonth]) ? landData.landManagement['idForEach'][currYear][currMonth] : [];
    var landIdPrev = (landData && landData.landManagement && landData.landManagement && landData.landManagement['idForEach'] && landData.landManagement['idForEach'][prevYear] && landData.landManagement['idForEach'][prevYear][prevMonth]) ? landData.landManagement['idForEach'][prevYear][prevMonth] : [];

    var allData = (landManage && landManage[currYear] && landManage[currYear][currMonth] && landManage[currYear][currMonth].allData) ? landManage[currYear][currMonth].allData : [];
    var allDataPrev = (landManage && landManage[prevYear] && landManage[prevYear][prevMonth] && landManage[prevYear][prevMonth].allData) ? landManage[prevYear][prevMonth].allData : [];

    var synopsisData = (landManage && landManage[currYear] && landManage[currYear][currMonth] && landManage[currYear][currMonth][landId] && landManage[currYear][currMonth][landId].synopsis) ? landManage[currYear][currMonth][landId].synopsis : [];
    updateSynopsis(synopsisData, allData);

    var lmrSectCurrData = (landManage && landManage[currYear] && landManage[currYear][currMonth] && landManage[currYear][currMonth][landId] && landManage[currYear][currMonth][landId]['lmr-section']) ? landManage[currYear][currMonth][landId]['lmr-section'] : [];
    var lmrSectPrevData = (landManage && landManage[prevYear] && landManage[prevYear][prevMonth] && landManage[prevYear][prevMonth][landIdPrev] && landManage[prevYear][prevMonth][landIdPrev]['lmr-section']) ? landManage[prevYear][prevMonth][landIdPrev]['lmr-section'] : [];
    
    var ttlDataCurr = (landManage && landManage[currYear] && landManage[currYear][currMonth] && landManage[currYear][currMonth][landId] && landManage[currYear][currMonth][landId]['total']) ? landManage[currYear][currMonth][landId]['total'] : [];
    var ttlDataPrev = (landManage && landManage[prevYear] && landManage[prevYear][prevMonth] && landManage[prevYear][prevMonth][landIdPrev] && landManage[prevYear][prevMonth][landIdPrev]['total']) ? landManage[prevYear][prevMonth][landIdPrev]['total'] : [];

    updateTableLMRSection(lmrSectCurrData, lmrSectPrevData, ttlDataCurr, ttlDataPrev, allData, allDataPrev)
    
    var landTracking = (landManage && landManage[currYear] && landManage[currYear][currMonth] && landManage[currYear][currMonth][landId] && landManage[currYear][currMonth][landId]['landTracking']) ? landManage[currYear][currMonth][landId]['landTracking'] : [];
    updateTableLandTrack(landTracking, allData);

    landTracking = (landManage && landManage[currYear] && landManage[currYear][currMonth] && landManage[currYear][currMonth][landId] && landManage[currYear][currMonth][landId]['landTracking']) ? landManage[currYear][currMonth][landId]['landTracking'] : [];

    landAcquisitionChart(landAcquisition, year, month);
    landAcquisitionTable(landAcquisition, year, month);

    //var landDb = (landTimelineDb && landTimelineDb['all'] && landTimelineDb['all']['all'] && landTimelineDb['all']['all'].landDatabase) ? landTimelineDb['all']['all'].landDatabase : [];
    updateLandDatabase(landTimelineDb, year, month);

    var landTime = (landTimelineDb && landTimelineDb['all'] && landTimelineDb['all']['all'] && landTimelineDb['all']['all'].landTimeline) ? landTimelineDb['all']['all'].landTimeline : [];
    updateLandTimeline(landTimelineDb, year, month);
    timelineJSON = landTime['data'];
    
}

function setCutOffDateCurr(year, month){
    $("#cutOff-month-curr-section").text(month);
    $("#cutOff-year-curr-section").text(year);

    $("#cutOff-month-curr-type").text(month);
    $("#cutOff-year-curr-type").text(year);

    $("#cutOff-month-curr-section-ctd").text(month);
    $("#cutOff-year-curr-section-ctd").text(year);
}

function setCutOffDatePrev(year, month){
    $("#cutOff-month-prev-section").text(month);
    $("#cutOff-year-prev-section").text(year);

    $("#cutOff-month-prev-type").text(month);
    $("#cutOff-year-prev-type").text(year);

    $("#cutOff-month-prev-section-ctd").text(month);
    $("#cutOff-year-prev-section-ctd").text(year);

}

function refreshDashboard(){
    var selWPC = $("#wpcFilter").val();
    var selYear = $('#yearFilter').val();
    if (selYear == 'all') {
    	$('#monthFilter').prop("disabled", true);	
		$('#monthFilter').val('all');
    }else{
    	$('#monthFilter').prop("disabled", false);
    }
    
	var selMonth = $('#monthFilter').val();
    refreshInformation(selWPC, selYear, selMonth);

    setTimeout(() => {
        setSecondThirdRow()
    }, 100);
    
}

function refreshFromv3 (filterArr){
    var wpc = filterArr.wpc;
    var year = filterArr.year;
    var month = filterArr.month;

    refreshInformation(wpc, year, month);

    // if(year != 'all'){
    //     if(month != 'all'){
    //         refreshInformation(wpc, year, month);
    //     }
    // }
}

$(document).ready(function(){
	$.ajax({
        type: "POST",
        url: 'chartData.json.php',
        dataType: 'json',
        data: {
            page: "land"
        },
        success: function (obj) {
        	if (obj.status && obj.status == 'ok') {
                landData = obj.data;
                refreshInformation();

                var currDate = new Date();
                var currYear = currDate.getFullYear();
                var currMonth = monthHalftext[currDate.getMonth() + 1];

                $("#yearFilter").val(currYear);
                $("#monthFilter").val(currMonth);

                //$('.filterContainer .yrFilter', window.parent.document).val(currYear);
								
                $('.filterContainer .mthFilter', window.parent.document).prop('disabled', false);
                //$('.filterContainer .mthFilter', window.parent.document).val(currMonth);
        	}
        },
        complete: function (){
            window.parent.postMessage({functionName: 'loaderajaxEnd'})
        }
    });
})