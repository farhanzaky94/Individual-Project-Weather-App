async function getWeatherForecast() {
  const city = document.getElementById("cityInput").value;
  const apiKey = "b09bf4080fbc958fcaed1abfd5e6cb62"; // Replace with your OpenWeatherMap API key
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("City not found");
    }
    const data = await response.json();
    displayWeatherForecast(data);
  } catch (error) {
    document.getElementById(
      "forecastDisplay"
    ).innerHTML = `<p>${error.message}</p>`;
  }
}

function displayWeatherForecast(data) {
  // Clear previous forecast
  document.getElementById("forecastDisplay").innerHTML = "";

  // Extract weather data and organize it by day
  const forecastMap = {};
  data.list.forEach((forecast) => {
    const date = forecast.dt_txt.split(" ")[0]; // Get the date part of the timestamp

    if (!forecastMap[date]) {
      forecastMap[date] = {
        day: new Date(date).toLocaleDateString("en-US", { weekday: "long" }),
        minTemp: forecast.main.temp_min,
        maxTemp: forecast.main.temp_max,
        description: forecast.weather[0].description,
        icon: forecast.weather[0].icon,
      };
    } else {
      forecastMap[date].minTemp = Math.min(
        forecastMap[date].minTemp,
        forecast.main.temp_min
      );
      forecastMap[date].maxTemp = Math.max(
        forecastMap[date].maxTemp,
        forecast.main.temp_max
      );
    }
  });

  // Extract the first 5 days from the forecastMap and display them
  const dates = Object.keys(forecastMap).slice(0, 5);
  dates.forEach((date) => {
    const forecast = forecastMap[date];

    const forecastHTML = `
            <div class="forecast-card">
                <div class="forecast-day">${forecast.day}</div>
                <img src="http://openweathermap.org/img/wn/${
                  forecast.icon
                }@2x.png" alt="${forecast.description}">
                <div class="forecast-temp">${forecast.maxTemp.toFixed(
                  1
                )}°C</div>
                <div class="forecast-date">${new Date(
                  date
                ).toLocaleDateString()}</div>
            </div>
        `;

    document.getElementById("forecastDisplay").innerHTML += forecastHTML;
  });
}
