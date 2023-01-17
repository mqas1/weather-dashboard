# Weather Dashboard

## Description 

As a traveler it is essential to have knowledge of the weather conditions in order to plan the trip and the itinery of activities for when you arrive at your destination. And clothing – let's not forget that. Weather appropriate clothing is a must!

This web application aims to aid travelers in quickly accessing a five day forecast for searched cities. 

[Deployed GitHub Page](https://mqas1.github.io/weather-dashboard/)

![Screenshot of deployed application](/assets/images/screenshot.jpeg)

## Usage

The user enters a desired city in the search bar.

In a large card the current day's forecast is displayed. The data presented includes the city name, and date with a weather icon. Followed by the temperature, wind speed, and humidity.

Below the main card are five smaller cards displaying a further five day forecast. They provide the same data as the above larger card.

The search history is appended below the search bar and the respective forecast data can be accessed again by clicking on each list item.

## Credits

Application completed by Morgan Qasabian.

## Features

- The weather data is dynamically created in the browser with two successive API calls. First to the OpenWeather [Geocoding API](https://openweathermap.org/api/geocoding-api) and the second to the OpenWeather [5-Day Weather Forecast API](https://openweathermap.org/forecast5)
- Bootstrap is used as the CSS framework
- JavaScript is used to dynamically create the website and display the data from the APIs
- User searched cities are appended to the search history list. The list uses local storage to retrieve search results