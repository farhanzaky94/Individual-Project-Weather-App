const apiUrl =
  "https://api.open-meteo.com/v1/forecast?latitude=1.1494&longitude=104.0249&daily=temperature_2m_max,temperature_2m_min&current_weather=true&timezone=auto";

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
