document.addEventListener("DOMContentLoaded", function () {
  const apiUrl =
    "https://api.open-meteo.com/v1/forecast?latitude=1.1494&longitude=104.0249&current_weather=true";

  document.getElementById("loadingMessage").style.display = "block";

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const cityName = "Your City";
      const temperature = data.current_weather.temperature;
      const windSpeed = data.current_weather.windspeed;
      const humidity = data.current_weather.humidity || "N/A";
      const weatherDescription = "Cloudy";

      document.getElementById("cityName").innerText = cityName;
      document.getElementById("currentTemp").innerText = `${temperature}°`;
      document.getElementById("windSpeed").innerText = `${windSpeed} mph`;
      document.getElementById("humidity").innerText = `${humidity}%`;
      document.getElementById("weatherDescription").innerText =
        weatherDescription;

      document.getElementById("loadingMessage").style.display = "none";
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
      document.getElementById("cityName").innerText = "Error fetching data";

      document.getElementById("loadingMessage").style.display = "none";
    });
});

function getDayName(index) {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const today = new Date();
  return daysOfWeek[(today.getDay() + index) % 7];
}
const today = new Date();
forecastElements.forEach((element, index) => {
  if (index < dailyData.temperature_2m_max.length) {
    const dayName = getDayName(index, today);
    const maxTemp = dailyData.temperature_2m_max[index];
    const minTemp = dailyData.temperature_2m_min[index];

    element.innerHTML = `
      <p>${dayName}</p>
      <p>${maxTemp}&deg; / ${minTemp}&deg;</p>
    `;
  }
});
