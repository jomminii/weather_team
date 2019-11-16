// SELECT ELEMENTS
const body = document.querySelector("body");
const container = document.querySelector(".container");
const notificationElement = document.querySelector(".notification");
const tempElement = document.querySelector(".temperature p");
const descElement = document.querySelector(".weather-description");
const sayElement = document.querySelector(".weather-say");

// NOW WEATHER DATA
const weather = {};

// 온도 보정용 변수
const KELVIN = 273;

// CHECK IF BROWSER SUPPORTS GEOLOCATION
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(setPosition, showError); // 매개변수 : 위치 승인 시  vs 비승인 시
} else {
  notificationElement.style.display = "block";
  notificationElement.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
}

// SET USER'S POSITION
function setPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  getWeather(latitude, longitude); // now weather data 불러오기
  getForecast(latitude, longitude); //forecast data 불러오기
}

// SHOW ERROR WHEN THERE IS AN ISSUE WITH GEOLOCATION SERVICE
function showError(error) {
  notificationElement.style.display = "block";
  notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

// GET WEATHER FROM API PROVIDER
function getWeather(latitude, longitude) {
  let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;

  fetch(api)
    .then(function(response) {
      let data = response.json();
      return data;
    })
    .then(function(data) {
      weather.temperature = Math.floor(data.main.temp - KELVIN);
      weather.description = data.weather[0].description;
      weather.iconId = data.weather[0].icon;
      weather.city = data.name;
      weather.country = data.sys.country;
    })
    .then(function() {
      displayWeather(); // now weather display
    });
}

// DISPLAY WEATHER TO UI
function displayWeather() {
  // 배경 이미지 조정
  container.style.backgroundImage = `url("images/${weather.iconId}.png")`;
  //현재 온도 반영
  tempElement.innerHTML = `<p>현재 온도 ${weather.temperature}도씨</p>`;
  // default 도시명은 openweather에서 불러오고, 검색 도시명은 google에서 불러와서 조건을 줘서 따로 불러오도록 함
  if (weather.korName === undefined) {
    descElement.innerHTML = `<p>여긴 ${weather.city}, ${weather.country} ${
      weatherMatching[weather.iconId][0]
    }</p>`;
  } else {
    descElement.innerHTML = `<p>여긴 ${weather.korName}, ${
      weatherMatching[weather.iconId][0]
    }</p>`;
  }
  // 문구 가져오기
  sayElement.innerHTML = `<p>${weatherMatching[weather.iconId][1]}</p>`;
}

// 검색 도시 위경도 가져오기
function getGeocode(e) {
  //prevent actual submit
  e.preventDefault(); // submit을 누르면 refresh가 되므로, 이 기능을 작동하지 않게 해줌

  var address = document.querySelector("#autocomplete").value;
  let api = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${googleKey}`;

  fetch(api)
    .then(function(response) {
      let data = response.json();
      return data;
    })
    .then(function(data) {
      weather.latitude = data.results[0]["geometry"]["location"]["lat"];
      weather.longitude = data.results[0]["geometry"]["location"]["lng"];
      weather.korName = data.results[0]["formatted_address"]; // 한글명 저장
    })
    .then(function() {
      getWeather(weather.latitude, weather.longitude);
      getForecast(weather.latitude, weather.longitude);
    });
}

// google geocode & autocomplete api
var input = document.getElementById("autocomplete");
var autocomplete = new google.maps.places.Autocomplete(input, {
  types: ["(cities)"]
});
google.maps.event.addListener(autocomplete, "place_changed", function() {
  var place = autocomplete.getPlace();
});

// get city form
const cityForm = document.querySelector("#city-form");

// listen for submit
cityForm.addEventListener("submit", getGeocode);
