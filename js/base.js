

// =========================== V A R I A B L E S APP ===========================
var barrain=10;
var mensajeN="<h1>Advertencia</h1><p>Hay que configurar el servidor.</p>";
var rain=0;
var localID;
var ServerData;
var at;
var distan=25;
var gpsopt = {maximumAge: 15000, timeout: 30000, enableHighAccuracy: true };

//=========================== V A R I A B L E S DATA ===========================
var SO_Device="Android Virtual";       //Mintras la beta
var Ver_Device="4.0.0";                //Mintras la beta
var Uuid_Device="6A689277024D4DE4";    //Mintras la beta
var Latit='3.9913054';                  //Mintras la beta
var Long='-73.7651035';                 //Mintras la beta
var Accur=1000;                        //Mintras la beta
var fichero;

// ============================ S e c c i o n e s ==============================
document.addEventListener("deviceready", IniciarAplicacion, false);
function ActGPS(){
  localID = navigator.geolocation.watchPosition(GpsonSuccess,GpsonError,gpsopt);
} //ActGPS
// ============================= F U N C I O N E S =============================
function Barrain(){
 $("#loadin").attr('src','img/barra/barra'+barrain+'.png');
barrain += (barrain<10)? +1:-10;
  if (barrain==10){
    window.location.assign("#page0");
    $('#textb').text("Completado");
    window.clearInterval(at);  // Paramos el load
  }
} //Barrain
function Radar(){
$('#radar').attr({'src':'img/rain/ra'+rain+'.png',
                  'title':"Esperando informacion"});
 rain += (rain<24)? +1:-24;
} //Radar
function IniciarAplicacion(){
    SO_Device = device.platform;
   Ver_Device = device.version;
  Uuid_Device = device.uuid;
} //IniciarAplicacion
function GuardarD(){
  $("#server").html("Servidor: http://"+$("#txt_server").val()+"/");
  $("#folder").html("Carpeta: "+$("#txt_folder").val()+"/");
  $("#user").html("Usuario: "+$("#txt_user").val());
  $("#pass").html("Contrase&ntilde;a: "+$("#txt_pass").val());
  $("#deso").html("Sistema Op: "+SO_Device);
  $("#dever").html("Vercion: "+Ver_Device);
  $("#deuuid").html("ID Univeral: "+Uuid_Device);
  // Guardamos los datos
  localStorage.setItem('Server', $("#txt_server").val());
  localStorage.setItem('Folder', $("#txt_folder").val());
  localStorage.setItem('User', $("#txt_user").val());
  localStorage.setItem('Pass', $("#txt_pass").val());
  localStorage.setItem('Instalado', "Dis_Sofia|Adm_Lina|Pro_MACF");
  $("#datasetup").hide();
  $("#BtnSaved").hide();
   ServerData="http://"+$("#txt_server").val()+"/"+$("#txt_folder").val();
//Solicittar datos del servidor
  Solitar();
} //GuardarD
function CargarD(){
  $("#datasetup").show();
  $("#BtnSaved").show();
  $("#txt_server").val(localStorage.getItem('Server'));
  $("#txt_folder").val(localStorage.getItem('Folder'));
  $("#txt_user").val(localStorage.getItem('User'));
  $("#txt_pass").val(localStorage.getItem('Pass'));
} //CargarD

