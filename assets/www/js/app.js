$(function() {

    var fileref = document.createElement('script');
    fileref.setAttribute("type", "text/javascript");
    fileref.setAttribute("src",
            "http://maps.googleapis.com/maps/api/js?sensor=true&callback=getGeolocation");
    document.getElementsByTagName("head")[0].appendChild(fileref);
    $("#btnSumit").click(function() {

        if ($('#usuariotxt').val() == "") {
            alert('El campo usuario no debe estar vaci');
            $('#usuariotxt').focus();
            return;
        }

        if ($('#clavetxt').val() == "") {
            alert('El campo clave no debe estar vacio');
            $('#clavetxt').focus();
            return;
        }
// $.mobile.showPageLoadingMsg();
        $.post($base_url_login, (
                {
                    usuario: $('#usuariotxt').val(),
                    pass: $('#clavetxt').val(),
                    tipo: 1
                }
        ),
                function(result) {
                    alert(result);
                    $.mobile.changePage("#page2", {transition: 'slide'});
                    if (1 == 1) {
                        if (result.success === 'true') {
                            $.mobile.hidePageLoadingMsg();
                            $('#usuariotxt').val($.trim($('#usuariotxt').val()));
                            isSessionActive = true;
                            $.mobile.changePage("#page2", {transition: 'slide'});
                            $('ul').find('li').remove();
                            $('ul').append('<li data-role="list-divider" role="heading">Menu</li>');
                            for (var i = 0; i < result.data.length; i++) {
                                $('ul').append('<li id=' + result.data[i].id_obra + ' data-theme="a"><a onclick="setIdObra(\'' + result.data[i].id_obra + '\')" href="#page3" data-transition="slide">' + result.data[i].nombre + '</a></li>');
                            }

                            $('ul').append('<li data-theme="a"><a href="#page4" data-transition="slide" onclick="obtenerMiPosicion();">Mi Posicion</a></li>');
                            $('ul').listview('refresh');
                        } else {
                            $.mobile.hidePageLoadingMsg();
                            alert("Usuario y/o Clave Incorrectos");
                        }
                    } else {
                        $.mobile.hidePageLoadingMsg();
                        alert(result);
                    }
                }, 'html');
    });
});


var isTypeOf = 1; //1 foto , 2 video
var $base_url_login = 'http://www.dolmen.net.co/sid_v1/censo_au/index.php';
var isSessionActive = false;
window.id_obra = 0;
function registrarAccion() {
    if (isTypeOf == 1) {
        savePhoto();
    } else {
        uploadMediaFile();
    }
}

function setIdObra(argument) {
    window.id_obra = argument;
}

function obtenerMiPosicion() {
    getGeolocation();
}

function getGeolocation() {
    // get the user's gps coordinates and display map
    var options = {
        maximumAge: 3000,
        timeout: 5000,
        enableHighAccuracy: true
    };
    navigator.geolocation.getCurrentPosition(loadMap, geoError, options);
}

function loadMap(position) {
    var latlng = new google.maps.LatLng(position.coords.latitude,
            position.coords.longitude);
    var myOptions = {
        zoom: 8,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var mapObj = document.getElementById("map_canvas");
    var map = new google.maps.Map(mapObj, myOptions);
    var marker = new google.maps.Marker({
        position: latlng,
        map: map,
        title: "You " + $('#usuariotxt').val()
    });
}

function geoError(error) {
    alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
}