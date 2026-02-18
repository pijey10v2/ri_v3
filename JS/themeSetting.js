function submitThemeSetting() {
    let val;
    if (document.getElementById('themeSelection1').checked) {
        val = 1; //blue
    }
    else if (document.getElementById('themeSelection2').checked) {
        val = 2;  // dark color
    }
    else if (document.getElementById('themeSelection3').checked) {
        val = 3;  // light color
    }

    $.ajax({
        type: "POST"
        , url: 'BackEnd/userFunctions.php'
        , dataType: 'json'
        , data: {
            functionName: 'updateTheme',
            themeValue: val
        }
        , error: function (xhr, textStatus, errorThrown) {
            var str = textStatus + " " + errorThrown;
            console.log(str);
        }
    })

    $.confirm({
        boxWidth: '30%',
        useBootstrap: false,
        title: 'Confirm!',
        content: 'The setting will only take effect after reload. Reload now? <br>',
        buttons: {
            confirm: function () {
                var url = 'login/postlogin_processing'
                var form = $('<form action="' + url + '" method="POST">' +
                    '<input type="text" name="projectid" value="' + localStorage.p_id + '" />' +
                    '</form>');
                $('body').append(form);
                form.submit();

            },
            cancel: function () {
            }
        }
    });
}

