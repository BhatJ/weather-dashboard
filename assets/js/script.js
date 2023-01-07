// Weather dashboard 

const weatherApiKey = "2ceea9234e7f11c55707a7299e43d1c6";
const cityCountId = 'city-count';

$(function () 
{
    // check if 'city-count' has been saved to local storage
    // if it has not, save and set it to zero.
    if (localStorage.getItem(cityCountId) === null)
    {
        localStorage.setItem(cityCountId, 0);
    }
    
    // Restore  saved sity list
    restoreCityList();

    // Add listener for city search form
    $('#search-form').on('submit', handleSearch);

    // Add listeners for city buttons
    var cityButtons = $("[id^=city-]");
    cityButtons.on('click', handleCitySelect);
});

var addCity = function(cityName)
{
    // construct gecoding URL
    var geocodingUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&appid=' + weatherApiKey;

    // fetch geographical coordinates using geocoding API call
    fetch(geocodingUrl) 
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {

            // check if a city was found
            if (data.length)
            {
                // a city has been found.

                // Save to local storage
                var city = {"name": cityName,
                            "lat": data[0].lat,
                            "lon": data[0].lon
                           };
                var cityCount = parseInt(localStorage.getItem(cityCountId)); 
                var newCityId = 'city-' + cityCount;

                // Update cityCount
                cityCount++;

                // Update the cityCount in local storage and save new city object
                localStorage.setItem(cityCountId, cityCount);
                localStorage.setItem(newCityId, JSON.stringify(city));

                // add a button
                addCityButton(cityName, newCityId);

                // update weather information with new cities weather
                displayWeather(city);
            } else
            {
                console.log('Enter a valid city!')
                return;
            }
        });
}

var addCityButton = function(cityName, cityId)
{
    // Append new city button
    $('#search-list').append($('<button id="' + cityId + '" class="btn col-12 btn-secondary mb-3">' + cityName + '</button>'));

    // Add listener for city buttons
    var cityButtons = $("[id^=city-]");
    cityButtons.on('click', handleCitySelect);
}

var restoreCityList = function()
{
    // Retrieve the stored count
    var cityCount = parseInt(localStorage.getItem(cityCountId)); 

    // Check if any cities have been saved
    if (cityCount === 0)
    {
        return;
    }

    // Add a button for each of the saved cities
    for (var i = 0; i < cityCount; i++)
    {
        var city = JSON.parse(localStorage.getItem('city-'+i));
        addCityButton(city.name, 'city-'+i);


        if (i === 0)
        {
            displayWeather(city);
        }
    }

}

var displayWeather = function (city) 
{
    // Construct openweathermap query
    var apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat='+ city.lat + '&lon=' + city.lon + '&appid=' + weatherApiKey;
    const weatherAPIIconBaseUrl = 'https://openweathermap.org/img/wn/';

    // Request data
    fetch(apiUrl) 
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data)

            console.log(data.list[0]);
            console.log(data.list[8]);
            console.log(data.list[16]);
            console.log(data.list[24]);
            console.log(data.list[32]);

            
            $('#weather-city')[0].innerHTML = city.name + " " + dayjs.unix(data.list[0].dt).format('(MM/DD/YYYY)') + '<img src=' + weatherAPIIconBaseUrl + data.list[0].weather[0].icon + '.png'+'>';
            $('#weather-temp')[0].innerHTML = "Temp: " + (data.list[0].main.temp/10.0).toFixed(2) + " °C";
            $('#weather-wind')[0].innerHTML = "Wind: "+ data.list[0].wind.speed + " MPH";
            $('#weather-humidity')[0].innerHTML = "Humidity: " + data.list[0].main.humidity + " %";


            for (var i = 0, j = 0; i < 5; i++, j+=8)
            {
                $('#forecast-' + i + '-city')[0].innerHTML = dayjs.unix(data.list[j].dt).format('MM/DD/YYYY');
                $('#forecast-' + i + '-icon')[0].src = weatherAPIIconBaseUrl + data.list[j].weather[0].icon + '.png';
                $('#forecast-' + i + '-temp')[0].innerHTML = "Temp: " + (data.list[j].main.temp/10.0).toFixed(2) + " °C";
                $('#forecast-' + i + '-wind')[0].innerHTML = "Wind: " + data.list[j].wind.speed + " MPH";
                $('#forecast-' + i + '-humidity')[0].innerHTML = "Humidity: " + data.list[j].main.humidity + " %";
            }

        });
};

var handleSearch = function (event) 
{
    event.preventDefault();
  
    var city = $('#search-input').val();
  
    if (!city) {
      return;
    }

    addCity(city);
};

var handleCitySelect = function (event)
{
    event.preventDefault();

    console.log('city button pressed');
    console.log(event.target.id);

    var city = JSON.parse(localStorage.getItem(event.target.id));

    displayWeather(city);
}  
