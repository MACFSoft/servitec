

// =========================== V A R I A B L E S APP ===========================
var barrain=10;
var mensajeN="<h1>Advertencia</h1><p>Hay que configurar el servidor.</p>";
var rain=0;
var localID;
var ServerData;
var at;
var distan;
var GPSOpt = {maximumAge: 3000, timeout: 5000, enableHighAccuracy: true };
var CameraOpt = {EncodingType: 1, quality: 100, allowEdit: false }
//=========================== V A R I A B L E S DATA ===========================
var SO_Device="Android Virtual";       //Mientras la beta
var Ver_Device="4.0.0";                //Mientras la beta
var Uuid_Device="6A689277024D4DE4";    //Mientras la beta
var Latit='3.9913054';                 //Mientras la beta
var Long='-73.7651035';                //Mientras la beta
var Accur=1000;                        //Mientras la beta
var Bruju=0;                           //Mientras la beta
var Velocid=0;                            //Mientras la beta
var fichero;

// ============================ S e c c i o n e s ==============================
document.addEventListener("deviceready", IniciarAplicacion, false);
function ActGPS(){
  localID = navigator.geolocation.watchPosition(GpsonSuccess,GpsonError,GPSOpt);
} //ActGPS
function ObtFoto(){
  navigator.camera.getPicture(CamaraonSuccess, CamaraonError,CameraOpt);
} //ObtFoto
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
  var d = (R * c); // Distance en Km
    d = d*1000;    // En metros
  //return d.toFixed(3);
  return d.toFixed(0);
} //Distancia en mts
function GpsonError(e) {
  $('#maploc').attr('src', "img/mapa.png");
  alert("Por favor encender el GPS para continuar.");
} //GpsonError
function GpsonSuccess(position) {
  distan=getDistanceToCoords(Latit,Long,position.coords.latitude,position.coords.longitude);
  if (distan>10) {
      Latit = position.coords.latitude;
       Long = position.coords.longitude;
    Velocid = position.coords.speed;
      Bruju = position.coords.heading;
      Accur = position.coords.accuracy;
     MapaPS('#maploc');
  }
  if (Accur>position.coords.accuracy){
      Latit = position.coords.latitude;
       Long = position.coords.longitude;
      Accur = position.coords.accuracy;
    MapaPS('#maploc');
  }
} //GpsonSuccess
function MapaPS(conten){
  Gpsurl = GMaps.staticMapURL({
  size: [300, 300],
   lat: Latit,
   lng: Long,
    marker: {
      lat: Latit,
      lng: Long,
      size: 'small',
      color: 'green'
    }
  });
//Cargando datos
$(conten).attr('src', Gpsurl);
$('#fidel').html("Error es: "+Accur+"mts");
$('#bruja').html(Bruju+"´");
  MError = "GpsD";
  MError = (Accur > 13 && Accur <  30)? "GpsM":MError;
  MError = (Accur > 10 && Accur <= 13)? "GpsR":MError;
  MError = (Accur >  7 && Accur <= 10)? "GpsA":MError;
  MError = (Accur >  5 && Accur <=  7 )? "GpsB":MError;
  MError = (Accur <= 5)? "GpsE":MError;
 MError += " btninfo";
$("#fidel").attr("class",MError);
// Enviar datos del usiario al servidor
 //Evaluar los datos a enviar
} //MapaPS
function CamaraonError(message){
  //alert('Se presento un error: ' + message);
  window.location.assign("#page2");
} //camaraonError
function CamaraonSuccess(rutaImagen){
  document.getElementById("imgCamara").src = rutaImagen;
  fichero = rutaImagen;
} //camaraonSuccess


function uploadonError(error) {
	//window.location.assign("#page4");
    alert('Se presento un error: ' + error.source);
    //$("#razon2").fadeIn(1000);
} //uploadonError
function uploadonSuccess(r) {
  alert("subido "+r.source);
    window.location.assign("#page0");
} //uploadonSuccess



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
function EnviaDATA(){
var optitons = new FileUploadOptions();
  optitons.fileKey="file";
  optitons.fileName=fichero.substr(fichero.lastIndexOf('/')+1);
  //optitons.mimeType="image/jpeg";  //optitons.mimeType="image/png";
  optitons.mimeType="image/png";  //optitons.mimeType="image/jpeg";
  optitons.chunkedMode=true;
var params = {};
  //Datos origen
    params.uuid_d = Uuid_Device;
    params.latitud = Latit;
    params.longitud = Long;
    params.error = Accur;
    //params.bruja = Bruju;
    //params.velo = Velocid;
  //Datos clasificacion
    params.tablero  = $("#sl-tablero").val();
    params.pedestal = $("#sl-pedestal").val();
    params.anclaje  = $("#sl-anclaje").val();
    params.vision   = $("#sl-vision").val();
    params.accion   = $("#sl-accion").val();
    params.obser    = $("#txt-obser").val();
  optitons.params = params;
  var ft = new FileTransfer();
  //alert(params);
  ft.upload(fichero, ServerData+"/updata.php", uploadonSuccess, uploadonError, optitons);
} //EnviaDATA





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
  //MapaPS('#maploc');
  //console.log( "hola page on");
}); //page2
$(document).on('pageshow',"#page3",function(){
  navigator.geolocation.clearWatch(localID);
}); //page3
 //??&nbsp;Pahe 4 EnviaDATA

$(document).on('pageshow',"#page5",function(){
  if (localStorage.getItem('Setup')==1){
  //Calificacion pedestal
    ArrySelect = localStorage.getItem('Tablero').split('|');
    $.each(ArrySelect, function(idx,val) {
      idx++;
      $('#sl-tablero').append('<option value="'+idx+'">'+val+'</option>');
    });
  //Calificacion pedestal
    ArrySelect = localStorage.getItem('Pedestal').split('|');
    $.each(ArrySelect, function(idx,val) {
      idx++;
      $('#sl-pedestal').append('<option value="'+idx+'">'+val+'</option>');
    });
  //Calificacion anclaje */
    ArrySelect = localStorage.getItem('Anclaje').split('|');
    $.each(ArrySelect, function(idx,val) {
      idx++;
      $('#sl-anclaje').append('<option value="'+idx+'">'+val+'</option>');
    });
  //Calificacion vista
    ArrySelect = localStorage.getItem('Vista').split('|');
    $.each(ArrySelect, function(idx,val) {
      idx++;
      $('#sl-vision').append('<option value="'+idx+'">'+val+'</option>');
    });
  //Clasificacion de  la accion
    ArrySelect = localStorage.getItem('Accion').split('|');
    $.each(ArrySelect, function(idx,val) {
      idx++;
      $('#sl-accion').append('<option value="'+idx+'">'+val+'</option>');
    });
  } //if Setup
}); //page5

