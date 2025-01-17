const apiKey = "46d6d79e16e686a253f5d27221c10827"; // Ваш ключ OpenWeatherMap

const button = document.getElementById("get-weather");
const cityInput = document.getElementById("city-input");
const weatherDetails = document.getElementById("weather-details");
const cityName = document.getElementById("city-name");
const temperature = document.getElementById("temperature");
const weatherDescription = document.getElementById("weather-description");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");

// Ініціалізація карти
const map = L.map("map").setView([50.4501, 30.6018], 5); // Початкові координати (Київ)

// Додавання OpenStreetMap шару для карти
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

// Функція для отримання погодних даних
async function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=uk`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod === 200) {
      // Відображення даних про погоду
      cityName.textContent = `${data.name}, ${data.sys.country}`;
      temperature.textContent = `Температура: ${data.main.temp}°C`;
      weatherDescription.textContent = `Опис: ${data.weather[0].description}`;
      humidity.textContent = `Вологість: ${data.main.humidity}%`;
      windSpeed.textContent = `Швидкість вітру: ${data.wind.speed} м/с`;

      // Показати деталі погоди
      weatherDetails.style.display = "block";

      // Ініціалізація карти з вітром
      showWindyMap(data.coord.lat, data.coord.lon); // Передаємо координати
    } else {
      alert("Місто не знайдено!");
    }
  } catch (error) {
    alert("Помилка при отриманні даних!");
  }
}

// Функція для відображення карти з вітром
function showWindyMap(lat, lon) {
  // Оновлюємо центр карти
  map.setView([lat, lon], 6);

  // Завантаження даних про вітер
  fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,daily&appid=${apiKey}&units=metric&lang=uk`
  )
    .then((response) => response.json())
    .then((data) => {
      const windData = data;

      // Додавання шару для вітру
      L.velocityLayer({
        displayValues: true,
        displayOptions: { velocityType: "km/h", position: "bottomleft" },
        data: windData,
        maxVelocity: 100,
      }).addTo(map);
    });
}

// Обробка події натискання на кнопку
button.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    getWeather(city);
  } else {
    alert("Будь ласка, введіть назву міста!");
  }
});
