// Tutorial by http://youtube.com/CodeExplained
// api key : 82005d27a116c2880c8f0fcb866998a0

//SELECT ELEMENTS
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");
const button = document.getElementById("button");

button.addEventListener('click', getCityCoords);

//App Data

const weather = {};
let cityLocation = {};


weather.temperature = {
    unit : "celsius"
}

//APP CONSTS AND VARS

const KELVIN = 273

const key = "82005d27a116c2880c8f0fcb866998a0"

//CHECK IF BROWSER SUPPORTS GEOLOCATION
if('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(setPosition, showError);
}else{
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Browser does not support geolocation </p>";
}

//SET USERS POSITION
function setPosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    
    getWeather(latitude, longitude);
    
}

//SHOW ERROR IF THERE IS AN ISSUE WITH GEOLOCATION
function showError(error){ 
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message}</p>`;
}

//GET WEATHER FROM API PROVIDER
function getWeather(latitude, longitude){
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
    
    
    fetch(api)
        .then(function(response){
        let data = response.json();
        return data;
    })
    .then(function(data){
        weather.temperature.value = Math.floor(data.main.temp - KELVIN);
        weather.description = data.weather[0].description;
        weather.iconID = data.weather[0].icon;
        weather.city = data.name;
        weather.country = data.sys.country;
    })
    .then(function(){
        displayWeather();
    });
}

function displayWeather(){
    iconElement.innerHTML = `<img src="icons/${weather.iconID}.png"/>`;
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}


// C to F conversion
function celsiusToFahrenheit(temperature){
    return(temperature *9/5) + 32;
}

//WHES USER CLICKS TEMPERATURE ELEMENT

tempElement.addEventListener("click", function(){
    if(weather.temperature.value === undefined) return;
    
    if(weather.temperature.unit == "celsius"){
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);
        
        tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
        weather.temperature.unit = "fahrenheit";
    }else{
        tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        weather.temperature.unit = "celsius";
    }
    
});

function getCityCoords(){
    console.log("getCityCoords");
    let cityName = document.getElementById('input').value;
    document.getElementById('input').value = ''

    
    let cityNameApi = `https://maps.googleapis.com/maps/api/geocode/json?address=${cityName}&key=AIzaSyD0-OXLZLezzEusHzaJlmPmdT0bzZgr3l4`
    
    fetch(cityNameApi)
  .then(response => response.json())
  .then(function(data){
       cityLocation = data.results[0].geometry.location;
        getWeather(cityLocation.lat, cityLocation.lng);
        });
    
    
    ;
    
}