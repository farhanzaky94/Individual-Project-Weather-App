document.addEventListener("DOMContentLoaded", function () {
  const loadingMessage = document.getElementById("loadingMessage");
  const cityNameElement = document.getElementById("cityName");
  const tempElement = document.getElementById("currentTemp");
  const windSpeedElement = document.getElementById("windSpeed");
  const humidityElement = document.getElementById("humidity");
  const weatherDescriptionElement =
    document.getElementById("weatherDescription");
  const searchButton = document.getElementById("searchButton");
  const cityInput = document.getElementById("cityInput");
  const dateElement = document.getElementById("date");
  const forecastContainers = document.querySelectorAll(".daily-forecast");

  function getWeatherDescription(code) {
    const descriptions = {
      0: "Clear Sky",
      1: "Mainly Clear",
      2: "Partly Cloudy",
      3: "Overcast",
      45: "Fog",
      48: "Depositing Rime Fog",
      51: "Drizzle: Light Intensity",
      53: "Drizzle: Moderate Intensity",
      55: "Drizzle: Dense Intensity",
      61: "Rain: Slight",
      63: "Rain: Moderate",
      65: "Rain: Heavy Intensity",
      71: "Snow: Slight",
      73: "Snow: Moderate",
      75: "Snow: Heavy Intensity",
      95: "Thunderstorm",
    };
    return descriptions[code] || "Unknown";
  }

  const apiKey = "2d595af8c14db7b44239c6032b679612";

  // Set current date
  function updateDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0"); // January is 0
    const year = today.getFullYear();
    dateElement.innerText = `${day}.${month}.${year}`;
  }

  function setLoading(isLoading) {
    loadingMessage.style.display = isLoading ? "block" : "none";
  }

  async function fetchWeatherData(city) {
    setLoading(true);
    try {
      // Fetch the coordinates of the city
      const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
      const geoResponse = await fetch(geoUrl);
      const geoData = await geoResponse.json();

      if (geoData.length === 0) {
        throw new Error("City not found");
      }

      const { lat, lon } = geoData[0];

      // Fetch the current weather data using the coordinates
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
      const weatherResponse = await fetch(weatherUrl);
      const weatherData = await weatherResponse.json();

      // Update the HTML elements with the fetched current weather data
      cityNameElement.innerText = city; // Show the city name input by user
      tempElement.innerText = `${weatherData.current_weather.temperature}°C`;
      windSpeedElement.innerText = `${weatherData.current_weather.windspeed} mph`;
      humidityElement.innerText = `${
        weatherData.current_weather.humidity || "N/A"
      }%`;
      weatherDescriptionElement.innerText = "Cloudy";

      // Fetch the weather forecast data for the next 6 days
      const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;
      const forecastResponse = await fetch(forecastUrl);
      const forecastData = await forecastResponse.json();

      // Log forecast data to see the response structure
      console.log("Forecast Data:", forecastData);

      // Check if the response contains forecast data
      if (
        !forecastData.daily ||
        !Array.isArray(forecastData.daily.temperature_2m_max)
      ) {
        throw new Error("Forecast data not available");
      }

      // Update the HTML elements with the forecast data
      const maxTemps = forecastData.daily.temperature_2m_max;
      const minTemps = forecastData.daily.temperature_2m_min;

      forecastContainers.forEach((element, index) => {
        if (index < maxTemps.length) {
          const dayName = getDayName(index + 1);
          const maxTemp = maxTemps[index];
          const minTemp = minTemps[index];

          element.innerHTML = `
            <p>${dayName}</p>
            <p>${maxTemp}°C / ${minTemp}°C</p>
          `;
        }
      });
    } catch (error) {
      console.error("Error fetching weather data:", error);
      cityNameElement.innerText = "Error fetching data";
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  // Function to get the day name based on the index
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

  // Event listener to the search button to fetch data when clicked
  searchButton.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) {
      fetchWeatherData(city);
    } else {
      alert("Please enter a city name");
    }
  });

  // Update date
  updateDate();
});
