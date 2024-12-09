var allTemp;

async function fetchWeather(city) {
    var res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=edc8636f99af470d961204719240612&q=${city}&days=3`);
    var finalRes = await res.json();
    allTemp = finalRes;
    display();
}

function display() {
    // function to get the weekday and day of the month
    function formatDate(dateString) {
        var date = new Date(dateString);
        var weekday = date.toLocaleString('en-us', { weekday: 'long' });
        var dayOfMonth = date.getDate();
        return { weekday, dayOfMonth };
    }

    // gets the details for today, tomorrow, and the day after tomorrow
    var today = allTemp.forecast.forecastday[0];
    var tomorrow = allTemp.forecast.forecastday[1];
    var dayAfterTomorrow = allTemp.forecast.forecastday[2];

    // format date for each day
    var todayDate = formatDate(today.date);
    var tomorrowDate = formatDate(tomorrow.date);
    var dayAfterTomorrowDate = formatDate(dayAfterTomorrow.date);

    var container = `
        
            <div class="col  px-0">
                <div class="card f-card h-100 border-0">
                    <div class="card-header d-flex justify-content-between align-items-center start-end">
                        <div>${todayDate.weekday}</div>
                        <div>${todayDate.dayOfMonth} December</div>
                    </div>
                    <div class="card-body py-5  start-end-body">
                        <h5 class="card-title">${allTemp.location.name}</h5>
                        <div class="degree d-flex justify-content-around align-items-center text-center">
                            <div class="number text-white">${today.day.avgtemp_c}<sup>o</sup>C</div>
                            <div class="icon">
                                <img src="${today.day.condition.icon}" alt="" />
                            </div>
                        </div>
                        <div class="forecast mb-3">${today.day.condition.text}</div>
                        <span class="me-4">
                            <img class="me-1" src="./images/icon-umberella.png" alt="" />${today.day.avghumidity}%
                        </span>
                        <span class="me-4">
                            <img class="me-1" src="./images/icon-wind.png" alt="" />${today.day.maxwind_kph} km/h
                        </span>
                        <span class="me-4"
                  ><img
                    class="me-1"
                    src="./images/icon-compass.png"
                    alt=""
                  />${allTemp.current.wind_dir}</span
                >
              </div>
                    </div>
                </div>
            </div>

            <div class="col px-0 rounded-0">
                <div class="card h-100 border-0 rounded-0">
                    <div class="card-header rounded-0 middle text-center">
                        <div>${tomorrowDate.weekday}</div>
                        
                    </div>
                    <div class="card-body middle-body py-5 d-flex flex-column justify-content-between align-items-center">
                        <div class="icon text-center">
                            <img class="w-75" src="${tomorrow.day.condition.icon}" alt="" />
                        </div>
                        <div class="degree text-white text-center custom">
                            ${tomorrow.day.avgtemp_c}<sup>o</sup>C
                        </div>
                        <small class="text-center">${tomorrow.day.mintemp_c}<sup>o</sup>C</small>
                        <div class="forecast mb-3">${tomorrow.day.condition.text}</div>
                    </div>
                </div>
            </div>

            <div class="col px-0">
                <div class="card third-card h-100 border-0">
                    <div class="card-header start-end text-center">
                        <div>${dayAfterTomorrowDate.weekday}</div>
                        
                    </div>
                    <div class="card-body start-end-body py-5 d-flex flex-column justify-content-between align-items-center">
                        <div class="icon text-center">
                            <img class="w-75" src="${dayAfterTomorrow.day.condition.icon}" alt="" />
                        </div>
                        <div class="degree text-white text-center custom">
                            ${dayAfterTomorrow.day.avgtemp_c}<sup>o</sup>C
                        </div>
                        <small class="text-center">${dayAfterTomorrow.day.mintemp_c}<sup>o</sup>C</small>
                        <div class="forecast mb-3">${dayAfterTomorrow.day.condition.text}</div>
                    </div>
                </div>
            </div>
        
    `;

    document.querySelector(".allTemp").innerHTML = container;
}

// real time search function
var searchInput = document.getElementById("search")
searchInput.addEventListener("input", function () {
    var city = document.getElementById("search").value.trim();
    if (city.length >= 3) { 
        fetchWeather(city);
    }
});

// geolocation API
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async function (position) {
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;
                var city = `${latitude},${longitude}`;
                await fetchWeather(city);
            },
            function (error) {
                if (error.code === error.PERMISSION_DENIED) {
                    // if the user blocks location permission
                    var defaultCity = "30.0444,31.2357"; // cairo coordinates
                    fetchWeather(defaultCity);
                }
            }
        );
    }
}

getLocation();