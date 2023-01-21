// Declaring variables to be used in DOM manipulation in the functions below.
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

// Declaring arrays that will be used to store data needed for the application.
// Namely the forecast, and search history, respectively.
var fiveDayTemp = [];
var cityArr = [];

// Event listener for deleting search history/local storage.
deleteBtn.addEventListener("click", () => {
    localStorage.clear();
    location.reload();
});

// Event listener for the searched city. It ties together all the successive functions,
// by feeding the searched city to the API calls to get the weather data as well as saving the
// search result to local storage.
searchBtn.addEventListener("click", (event) => {
    event.preventDefault();
    clearPage();
    searchCity(userInput.value);
    displayError.textContent="";
    spinnerEl.classList.remove("invisible");
    spinnerEl.classList.add("visible");
    fiveDayTemp = [];
    saveCity(getCityName(userInput.value));
    location.reload();
})

// Function to clear the DOM if there is unwanted data displayed in the browser,
// i.e, previous weather data.
const clearPage = () => {
    let clearMainWeather = document.getElementById("weather-card-lg");

    if (clearMainWeather !== null && futureForecastEl !== null){
        clearMainWeather.remove();
        let childCount = futureForecastEl.childElementCount
        for (let i=0 ; i < childCount ; i++){
            futureForecastEl.removeChild(futureForecastEl.firstElementChild);
        }
    }
}

// Function to convert the user search into the geographic coordinates.
const searchCity = (city) => {
     
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

// Geographic coordinates then fed into second API which then displays the data to the page.
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

// Filters the JSON response array of 40 results to only show those for 12pm.
// Pushes these results into the fiveDayTemp array.
                if (data.list[i].dt_txt.split(" ")[1] === "00:00:00" &&
                    data.list[i].dt_txt.split(" ")[0] !== data.list[0].dt_txt.split(" ")[0]){
                        fiveDayTemp.push(data.list[i]);
                } 
            }

// Creates the main/current weather card from the first index in the array.
            let currWeather = document.createElement("div");
            currWeather.setAttribute("class", "card text-center text-md-start");
            currWeather.setAttribute("id", "weather-card-lg");
            currForecastEl.appendChild(currWeather);
            
            let cardDate = dayjs(data.list[0].dt * 1000).format("D/M/YYYY");
            let cardIcon = `http://openweathermap.org/img/wn/${data.list[0].weather[0].icon}.png`;
            currWeather.innerHTML = `<h4>${data.city.name} (${cardDate}) <img src=${cardIcon}></h4>
                                     <p>Temp: ${data.list[0].main.temp}°C</p>
                                     <p>Wind: ${data.list[0].wind.speed} KPH</p>
                                     <p>Humidity: ${data.list[0].main.humidity}%</p>`;
            spinnerEl.classList.remove("visible");
            spinnerEl.classList.add("invisible");

            let futureHeading = document.createElement("h4");
            futureHeading.setAttribute("class", "text-center text-md-start");
            futureHeading.textContent = "5-Day Forecast:"
            futureForecastEl.appendChild(futureHeading);

// Loops over the remaining indices to create the further five day forecast
            for (let j = 0; j < fiveDayTemp.length; j++) {
                let futureCard = document.createElement("div");
                futureCard.setAttribute("class", "card col-sm-2 text-center text-md-start mx-1 bg-primary text-light");
                let futureDate = dayjs(fiveDayTemp[j].dt * 1000).format("D/M/YYYY");
                let futureIcon = `http://openweathermap.org/img/wn/${fiveDayTemp[j].weather[0].icon}.png`;
                futureCard.innerHTML = `<h5 class="pt-3">${futureDate}
                                        <br>
                                        <img src=${futureIcon}></h5>
                                        <p>Temp: ${fiveDayTemp[j].main.temp}°C</p>
                                        <p>Wind: ${fiveDayTemp[j].wind.speed} KPH</p>
                                        <p>Humidity: ${fiveDayTemp[j].main.humidity}%</p>`;
                futureForecastEl.appendChild(futureCard);
            }

// If the data does not generate a 5th day, the last card is generated and tells the user that the data is currently unavailable.
            if (fiveDayTemp.length < 5){
                let errCard = document.createElement("div");
                errCard.setAttribute("class", "card mx-1 bg-primary text-light text-center");
                futureForecastEl.appendChild(errCard);
                errCard.innerHTML = `<h5 class="py-3">Data currently unavailable</h5>`;
            }
        }) 
}

// Function for capitalising user search history.
const getCityName = () =>{

    let cityName = userInput.value.split(" ");
    for (let x = 0; x < cityName.length; x++){
        cityName[x] = cityName[x][0].toUpperCase() + cityName[x].substr(1).toLowerCase();
    }
        return cityName.join(" ");
    }

// Once the user search has been capitalised it is then added to local storage as a JSON string.
const saveCity = (city) => {
    let storedCities = localStorage.getItem("cities");
    if (storedCities !== null) {
        storedCities = JSON.parse(localStorage.getItem("cities"));
    } else { 
        storedCities = [];
    }

    if (!storedCities.includes(city)){
        storedCities.push(city);
    } else {
        return
    }
    
    localStorage.setItem("cities", JSON.stringify(storedCities));
}

// The JSON string is parsed and an array is created from the stored cities, in reverse order
// for a more intuitive UI. From this array the search history list is generated.
const cityList = () => {
    let storedCities = JSON.parse(localStorage.getItem("cities")).reverse();
    if (!storedCities) {
        return
    } else {
        for (let i = 0; i< storedCities.length; i++) {
            if (!cityArr.includes(storedCities[i])){
                cityArr.push(storedCities[i]);
            }
        } 
    }
    const cityListEl = document.getElementById("city-list");
    for (let j = 0; j < cityArr.length; j++){
        let listItem = document.createElement("li");
        listItem.setAttribute("class", "list-group-item text-center text-md-start");
        listItem.textContent = cityArr[j];
        cityListEl.appendChild(listItem);

        listItem.addEventListener("click", (event) => {
            let element = event.target;
            if (element.matches("li") === true){
                clearPage();
                fiveDayTemp = [];
                searchCity(listItem.textContent);
                displayError.textContent="";
            }
        })
    }
}

// Function to display the last search result on the page upon refresh and calls
// the above search history function.
const init = () => {
    cityList();   
    let storedCities = JSON.parse(localStorage.getItem("cities"));
    if (storedCities !== null) {
        var lastCity = storedCities[storedCities.length - 1];
    } else {
        return;
    }
        searchCity(lastCity);
}

init();