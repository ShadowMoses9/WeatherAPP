import { fetchData, url } from "./fetch.js";
import * as module from "./helpers.js";
import { searchTimeoutDuration } from "./config.js";
const multyEventsOnElements = function (elements, type, callback) {
    for (const element of elements)
        element.addEventListener(type, callback);
};
//////////////////////////    SEARCH BAR        ////////////////////////////////
const searchField = document.querySelector("[data-search-field]");
const searchResult = document.querySelector("[data-search-results]");
let searchTimeout = null;
searchField.addEventListener("input", function () {
    searchTimeout !== null && searchTimeout !== void 0 ? searchTimeout : clearTimeout(searchTimeout);
    if (!searchField.value) {
        searchResult.classList.add("hidden");
    }
    else {
        searchResult.classList.remove("hidden");
    }
    if (searchField.value) {
        searchTimeout = setTimeout(() => {
            fetchData(url.geocoding(searchField.value), function (loc) {
                var _a;
                searchResult.classList.remove("hidden");
                searchResult.innerHTML = `
        <ul class="view-list" data-search-list> </ul>`;
                const items = [];
                for (const { name, lat, lon, country, state } of loc) {
                    const searchedItem = document.createElement("li");
                    searchedItem.classList.add("view-item");
                    searchedItem.innerHTML = `
          <span class="mini-icon"
                  ><ion-icon name="location-outline"></ion-icon
                ></span>

                <div class="view-wrap">
                  <p class="view-item-title">${name}</p>

                  <p class="view-item-subtitle">${state || ""}, ${country}</p>
                </div>

                <a href="#/weather?lat=${lat}&lon=${lon}" class="view-item-link has-state" data-search-toggler></a>
          `;
                    (_a = searchResult
                        .querySelector("[data-search-list]")) === null || _a === void 0 ? void 0 : _a.appendChild(searchedItem);
                    items.push(searchedItem.querySelector("[data-search-toggler]"));
                }
                multyEventsOnElements(items, "click", function (e) {
                    searchResult.classList.add("hidden");
                    searchField.value = "";
                });
            });
        }, searchTimeoutDuration);
    }
});
//////////////////     WEATHER UPDATE                //////////////////////
const currLocBtn = document.querySelector("[data-current-location-btn]");
const error = document.querySelector("[data-error]");
export const updateWeather = function (lat, lon) {
    const currentWeatherDiv = document.querySelector("[data-today-weather]");
    const incomingWeatherDiv = document.querySelector("[data-incoming-weather]");
    const todayInfoDiv = document.querySelector("[data-today-info]");
    const todayAtDiv = document.querySelector("[data-today-at]");
    currentWeatherDiv.innerHTML = "";
    incomingWeatherDiv.innerHTML = "";
    todayInfoDiv.innerHTML = "";
    todayAtDiv.innerHTML = "";
    error.style.display = "none";
    /////////////////////////// CURRENT WEATHER ////////////////////////////////
    fetchData(!url.currentWeather(lat, lon).includes("lat")
        ? url.currentWeather(lat, lon).replace("?", "?lat=").replace("&", "&lon=")
        : url.currentWeather(lat, lon), function (currentWeather) {
        const { weather: [{ description, icon }], dt: dateInSec, sys: { sunrise: sunriseInSec, sunset: sunsetInSec }, main: { temp, feels_like, pressure, humidity }, visibility, timezone, } = currentWeather;
        console.log(currentWeather);
        const card = document.createElement("div");
        card.classList.add("card", "today-weather");
        card.innerHTML = `
    <div class="upper-card">
      <div class="upper-up">
        <h2 class="card-title">NOW</h2>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" height="160" width="160"  alt="${description}">
      </div>

      <div class="upper-down">
        <p class="card-temp">${parseInt(temp)}&deg;<strong>C</strong></p>
         <p class="card-desc-sm">${description}</p>
      </div>
    </div>

    <ul class="under-list">
      <li class="under-item">
         <span class="mini-icon"
             ><ion-icon name="calendar-clear-outline"></ion-icon
             ></span>

            <p class="under-text">${module.getDate(dateInSec, timezone)}</p>
      </li>
      <li class="under-item">
          <span class="mini-icon"
             ><ion-icon name="location-outline"></ion-icon
             ></span>

            <p class="under-text" data-location></p>
      </li>
    </ul>
    `;
        fetchData(!url.reverseGeo(lat, lon).includes("lat")
            ? url.reverseGeo(lat, lon).replace("?", "?lat=").replace("&", "&lon=")
            : url.reverseGeo(lat, lon), function ([{ name, country }]) {
            card.querySelector("[data-location]").innerHTML = `${name}, ${country}`;
        });
        currentWeatherDiv.appendChild(card);
        /////////////////////////// TODAY INFO ////////////////////////////////
        fetchData(!url.airPollution(lat, lon).includes("lat")
            ? url
                .airPollution(lat, lon)
                .replace("?", "?lat=")
                .replace("&", "&lon=")
            : url.airPollution(lat, lon), function (airPollution) {
            const [{ main: { aqi }, components: { no2, o3, so2, pm2_5 }, },] = airPollution.list;
            const card = document.createElement("div");
            card.classList.add("card", "today-info");
            card.innerHTML = `
      <h2 class="card-title">Todays Info</h2>

          <!-- AIR -->
          <div class="air card-sm">
            <div class="air-quality">
              <p class="card-desc-sm">Air Quality Index</p>
              <p class="card-desc-sm colored colored-${aqi}" title="${module.aqi[aqi].message}">${module.aqi[aqi].level}</p>
            </div>
            <div class="air-other">
              <div class="icon-div">
                <i class="ph-duotone ph-wind card-icon-md"></i>
              </div>
              <div class="air-div-col">
                <p class="card-desc-vs">PM2.5</p>
                <p class="card-num">${Number(pm2_5)}</p>
              </div>
              <div class="air-div-col">
                <p class="card-desc-vs">SO2</p>
                <p class="card-num">${Number(so2)}</p>
              </div>

              <div class="air-div-col">
                <p class="card-desc-vs">NO2</p>
                <p class="card-num">${Number(no2)}</p>
              </div>
              <div class="air-div-col">
                <p class="card-desc-vs">O3</p>
                <p class="card-num">${Number(o3)}</p>
              </div>
            </div>
          </div>

          <!-- SUNSET-SUNRISE -->

          <div class="sunrise card-sm">
            <div class="sunrise-heading">
              <p class="card-desc-sm">Sunrise & Sunset</p>
            </div>
            <div class="sunrise-other">
              <div class="sunrise-box">
                <div class="icon-div">
                  <ion-icon
                    name="sunny-outline"
                    class="card-icon-md"
                  ></ion-icon>
                </div>
                <div class="sunrise-div-col">
                  <p class="card-desc-vs">Sunrise</p>
                  <p class="card-num">${module.getTime(sunriseInSec, timezone)}</p>
                </div>
              </div>
              <div class="sunrise-box">
                <div class="icon-div">
                  <ion-icon name="moon-outline" class="card-icon-md"></ion-icon>
                </div>
                <div class="sunrise-div-col">
                  <p class="card-desc-vs">Sunset</p>
                  <p class="card-num">${module.getTime(sunsetInSec, timezone)}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- HUMIDITY -->

          <div class="humidity card-sm">
            <div class="humidity-heading">
              <p class="card-desc-sm">Humidity</p>
            </div>
            <div class="humidity-other">
              <div class="icon-div">
                <i class="ph-duotone ph-drop-half-bottom card-icon-md"></i>
              </div>
              <div class="icon-div">
                <p class="card-num">${Number(humidity)}<span class="today-info-span">%</span></p>
              </div>
            </div>
          </div>

          <!-- PRESSURE -->

          <div class="pressure card-sm">
            <div class="pressure-heading">
              <p class="card-desc-sm">Pressure</p>
            </div>
            <div class="pressure-other">
              <div class="icon-div">
                <ion-icon name="filter-outline" class="card-icon-md"></ion-icon></i>
              </div>
              <div class="icon-div">
                <p class="card-num">${Number(pressure)}<span class="today-info-span" >hPa</span></p>
              </div>
            </div>
          </div>

          <!-- VISIBILITY -->

          <div class="visibility card-sm">
            <div class="visibility-heading">
              <p class="card-desc-sm">Visibility</p>
            </div>
            <div class="visibility-other">
              <div class="icon-div">
                <ion-icon name="eye-outline" class="card-icon-md"></ion-icon></i>
              </div>
              <div class="icon-div">
                <p class="card-num">${Number(visibility / 1000)}<span class="today-info-span">km</span></p>
              </div>
            </div>
          </div>

          <!-- FEELS-LIKE -->

          <div class="feels-like card-sm"><div class="humidity-heading">
              <p class="card-desc-sm">Feels Like</p>
            </div>
            <div class="feels-like-other">
              <div class="icon-div">
                <ion-icon name="thermometer-outline" class="card-icon-md"></ion-icon>
              </div>
              <div class="icon-div">
                <p class="card-num">${parseInt(feels_like)}<span class="today-info-span">&deg;c</span></p>
              </div>
            </div></div>
        
      `;
            todayInfoDiv.appendChild(card);
        });
        /////////////////////////// TODAY AT ////////////////////////////////
        fetchData(!url.incomingWeather(lat, lon).includes("lat")
            ? url
                .incomingWeather(lat, lon)
                .replace("?", "?lat=")
                .replace("&", "&lon=")
            : url.incomingWeather(lat, lon), function (incoming) {
            var _a;
            const { list: incomingList, city: { timezone }, } = incoming;
            console.log(incomingList);
            todayAtDiv.innerHTML = `
      <h2 class="today-at-title card-title">Today At</h2>
          
          

         
      `;
            for (const [index, data] of incomingList.entries()) {
                if (index > 7)
                    break;
                const { dt: dateInSec, main: { temp }, weather: [{ description, icon }], wind: { deg: windDirection, speed: windSpeed }, } = data;
                const miniCardTemp = document.createElement("div");
                miniCardTemp.classList.add("card", "today-at-box");
                miniCardTemp.innerHTML = `
        <p class="card-desc-sm">${module.getHours(dateInSec, timezone)}</p>
            <img
              src="https://openweathermap.org/img/wn/${icon}@2x.png"
              height="80"
              width="80"
              alt="${description}"
            />
            <p class="card-desc-sm">
              ${parseInt(temp)}<span class="today-info-span">&deg;</span>
            </p>
        `;
                todayAtDiv.appendChild(miniCardTemp);
                const miniCardWind = document.createElement("div");
                miniCardWind.classList.add("card", "today-at-box");
                miniCardWind.innerHTML = `
        <p class="card-desc-sm">${module.getHours(dateInSec, timezone)}</p>
            <ion-icon name="navigate-outline" class="card-icon-sm" style="transform: rotate(${windDirection + 140}deg)"></ion-icon>
            <p class="card-desc-sm">
              ${parseInt(module.mpsToKmh(windSpeed))} <span class="today-at-span">km/h</span>
            </p>
        `;
                setTimeout(() => {
                    todayAtDiv.appendChild(miniCardWind);
                }, 100);
            }
            /////////////////////////// INCOMING WEATHER ////////////////////////////////
            incomingWeatherDiv.innerHTML = `
    <h2 class="card-title">Incoming Weather</h2>
          <div class="card">
            <ul data-incoming-div>

            </ul>
          </div>
    `;
            for (let i = 7; i < incomingList.length; i += 8) {
                const { main: { temp_max }, weather: [{ description, icon }], dt_txt, } = incomingList[i];
                const date = new Date(dt_txt);
                const li = document.createElement("li");
                li.classList.add("card-item");
                li.innerHTML = `
      <div class="icon-container">
                  <img
                    src="https://openweathermap.org/img/wn/${icon}@2x.png"
                    height="60"
                    width="60"
                    alt="${description}"
                  />

                  <p class="card-desc-md">${parseInt(temp_max)}&deg;</p>
                </div>

                <p class="card-desc-sm">${date.getDate()} ${module.months[date.getMonth()]}</p>

                <p class="card-desc-sm">${module.days[date.getDay()]}</p>
      `;
                (_a = incomingWeatherDiv
                    .querySelector("[data-incoming-div]")) === null || _a === void 0 ? void 0 : _a.appendChild(li);
            }
        });
    });
};
export const error404 = () => (error.style.display = "flex");
