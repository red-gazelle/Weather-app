// Tutorial by http://youtube.com/CodeExplained
// api key : 82005d27a116c2880c8f0fcb866998a0

//SELECT ELEMENTS
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");
const button = document.getElementById("button");
const currentLocation = document.getElementById("mapMarker");


button.addEventListener('click', getCityCoords);
currentLocation.addEventListener('click', function(){
    document.location.reload()
});




//App Data

const weather = {};
let cityLocation = {};


weather.temperature = {
    unit : "celsius"
}

//APP CONSTS AND VARS

const KELVIN = 273

const key = "18198015a94673f46a4c9e60190d8315"

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
//This stops the page refreshing when the enter key is pressed
document.getElementById("form").onkeypress = function(e) {
  var key = e.charCode || e.keyCode || 0;     
  if (key == 13) {
    getCityCoords();
    e.preventDefault();
  }
}

// Code for the typeahead feature
const endpoint = 'https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json';

const cities = [];
fetch(endpoint)
  .then(blob => blob.json())
  .then(data => cities.push(...data));

function findMatches(wordToMatch, cities) {
  return cities.filter(place => {
    // here we need to figure out if the city or state matches what was searched
    const regex = new RegExp(wordToMatch, 'gi');
    return place.city.match(regex) || place.state.match(regex)
  });
}



function displayMatches() {

  suggestions.style.display = "block";
  const matchArray = findMatches(this.value, cities);
  const html = matchArray.map(place => {
    const regex = new RegExp(this.value, 'gi');
    const cityName = place.city.replace(regex, `<span class="hl">${this.value}</span>`);
    const stateName = place.state.replace(regex, `<span class="hl">${this.value}</span>`);
    return `
      <li>
        <span class="name">${cityName}, ${stateName}</span>
      </li>
    `;
  }).join('');
  suggestions.innerHTML = html;
  listItems = document.getElementsByTagName('li')
    
   for(var i = 0; i < listItems.length; i++) {
       listItems[i].addEventListener("click", function(){
           
        searchInput.value =this.innerText;

 });
}
}
const searchInput = document.getElementById('input');
const suggestions = document.querySelector('.suggestions');

searchInput.addEventListener('change', displayMatches);
searchInput.addEventListener('keyup', displayMatches);