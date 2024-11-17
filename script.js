// script.js

const apiKey = '354de185870d4a3fa5761209241711'; // Your WeatherAPI key

document.getElementById('searchBtn').addEventListener('click', () => {
  const city = document.getElementById('city').value;
  if (city) {
    getWeatherByCity(city);
    getForecastByCity(city);
  } else {
    alert('Please enter a city name.');
  }
});

// Fetch Weather Data
function getWeatherByCity(city) {
  const apiURL = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
  fetchWeather(apiURL);
}

function getForecastByCity(city) {
  const apiURL = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7`;
  fetchForecast(apiURL);
  fetchHourlyForecast(apiURL);
}

function fetchWeather(apiURL) {
  fetch(apiURL)
    .then(response => response.json())
    .then(data => {
      updateWeather(data);
    })
    .catch(error => {
      alert('Failed to fetch weather data.');
      console.error(error);
    });
}

// Update Weather Info
function updateWeather(data) {
  document.getElementById('cityName').textContent = data.location.name;
  document.getElementById('temperature').textContent = `Temperature: ${data.current.temp_c}°C`;
  document.getElementById('description').textContent = `Condition: ${data.current.condition.text}`;
  document.getElementById('humidity').textContent = `Humidity: ${data.current.humidity}%`;
  document.getElementById('wind').textContent = `Wind Speed: ${data.current.wind_kph} km/h`;
  document.getElementById('weatherIcon').src = data.current.condition.icon;
  document.getElementById('weatherIcon').alt = data.current.condition.text;
}

// Fetch 7-Day Forecast
function fetchForecast(apiURL) {
  fetch(apiURL)
    .then(response => response.json())
    .then(data => {
      updateForecast(data.forecast.forecastday);
      renderChart(data.forecast.forecastday); // Render Chart
    })
    .catch(error => {
      alert('Failed to fetch forecast data.');
      console.error(error);
    });
}

// Update Forecast
function updateForecast(forecast) {
  const forecastContainer = document.getElementById('forecast');
  forecastContainer.innerHTML = ''; // Clear previous forecast

  forecast.forEach(day => {
    const forecastElement = document.createElement('div');
    forecastElement.classList.add('forecast-day');

    forecastElement.innerHTML = `
      <p><strong>${new Date(day.date).toDateString()}</strong></p>
      <img src="${day.day.condition.icon}" alt="${day.day.condition.text}" />
      <p>Max Temp: ${day.day.maxtemp_c}°C</p>
      <p>Min Temp: ${day.day.mintemp_c}°C</p>
      <p>${day.day.condition.text}</p>
    `;

    forecastContainer.appendChild(forecastElement);
  });
}

// Render Chart
function renderChart(forecast) {
  const dates = forecast.map(day => day.date);
  const temperatures = forecast.map(day => day.day.avgtemp_c);

  const ctx = document.getElementById('weatherChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: dates,
      datasets: [{
        label: 'Avg Temperature (°C)',
        data: temperatures,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
        tension: 0.4,
      }],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
        },
      },
    },
  });
}

// Fetch Hourly Forecast
function fetchHourlyForecast(apiURL) {
  fetch(apiURL)
    .then(response => response.json())
    .then(data => {
      updateHourlyForecast(data.forecast.forecastday[0].hour);
    })
    .catch(error => {
      alert('Failed to fetch hourly forecast.');
      console.error(error);
    });
}

// Update Hourly Forecast
function updateHourlyForecast(hourly) {
  const hourlyContainer = document.getElementById('hourlyForecast');
  hourlyContainer.innerHTML = ''; // Clear previous forecast

  hourly.forEach(hour => {
    const hourElement = document.createElement('div');
    hourElement.classList.add('hour');
    hourElement.innerHTML = `
      <p>${hour.time.split(' ')[1]}</p>
      <img src="${hour.condition.icon}" alt="${hour.condition.text}" />
      <p>${hour.temp_c}°C</p>
    `;
    hourlyContainer.appendChild(hourElement);
  });
}

document.getElementById('locationBtn').addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        getWeatherByCoordinates(latitude, longitude);
        getForecastByCoordinates(latitude, longitude);
      },
      error => {
        alert('Unable to fetch location. Please allow location access in your browser.');
        console.error(error);
      }
    );
  } else {
    alert('Geolocation is not supported by your browser.');
  }
});

// Fetch Weather Data by Coordinates
function getWeatherByCoordinates(lat, lon) {
  const apiURL = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}`;
  fetchWeather(apiURL);
}

function getForecastByCoordinates(lat, lon) {
  const apiURL = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=7`;
  fetchForecast(apiURL);
  fetchHourlyForecast(apiURL);
}

// Save Favorite Location
function saveFavoriteLocation(city) {
  localStorage.setItem('favoriteCity', city);
  alert(`Saved ${city} as your favorite location!`);
}

// Load Favorite Location on Page Load
function loadFavoriteLocation() {
  const favoriteCity = localStorage.getItem('favoriteCity');
  if (favoriteCity) {
    getWeatherByCity(favoriteCity);
    getForecastByCity(favoriteCity);
    alert(`Loaded weather for your favorite location: ${favoriteCity}`);
  }
}

// Add a "Save as Favorite" Button
document.getElementById('searchBtn').addEventListener('click', () => {
  const city = document.getElementById('city').value;
  if (city) {
    getWeatherByCity(city);
    getForecastByCity(city);

    // Add a save favorite prompt
    if (confirm('Do you want to save this city as your favorite location?')) {
      saveFavoriteLocation(city);
    }
  } else {
    alert('Please enter a city name.');
  }
});

// Load favorite location on page load
window.addEventListener('load', loadFavoriteLocation);

function toggleSpinner(show) {
  const spinner = document.getElementById('loadingSpinner');
  spinner.classList.toggle('hidden', !show);
}

// Modify the Geolocation API
document.getElementById('locationBtn').addEventListener('click', () => {
  if (navigator.geolocation) {
    toggleSpinner(true); // Show spinner
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        getWeatherByCoordinates(latitude, longitude);
        getForecastByCoordinates(latitude, longitude);
        toggleSpinner(false); // Hide spinner after fetching
      },
      error => {
        toggleSpinner(false); // Hide spinner on error
        alert('Unable to fetch location. Please allow location access in your browser.');
        console.error(error);
      }
    );
  } else {
    alert('Geolocation is not supported by your browser.');
  }
});