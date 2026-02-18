var GeneralManagementData;

function updateTotalPublicComplaintCard(curr = 0, cumul = 0, start = 0) {
    $('#TotalPublicComplaintCard').html(formatThousand(cumul)); 
}

function updateClosedCard(curr = 0, cumul = 0, start = 0) {
    $('#ClosedCard').html(formatThousand(curr)); 
}

function updateOpenCard(curr = 0, cumul = 0, start = 0) {
    $('#OpenCard').html(formatThousand(curr)); 
}

function PublicComplaintFormChart(){
// Create the chart
Highcharts.chart('PublicComplaintFormChart', {
    chart: {
      type: 'bar'
    },
    title: {
      text: ''
    },
    subtitle: {
      text: ''
    },
    xAxis: {
      type: 'category',
      text: 'Types',
      labels: {
        rotation: -45,
        style: {
          fontSize: '13px',
          fontFamily: 'Verdana, sans-serif'
        }
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Number'
      }
    },
    legend: {
      enabled: false
    },
    tooltip: {
      pointFormat: 'Public Complaints <b>{point.y:.1f}</b>'
    },
    credits: false,

    series: [{
      name: 'Number',
      data: [
        ['Shanghai', 24.2],
        ['Beijing', 20.8],
        ['Karachi', 14.9],
        ['Shenzhen', 13.7],
        ['Guangzhou', 13.1],
        ['Istanbul', 12.7],
        ['Mumbai', 12.4],
        ['Moscow', 12.2],
        ['São Paulo', 12.0],
        ['Delhi', 11.7],
        ['Kinshasa', 11.5],
      ],
      dataLabels: {
        enabled: false,
        rotation: -90,
        color: '#FFFFFF',
        align: 'right',
        format: '{point.y:.1f}', // one decimal
        y: 10, // 10 pixels down from the top
        style: {
          fontSize: '13px',
          fontFamily: 'Verdana, sans-serif'
        }
      }
    }]
  });
}

function refreshInformation(proj = 'overall') {
    updateTotalPublicComplaintCard();
    updateClosedCard();
    updateOpenCard();
    PublicComplaintFormChart();
}

$(function () {
    // load all the chart
   refreshInformation();
})



