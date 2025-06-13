// Add your API Key here
const apiKey = "3385af5b247b2279ed9847a1d3bc4305";

// DOM Elements
const searchBox = document.querySelector(".search-box");
const searchBtn = document.querySelector(".search-button");

// Function to fetch and display weather
async function getWeather(city) {
  if (!city) {
    alert("Please enter a city name.");
    return;
  }

  // API URLs for current weather and 5-day forecast
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  try {
    // Fetch both current weather and forecast data in parallel
    const [currentWeatherResponse, forecastResponse] = await Promise.all([
      fetch(currentWeatherUrl),
      fetch(forecastUrl),
    ]);

    if (!currentWeatherResponse.ok || !forecastResponse.ok) {
      throw new Error("City not found or API error.");
    }

    const currentWeatherData = await currentWeatherResponse.json();
    const forecastData = await forecastResponse.json();

    // Update the UI with the fetched data
    displayCurrentWeather(currentWeatherData);
    displayHourlyForecast(forecastData.list);
    displayDailyForecast(forecastData.list);
  } catch (error) {
    alert(error.message);
    console.error("Error fetching weather data:", error);
  }
}

// Display Current Weather
function displayCurrentWeather(data) {
  document.querySelector(".city").textContent = data.name;
  document.querySelector(".date").textContent = new Date().toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );
  document.querySelector(".temperature").textContent = `${Math.round(
    data.main.temp
  )}°`;
  document.querySelector(".weather-description").textContent =
    data.weather[0].description;

  // Update main weather icon
  const mainIconContainer = document.querySelector(".weather-icon-main");
  mainIconContainer.innerHTML = getWeatherIcon(data.weather[0].main);

  // Update details
  document.querySelector(".humidity").textContent = `${data.main.humidity}%`;
  document.querySelector(".wind-speed").textContent = `${data.wind.speed} km/h`;
  document.querySelector(".feels-like").textContent = `${Math.round(
    data.main.feels_like
  )}°`;
}

// Display Hourly Forecast (for the next 24 hours)
function displayHourlyForecast(hourlyData) {
  const hourlyContainer = document.querySelector(".hourly-forecast-container");
  hourlyContainer.innerHTML = ""; // Clear previous forecast

  const next24Hours = hourlyData.slice(0, 10); // Get the next 6 * 3-hour forecasts
  console.log(hourlyData);

  next24Hours.forEach((item) => {
    const hour = new Date(item.dt * 1000).getHours();
    const temp = Math.round(item.main.temp);
    const icon = getWeatherIcon(item.weather[0].main);

    const hourlyItem = `
            <div class="hourly-card">
                <p>${hour}:00</p>
                ${icon}
                <p>${temp}°</p>
            </div>
        `;
    hourlyContainer.innerHTML += hourlyItem;
  });
}

// Display 5-Day Forecast
function displayDailyForecast(dailyData) {
  const dailyContainer = document.querySelector(".daily-forecast-container");
  dailyContainer.innerHTML = "";

  // Filter to get one forecast per day (around midday)
  const dailyForecasts = dailyData.filter((item) =>
    item.dt_txt.includes("12:00:00")
  );

  dailyForecasts.forEach((item) => {
    const dayName = new Date(item.dt * 1000).toLocaleDateString("en-US", {
      weekday: "short",
    });
    const temp = Math.round(item.main.temp);
    const icon = getWeatherIcon(item.weather[0].main);

    const dailyItem = `
            <div class="daily-card">
                <p class="day-name">${dayName}</p>
                 ${icon}
                <p>${temp}°</p>
            </div>
        `;
    dailyContainer.innerHTML += dailyItem;
  });
}

// Get Weather Color based on condition
function getWeatherIcon(condition) {
  switch (condition) {
    case "Clear":
      return '<i class="fa-solid fa-sun" style="color: #f7b733;"></i>';
    case "Clouds":
      return '<i class="fa-solid fa-cloud" style="color: #b0bec5;"></i>';
    case "Rain":
    case "Drizzle":
      return '<i class="fa-solid fa-cloud-showers-heavy" style="color: #5b92e5;"></i>';
    case "Thunderstorm":
      return '<i class="fa-solid fa-bolt" style="color: #f1c40f;"></i>';
    case "Snow":
      return '<i class="fa-solid fa-snowflake" style="color: #d4eaf7;"></i>';
    case "Mist":
    case "Fog":
    case "Haze":
      return '<i class="fa-solid fa-smog" style="color: #95a5a6;"></i>';
    default:
      return '<i class="fa-solid fa-question" style="color: #ffffff;"></i>';
  }
}

// Event Listeners for search
searchBtn.addEventListener("click", () => {
  getWeather(searchBox.value);
});
searchBox.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    getWeather(searchBox.value);
  }
});

// Optional: Load a default city on page load
window.addEventListener("load", () => {
  getWeather("London");
});
