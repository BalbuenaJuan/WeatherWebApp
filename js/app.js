//APLICACION DEL TIEMPO CON GEOLOCALIZACION, MAPA Y FECHA


  var TIMEZONE_API_KEY = "d6a4075ceb419113c64885d9086d5";
  var TIMEZONE_API_URL = "https://api.worldweatheronline.com/free/v2/tz.ashx?format=json&key=" + TIMEZONE_API_KEY + "&q=";
  var WEATHER_API_KEY = "60f60bbd10d8c82e5ffe6a69089f6dfd";
  var WEATHER_API_URL = "http://api.openweathermap.org/data/2.5/weather?APPID=" + WEATHER_API_KEY;

  var time = new Date();
  var timeNow = time.toLocaleTimeString();

  var lat, lon;

  var weatherApi  = {};
  weatherApi.temp;
  weatherApi.humidity;
  weatherApi.temp_max;
  weatherApi.temp_min;
  weatherApi.zone;
  weatherApi.ico;

  var text = $("[data-addCity='newCity']");
  var onSubmitAdd = $("[data-searchCity='buttonAdd']");

  $( onSubmitAdd ).on("click", addNewCity);

  $( text ).on("keypress", function(event){
    if(event.which == 13){
      $(".trabajando").html(".....");
      addNewCity();
    }
  })

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getCoords, errorFound)
  } else {
     alert("Upgrade your browser");
  }

  function errorFound(error) {
     alert("Error: " + error.code );
  }

  function getCoords(position) {

   lat = position.coords.latitude;
   lon = position.coords.longitude;

   console.log("Your position is: " + lat + "," + lon);

   $.getJSON({
      url: WEATHER_API_URL + "&lat=" + lat + "&lon=" + lon + "&units=metric"
    }, getCurrentWeather, initMap)
    initMap();
  }

  function getCurrentWeather(data){

    console.log(data);

    weatherApi.temp = data.main.temp;
    weatherApi.humidity = data.main.humidity;
    weatherApi.temp_max = data.main.temp_max;
    weatherApi.temp_min = data.main.temp_min;
    weatherApi.zone = data.name;
    weatherApi.ico = "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";


    $("#messageShow").fadeOut();

    $("#temperatura").html("Temperatura actúal:" + "</br>" + "- " + weatherApi.temp + "º");
    $("#humedad").html("Humedad:" + "</br>" + "- " + weatherApi.humidity + "%");
    $("#temp_max").html("Temperatura Máxima:" + "</br>" + "- " + weatherApi.temp_max + "º");
    $("#temp_min").html("Temparatura mínima:" + "</br>" + "- " + weatherApi.temp_min + "º");
    $("#ico").attr("src", weatherApi.ico);
    $("#zone").html("Lugar:" + "</br>" + "- " + weatherApi.zone + " a las:  " + timeNow);
}

function initMap(){

  var map;
  console.log(lat + ", " + lon);

  map = new google.maps.Map(document.getElementById('map'), {
   center: {lat: lat, lng: lon},
   zoom: 10
 });

}

function addNewCity(event){

  event.preventDefault();

  $(".trabajando").html(".....");

  $.getJSON({
    url: WEATHER_API_URL + "&q=" + text.val() + "&units=metric"
  }, getNewCityWeather)
}

function getNewCityWeather(data){

  console.log(data);

  $(".trabajando").fadeOut();

  $.getJSON({
    url: TIMEZONE_API_URL + text.val()
  }, function(response){

     console.log(response);


     var weatherApi  = {};
     weatherApi.temp = data.main.temp;
     weatherApi.humidity = data.main.humidity;
     weatherApi.temp_max = data.main.temp_max;
     weatherApi.temp_min = data.main.temp_min;
     weatherApi.zone = data.name;
     weatherApi.ico = "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";

     var timeZone = response.data.time_zone[0].localtime.split(" ")[1];

     $("#temperatura").html("Temperatura actúal:" + "</br>" + "- " + weatherApi.temp + "º");
     $("#humedad").html("Humedad:" + "</br>" + "- " + weatherApi.humidity + "%");
     $("#temp_max").html("Temperatura Máxima:" + "</br>" + "- " + weatherApi.temp_max + "º");
     $("#temp_min").html("Temparatura mínima:" + "</br>" + "- " + weatherApi.temp_min + "º");
     $("#ico").attr("src", weatherApi.ico);
     $("#zone").html("Lugar: " + "</br>" + "- " + weatherApi.zone + " a las:  " + timeZone);

  })

}
