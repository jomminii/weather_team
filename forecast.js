// <!-- 3일 예측치 만들어서 붙이기 -->

// <div class = "forecastContainer">
//     <ul class = "forecastList">
//         <!--리스트 생성해서 붙이기-->
//     </ul>

// </div>
// img src dom
// document.getElementById("imageid").src="../template/save.png";
// `url("images/${weather.iconId}.png")`;
// Select Element
const forecastContainer = document.querySelector(".forecastContainer");
const forecastList = document.querySelector(".forecastList");

// get forecast information
const forecast = { 0: {}, 1: {}, 2: {}, 3: {}, 4: {}, 5: {}, 6: {}, 7: {} }; // forecast 정보를 담을 객체

function getForecast(latitude, longitude) {
  let api = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${key}`;

  fetch(api)
    .then(function(response) {
      let data = response.json();
      return data;
    })
    .then(function(data) {
      for (let i = 0; i < 8; i++) {
        // 8 시간대의 정보를 담음
        forecast[i].temperature = Math.floor(data.list[i].main.temp - KELVIN);
        forecast[i].description = data.list[i].weather[0].description;
        forecast[i].iconId = data.list[i].weather[0].icon;
        forecast[i].city = data.city.name;
        forecast[i].country = data.city.country;

        var date = new Date(data.list[i].dt * 1000); // 1000을 곱해 초단위로 만들어줌
        forecast[i].day = day[date.getDay()];
        forecast[i].time = date.getHours();
      }
    })
    .then(function() {
      addForecast();
    });
}

// forcast list add

function addForecast() {
  document.querySelector("ul").innerHTML = "";
  for (let i = 0; i < 8; i++) {
    //3시간씩 8번, 24시간
    const li = document.createElement("li");
    const template = document.querySelector("#forecastTemp");
    const clone = document.importNode(template.content, true);

    clone.querySelector(
      ".day"
    ).textContent = `${forecast[i].day} ${forecast[i].time}시`;
    clone.querySelector(".img").src = `icons/${forecast[i].iconId}.png`;
    clone.querySelector(
      ".forecastTemperature"
    ).textContent = `${forecast[i].temperature}도씨`;

    li.appendChild(clone);
    forecastList.appendChild(li);
  }
}
