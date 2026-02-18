$(function(){
    $("#backbutton").on("click", function(){
        document.location.href = "../signin.php"
    })
	  var urlPara = window.location.search.split("=")
	  if(urlPara[1])
	  {
		switch(urlPara[1]){
			case "noemail":
				alert('Email not found!')
				break;
			default:
				break;
			}
		}
  })
