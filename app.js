const apiUrl =
  "https://api.open-meteo.com/v1/forecast?latitude=1.1494&longitude=104.0249&daily=temperature_2m_max,temperature_2m_min&current_weather=true&timezone=auto";

fetch(apiUrl)
  .then((response) => response.json())
  .then((data) => {
    const dailyData = data.daily;
    const forecastElements = document.querySelectorAll(".daily-forecast");

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
  })
  .catch((error) => console.error("Error fetching weather data:", error));

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
