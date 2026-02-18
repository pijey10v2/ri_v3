// document.onclick = eventRef

// function eventRef(evt) {
//     var han;
//     evt || (evt = window.event);

//     if (evt) {
//         var elem = evt.target ? han = evt.target : evt.srcElement && (han = evt.srcElement);

//          // evt.type could be, mouseup, mousedown...
//         // elem.id is the id or the element
//         // elem.className is the class name of the element
//         // you could nest expression, use substrings to extract part of a className
//         if (evt.type=="click" && typeof ($(elem).attr("dataClick")) !== 'undefined') {  
//             console.log($(elem).attr("dataClick"));
//         }
//     }
// }