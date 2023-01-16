var deleteBtn = document.getElementById("delete-btn");
var searchBtn = document.getElementById("search-btn");
var userInput = document.getElementById("search-input");

var displayError = document.createElement("h4");
var searchEl = document.getElementById("search-div");
searchEl.appendChild(displayError);

var currForecastEl = document.getElementById("current-forecast");
var futureForecastEl = document.getElementById("future-forecast");

var spinnerEl = document.getElementById("spinner");
var dataEl = document.getElementById("data-div");

var middayTemp = [];

deleteBtn.addEventListener("click", () => {
    localStorage.clear();
    location.reload();
});

searchBtn.addEventListener("click", (event) => {
    event.preventDefault();
    clearPage();
    searchCity(userInput.value);
    displayError.textContent="";
    spinnerEl.classList.remove("invisible");
    spinnerEl.classList.add("visible");
    middayTemp = [];
})

const clearPage = () => {
    let clearMainWeather = document.getElementById("weather-card-lg");

    if (clearMainWeather !== null && futureForecastEl !== null){
        clearMainWeather.remove();
        let childrenNum = futureForecastEl.childElementCount
        for (let i=0 ; i < childrenNum ; i++){
            futureForecastEl.removeChild(futureForecastEl.firstElementChild);
        }
    }
}

var searchCity = (city) => {
    
var apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=c1b997a8a4d7448487ac1de7b291dca2`;

fetch(apiUrl, {
    method: "GET"
})
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        if (!data[0]) {
            displayError.textContent = "City not found!";
        } else {
            var lat = data[0].lat;
            var lon = data[0].lon;

            getWeather(lat, lon);
        }
    })
}

var getWeather = (lat, lon) => {
    
    apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=c1b997a8a4d7448487ac1de7b291dca2&units=metric`;
    fetch(apiUrl, {
        method: "GET"
    })
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            for (let i = 0; i < data.list.length; i++) {
                    
                if (data.list[i].dt_txt.split(" ")[1] === "12:00:00"){
                    middayTemp.push(data.list[i]);
                } 
            }

            let currWeather = document.createElement("div");
            currWeather.setAttribute("class", "card");
            currWeather.setAttribute("id", "weather-card-lg");
            currForecastEl.appendChild(currWeather);
            
            let cardDate = dayjs(middayTemp[0].dt * 1000).format("D/M/YYYY");
            let cardIcon = `http://openweathermap.org/img/w/${middayTemp[0].weather[0].icon}.png`;
            currWeather.innerHTML = `<h4>${data.city.name} (${cardDate}) <img src=${cardIcon}></h4>
                                    <p>Temp: ${middayTemp[0].main.temp}°C</p><p>Wind: ${middayTemp[0].wind.speed}KPH</p>
                                    <p>Humidity: ${middayTemp[0].main.humidity}%</p>`;
            spinnerEl.classList.remove("visible");
            spinnerEl.classList.add("invisible");

            let futureHeading = document.createElement("h4");
            futureHeading.textContent = "5-Day Forecast:"
            futureForecastEl.appendChild(futureHeading);

            for (let j = 1; j < middayTemp.length; j++) {
                let futureCard = document.createElement("div");
                futureCard.setAttribute("class", "card col-2 mx-1 bg-primary text-light");
                let futureDate = dayjs(middayTemp[j].dt * 1000).format("D/M/YYYY");
                let futureIcon = `http://openweathermap.org/img/w/${middayTemp[j].weather[0].icon}.png`;
                futureCard.innerHTML = `<h5 class="pt-3">${futureDate}<br><img src=${futureIcon}></h5>
                                        <p>Temp: ${middayTemp[j].main.temp}°C</p><p>Wind: ${middayTemp[j].wind.speed}KPH</p>
                                        <p>Humidity: ${middayTemp[j].main.humidity}%</p>`;
                futureForecastEl.appendChild(futureCard);
            }

            if (middayTemp.length < 6){
                let errCard = document.createElement("div");
                errCard.setAttribute("class", "card col-2 mx-1 bg-primary text-light text-center");
                futureForecastEl.appendChild(errCard);
                errCard.innerHTML = `<h5 class="py-3">Data currently unavailable</h5>`;
            }
        }) 
}