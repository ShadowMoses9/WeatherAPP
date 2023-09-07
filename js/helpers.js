export const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];
export const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];
export const getDate = function (dateInSec, timezone) {
    const date = new Date((dateInSec + timezone) * 1000);
    const day = days[date.getUTCDay()];
    const month = months[date.getUTCMonth()];
    return `${day} ${date.getUTCDate()}, ${month}`;
};
export const getTime = function (timeInSec, timezone) {
    const date = new Date((timeInSec + timezone) * 1000);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const timePeriod = hours >= 12 ? "PM" : "AM";
    return `${hours % 12 || 12}:${minutes} ${timePeriod}`;
};
export const getHours = function (timeInSec, timezone) {
    const date = new Date((timeInSec + timezone) * 1000);
    const hours = date.getUTCHours();
    const timePeriod = hours >= 12 ? "PM" : "AM";
    return `${hours % 12 || 12} ${timePeriod}`;
};
export const mpsToKmh = function (mps) {
    const mph = mps * 3600;
    return mph / 1000;
};
export const aqi = {
    1: {
        level: "Good",
        message: "Air quality is considered satisfactory",
    },
    2: {
        level: "Fair",
        message: "Air quality is acceptable",
    },
    3: {
        level: "Moderate",
        message: "Members of sensitive group may have health effects",
    },
    4: { level: "Poor", message: "Everyone may have health effects" },
    5: {
        level: "Very Poor",
        message: "The entire population is more likely to be affected",
    },
};