function getDistanceToCoords(lat1,lon1,lat2,lon2) {
  function _deg2rad(deg) {
    return deg * (Math.PI/180)
  }
  var R = 6371; // Radius of the earth in km
  var dLat = _deg2rad(lat2-lat1);  // deg2rad below
  var dLon = _deg2rad(lon2-lon1);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(_deg2rad(lat1)) * Math.cos(_deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = (R * c)/1000; // Distance in km/1000mts
  return d.toFixed(3);
} //Distancia en mts
function GpsonError(e) {
  $('#maploc').attr('src', "img/mapa.png");
  alert("Por favor encender el GPS para continuar.");
} //GpsonError
function GpsonSuccess(position) {
  //distan=getDistanceToCoords(Latit,Long,position.coords.latitude,position.coords.longitude);
  //if (Accur > position.coords.accuracy || distan > 10) {
    Latit = position.coords.latitude;
    Long = position.coords.longitude;
    Accur = position.coords.accuracy;
    MapaPS("#maploc");
  //}
} //GpsonSuccess
function MapaPS(conten){
  Gpsurl = GMaps.staticMapURL({
  size: [300, 300],
  lat: Latit,
  lng: Long,
  zoom:18,
    marker: {
      lat: Latit,
      lng: Long,
      size: 'small',
      color: 'green'
    }
  });
$(conten).attr('src', Gpsurl);
$("#fidel").html("Error es: "+Accur+"mts");
MError = "GpsD";
MError = (Accur > 13 && Accur <  30)? "GpsM":MError;
MError = (Accur > 10 && Accur <= 13)? "GpsR":MError;
MError = (Accur >  7 && Accur <= 10)? "GpsA":MError;
MError = (Accur >  5 && Accur <=  7 )? "GpsB":MError;
MError = (Accur <= 5)? "GpsE":MError;
MError += " btninfo";
$("#fidel").attr("class",MError);
//console.log(MError);
    //MapaPS('#maploc');
} //MapaPS



// ===================== P E T I C I O N E S = S E R V E R =====================
function Solitar(){
  $.ajax({
    type: "POST",
    url: ServerData+"/solicitud.php",
    data: {'so': SO_Device, 'ver_d': Ver_Device, 'Uuid_D': Uuid_Device,
        'user': localStorage.getItem('User'), 'pass': localStorage.getItem('Pass')
        },
    beforeSend:function(){
      $("#stado").html("Consultando");
      $("#stado").attr('class',"btninfo servninfo espera");
    },
    success:function(datos){
      $("#stado").html("Servidor Conectado.");
      $("#stado").attr('class',"btninfo servninfo prendido");
      at=(datos==1)? 1:0;
      localStorage.setItem('Setup', at);
    },
    error : function(jqXHR, status, error) {
      $("#stado").html("Servidor no Conectado.");
      $("#stado").attr('class',"btninfo servninfo apagado");
    }
    });
} //Solitar
function Verificar(){
$.ajax({
  type: "POST",
  url: ServerData+"/statusserver.php",
  dataType : 'text',
  success:function(datos){
    $("#stado").html("Servidor Conectado.");
    $("#stado").attr('class',"btninfo servninfo prendido");
    if (localStorage.getItem('Setup')==1){
      $("#listas").show();
    }
  },
  error : function(jqXHR, status, error) {
    $("#stado").html("Servidor no Conectado.");
    $("#stado").attr('class',"btninfo servninfo apagado");
  },
  complete : function(jqXHR, status) {
    $("#listas").attr('class',"btninfo datainfo espera");
  }
  });
} //Verificar
function TraerList(){
  $.ajax({
    type: "POST",
    url: ServerData+"/listasdata.php",
    dataType : 'json',
    beforeSend:function(){
      $("#listas").html("Consultando");
      $("#listas").attr('class',"btninfo datainfo espera");
    },
    success:function(datalist){
      $("#listas").html("Datos completos");
      $("#listas").attr('class',"btninfo datainfo prendido");
      $.each(datalist, function(idn,datalis) {
        localStorage.setItem(idn, datalis);
      });
      //window.setTimeout('window.location.assign("#page0");',5000);
    },
    error : function(jqXHR, status, error) {
      $("#listas").html("algo fallo con las listas");
      $("#listas").attr('class',"btninfodatainfo apagado");
    }
  });
} //TraerList






// =============================== P A G I N A S ===============================
$(document).on('pageshow',"#pagel",function(){
 at=window.setInterval('Barrain();',500);
}); //pagel
$(document).on('pageshow',"#page0",function(){
  if (localStorage.getItem('Instalado')){
    ServerData="http://"+localStorage.getItem('Server')+"/"+localStorage.getItem('Folder');
    at=window.setInterval('Radar();',500);
    $('#boton').attr({'href':"#page2",'title':"Presiona para continuar"});
    $('#boton').text("CONTINUAR");
    //ActGPS();
  // Consultamos el servidor pendiente
    window.setTimeout('window.clearInterval(at);',30000);
  }else{
    $('#boton').text("SETUP");
    $('#boton').attr({'href':"#page1", 'title':"Presiona para registrar"});
    $('#boton').hide();
    $('#logop').html(mensajeN);
    window.setTimeout("$('#boton').show();",5000);
  } //Instalado
}); //page0
$(document).on('pageshow',"#page1",function(){
  if (localStorage.getItem('Instalado')){
  //Gestionamos las rutas
    ServerData="http://"+localStorage.getItem('Server')+"/"+localStorage.getItem('Folder');
    $("#server").html("Servidor: http://"+localStorage.getItem('Server'));
    $("#folder").html("Carpeta: "+localStorage.getItem('Folder'));
  //Conseguimos los datos del movil
    $("#deso").html("Sistema Op: "+SO_Device);
    $("#dever").html("Vercion: "+Ver_Device);
    $("#deuuid").html("ID Univeral: "+Uuid_Device);
  //Activamos la credenciales
    $("#user").html("Usuario: "+localStorage.getItem('User'));
    $("#pass").html("Contrase&ntilde;a: "+localStorage.getItem('Pass'));
    $("#datasetup").hide();
    $("#BtnSaved").hide();
    Verificar();
  }else{
    $("#datasetup").show();
    $("#BtnLoad").hide();
    $("#stado").attr('class',"btninfo servninfo espera");
    $("#listas").attr('class',"btninfo datainfo espera");
  }//if
}); //page1
$(document).on('pageshow',"#page2",function(){
  window.clearInterval(at);
  ActGPS();
}); //page2