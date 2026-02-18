// //var tables = document.getElementsByClassName('flexiCol');
// var tables = document.getElementsByClassName('table resize');

// for (var i=0; i<tables.length;i++){
//  resizableGrid(tables[i]);
// }

function resizableGrid(table) {
 var row = table.getElementsByTagName('tr')[0],
 cols = row ? row.children : undefined;
 if (!cols) return;
 
 table.style.overflow = 'hidden';
 
 var tableHeight = table.scrollHeight;
 
 var collength = cols.length - 1

 for (var i=0;i<collength;i++){
  var div = createDiv(tableHeight);
  cols[i].appendChild(div);
  cols[i].style.position = 'relative';
  setListeners(div);
 }

 function setListeners(div){
  var pageX,curCol,nxtCol,curColWidth,nxtColWidth;

  div.addEventListener('mousedown', function (e) {
   curCol = e.target.parentElement;
   nxtCol = curCol.nextElementSibling;
   pageX = e.pageX; 
 
   var padding = paddingDiff(curCol);
 
   curColWidth = curCol.offsetWidth - padding;
   if (nxtCol)
    nxtColWidth = nxtCol.offsetWidth - padding;
  });

  div.addEventListener('mouseover', function (e) {
   e.target.style.borderRight = '2px dashed  rgb(114.5, 114.5, 114.5)';
  })

  div.addEventListener('mouseout', function (e) {
   e.target.style.borderRight = '2px dashed  rgb(114.5, 114.5, 114.5)';
  })

  document.addEventListener('mousemove', function (e) {
   if (curCol) {
    var diffX = e.pageX - pageX;
 
    if (nxtCol)
     nxtCol.style.width = (nxtColWidth - (diffX))+'px';

    curCol.style.width = (curColWidth + diffX)+'px';
   }
  });

  document.addEventListener('mouseup', function (e) { 
   curCol = undefined;
   nxtCol = undefined;
   pageX = undefined;
   nxtColWidth = undefined;
   curColWidth = undefined
  });
 }
 
 function createDiv(height){
  var div = document.createElement('div');
  div.style.top = 0;
  div.style.right = 0;
  div.style.width = '5px';
  div.style.position = 'absolute';
  div.style.cursor = 'col-resize';
  div.style.userSelect = 'none';
  div.style.borderRight = '2px dashed  rgb(114.5, 114.5, 114.5)';
  div.style.height = '100%';
  div.className = 'columnSelector';
  return div;
 }
 
 function paddingDiff(col){
 
  if (getStyleVal(col,'box-sizing') == 'border-box'){
   return 0;
  }
 
  var padLeft = getStyleVal(col,'padding-left');
  var padRight = getStyleVal(col,'padding-right');
  return (parseInt(padLeft) + parseInt(padRight));

 }

 function getStyleVal(elm,css){
  return (window.getComputedStyle(elm, null).getPropertyValue(css))
 }
};