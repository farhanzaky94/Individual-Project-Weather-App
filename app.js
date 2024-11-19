document.addEventListener("DOMContentLoaded", async function () {
  const loadingMessage = document.getElementById("loadingMessage");
  const cityNameElement = document.getElementById("cityName");
  const tempElement = document.getElementById("currentTemp");
  const windSpeedElement = document.getElementById("windSpeed");
  const humidityElement = document.getElementById("humidity");
  const weatherDescriptionElement =
    document.getElementById("weatherDescription");

  const apiUrl =
    "https://api.open-meteo.com/v1/forecast?latitude=1.1494&longitude=104.0249&current_weather=true&daily=temperature_2m_max,temperature_2m_min&timezone=auto";

  function setLoading(isLoading) {
    loadingMessage.style.display = isLoading ? "block" : "none";
  }

  setLoading(true);

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    const cityName = "Your City";
    const temperature = data.current_weather.temperature;
    const windSpeed = data.current_weather.windspeed;
    const humidity = data.current_weather.humidity || "N/A";
    const weatherDescription = "Cloudy";

    cityNameElement.innerText = cityName;
    tempElement.innerText = `${temperature}°`;
    windSpeedElement.innerText = `${windSpeed} mph`;
    humidityElement.innerText = `${humidity}%`;
    weatherDescriptionElement.innerText = weatherDescription;

    const forecastElements = document.querySelectorAll(".daily-forecast");
    const dailyData = data.daily;

    forecastElements.forEach((element, index) => {
      if (index < dailyData.temperature_2m_max.length) {
        const dayName = getDayName(index);
        const maxTemp = dailyData.temperature_2m_max[index];
        const minTemp = dailyData.temperature_2m_min[index];

        element.innerHTML = `
          <p>${dayName}</p>
          <p>${maxTemp}&deg; / ${minTemp}&deg;</p>
        `;
      }
    });
  } catch (error) {
    console.error("Error fetching weather data:", error);
    cityNameElement.innerText = "Error fetching data";
  } finally {
    setLoading(false);
  }
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

function getWeatherIconUrl(weatherDescription) {
  switch (weatherDescription.toLowerCase()) {
    case "clear sky":
      return "icons/clear-sky.png";
    case "cloudy":
      return "icons/cloudy.png";
    case "rain":
    case "rainy":
      return "icons/rain.png";
    default:
      return ""; //incase no icon found
  }
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
