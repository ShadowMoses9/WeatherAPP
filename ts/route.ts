import { defaultLocation } from "./config.js";
import { updateWeather, error404 } from "./app.js";

const currentLocation = function () {
  window.navigator.geolocation.getCurrentPosition(
    (success) => {
      const { latitude, longitude } = success.coords;
      console.log();

      updateWeather(latitude, longitude);
    },
    (error) => {
      window.location.hash = defaultLocation;
    }
  );
};

const searchedLocation = function (query: string) {
  updateWeather(...query.split("&")); // updateWeather("lat=...", "lon=...")
  console.log("in searched");
};

const routes = new Map([
  ["/current-location", currentLocation],
  ["/weather", searchedLocation],
]);

const hash = function () {
  const url = window.location.hash.slice(1);
  console.log("in hash");

  const [route, query] = url.split("?");

  routes.get(route) ? routes.get(route)!(query) : error404();
};

window.addEventListener("hashchange", hash);

window.addEventListener("load", function () {
  if (!window.location.hash) {
    window.location.hash = "#/current-location";
  } else {
    hash();
  }
});
