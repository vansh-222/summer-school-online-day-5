document.addEventListener("DOMContentLoaded", () => {
  const weatherBox = document.getElementById("weatherBox");
  const checkBtn = document.getElementById("checkWeatherBtn");
  const toggleUnit = document.getElementById("toggleUnit");
  const loader = document.getElementById("loader");

  const iconBox = document.getElementById("weatherIconBox");
  const place = document.getElementById("placeName");
  const temp = document.getElementById("tempValue");
  const status = document.getElementById("weatherStatus");

  const bgColors = {
    Clear: "#f9d342",
    Clouds: "#7baaf7",
    Rain: "#4a90e2",
    Thunderstorm: "#6c5ce7",
    Snow: "#81ecec",
    Fog: "#b2bec3",
  };

  function setBackground(weatherType) {
    const color = bgColors[weatherType] || "#a29bfe";
    weatherBox.style.backgroundColor = color;
  }

  const saved = localStorage.getItem("lastWeather");
  if (saved) {
    const data = JSON.parse(saved);
    iconBox.innerHTML = `<img src="${data.icon}" alt="icon">`;
    place.textContent = data.city;
    temp.textContent = `🌡️ ${data.temp}${data.tempUnit}`;
    status.textContent = `☁️ ${data.condition}`;
    weatherBox.classList.remove("hide");
    setBackground(data.weatherType);
  }

  checkBtn.addEventListener("click", () => {
    weatherBox.classList.add("hide");
    loader.style.display = "block";

    const latitude = 32.265942;  // Pathankot
    const longitude = 75.646873;
    const apiKey = "84c2418c6ab340985f66c134e0be7775";

    const useFahrenheit = toggleUnit.checked;
    const unitType = useFahrenheit ? "imperial" : "metric";
    const symbol = useFahrenheit ? "°F" : "°C";

    const apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${unitType}&appid=${apiKey}`;

    fetch(apiURL)
      .then(response => {
        if (!response.ok) throw new Error("Error fetching weather");
        return response.json();
      })
      .then(data => {
        const city = data.name;
        const tempValue = Math.round(data.main.temp);
        const weatherText = data.weather[0].description;
        const iconId = data.weather[0].icon;
        const mainType = data.weather[0].main;
        const iconLink = `https://openweathermap.org/img/wn/${iconId}@2x.png`;

        iconBox.innerHTML = `<img src="${iconLink}" alt="icon">`;
        place.textContent = city;
        temp.textContent = `🌡️ ${tempValue}${symbol}`;
        status.textContent = `☁️ ${weatherText}`;

        setBackground(mainType);
        weatherBox.classList.remove("hide");
        loader.style.display = "none";

        const saveThis = {
          city,
          temp: tempValue,
          condition: weatherText,
          icon: iconLink,
          tempUnit: symbol,
          weatherType: mainType
        };
        localStorage.setItem("lastWeather", JSON.stringify(saveThis));
      })
      .catch(() => {
        loader.style.display = "none";
        weatherBox.classList.remove("hide");
        iconBox.innerHTML = "";
        place.textContent = "";
        temp.textContent = "";
        status.textContent = "❌ Couldn't get weather info";
        weatherBox.style.backgroundColor = "#ff6b6b";
      });
  });
});
