document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('userForm');
    const responseMessageDiv = document.getElementById('responsive'); 
    const weatherEffectDiv = document.getElementById('weatherEffect');
    const title = document.getElementById('title');
    
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = {
            zip: document.getElementById('zip').value,
            countryCode: document.getElementById('countryCode').value
        };

        axios.post('http://localhost:3000/submitWeather', formData)
            .then(response => {
                const weather = response.data.weather;
                const description = response.data.weather.weather[0].main.toLowerCase();
                const temperature = response.data.weather.main.temp - 273.15;
                const feelsLike = response.data.weather.main.feels_like - 273.15; // Feels like temperature
                const humidity = response.data.weather.main.humidity; // Humidity percentage
                const windSpeed = response.data.weather.wind.speed; // Wind speed in m/s
                const visibility = response.data.weather.visibility / 1000; // Visibility in km

                console.log(response.data);
                
                const sunrise = response.data.weather.sys.sunrise;  
                const sunset = response.data.weather.sys.sunset;  
                const timezoneOffset = response.data.weather.timezone;  

                const sunriseDate = new Date((sunrise + timezoneOffset) * 1000);  
                const sunsetDate = new Date((sunset + timezoneOffset) * 1000);
                
                const currentUTC = Date.now() / 1000;  
                const currentDate = new Date((currentUTC + timezoneOffset) * 1000);  
                
                console.log(sunriseDate.toString(), sunsetDate.toString(), currentDate.toString());
                
                const isDay = isDaytime(sunriseDate, sunsetDate, currentDate);
                responseMessageDiv.innerHTML = `Location: ${weather.name}<br>
                                                Weather: ${weather.weather[0].description}<br>
                                                Temperature: ${temperature.toFixed(2)} °C<br>
                                                Feels Like: ${feelsLike.toFixed(2)} °C<br>
                                                Humidity: ${humidity}%<br>
                                                Wind: ${windSpeed} m/s<br>
                                                Visibility: ${visibility} km`;
                weatherEffectDiv.innerHTML = ''; 
                weatherEffectDiv.className = ''; 

                if (description.includes('rain')||description.includes('storm')) {
                    createRainEffect(isDay);
                } else if (description.includes('clear')) {
                    createSunshineEffect(isDay);
                } else if (description.includes('cloud')) {
                    createCloudEffect(isDay);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                responseMessageDiv.textContent = 'Failed to fetch weather data.';
            });
    });

    title.addEventListener('click', function() {
        if (responseMessageDiv.style.display === 'block') {
            responseMessageDiv.style.display = 'none';
        } else {
            responseMessageDiv.style.display = 'block';
        }
    });

    function isDaytime(sunrise, sunset, currentTime) {
        console.log(sunrise, sunset, currentTime)
        return currentTime >= sunrise && currentTime < sunset;
    }

    function createRainEffect(isDaytime) {
        if (isDaytime) {
            applyDayTheme()
            weatherEffectDiv.classList.add('day-background');

            form.style.color = "black";
            responseMessageDiv.style.color = "black";
            title.style.color = "black";

        } else {
            weatherEffectDiv.classList.add('night-background');
            createStarsAndMoon(); 
            form.style.color = "white";
            responseMessageDiv.style.color = "white";
            title.style.color = "white";
        }

        for (let i = 0; i < 100; i++) {
            const rainDrop = document.createElement('div');
            rainDrop.classList.add('rain-drop');
            rainDrop.style.left = `${Math.random() * 100}vw`;
            rainDrop.style.animationDuration = `${0.5 + Math.random()}s`;
            weatherEffectDiv.appendChild(rainDrop);
        }
    }

    function createSunshineEffect(isDaytime) {
        if (isDaytime) {
            applyDayTheme()
            weatherEffectDiv.classList.add('day-background');
            
            const sun = document.createElement('div');
            sun.classList.add('sun');
            weatherEffectDiv.appendChild(sun);

            const sunRays = document.createElement('div');
            sunRays.classList.add('sun-rays');
            weatherEffectDiv.appendChild(sunRays);

            form.style.color = "black";
            responseMessageDiv.style.color = "black";
            title.style.color = "black";
        } else {
            weatherEffectDiv.classList.add('night-background');
            createStarsAndMoon();
            form.style.color = "white";
            responseMessageDiv.style.color = "white";
            title.style.color = "white";
        }
    }

    function createCloudEffect(isDaytime) {
        if (isDaytime) {
            applyDayTheme()
            weatherEffectDiv.classList.add('day-background');
            form.style.color = "black";
            responseMessageDiv.style.color = "black";
            title.style.color = "black";
        } else {
            weatherEffectDiv.classList.add('night-background');
            createStarsAndMoon();
            form.style.color = "white";
            responseMessageDiv.style.color = "white";
            title.style.color = "white";
        }

        const cloudCount = 10; 

        for (let i = 0; i < cloudCount; i++) {
            const cloud = document.createElement('div');
            cloud.classList.add('cloud');
            if (!isDaytime) {
                cloud.classList.add('night-cloud'); 
            }

            const cloudWidth = Math.random() * (200 - 100) + 100; 
            const cloudHeight = cloudWidth * 0.6;
            cloud.style.width = `${cloudWidth}px`;
            cloud.style.height = `${cloudHeight}px`;

            cloud.style.top = `${Math.random() * 50 + 10}%`; 
            cloud.style.left = `${-Math.random() * 200}px`; 

            const duration = Math.random() * (30 - 10) + 10;
            cloud.style.animationDuration = `${duration}s`;

            weatherEffectDiv.appendChild(cloud);
        }
    }

    //no stars, could not able to do it
    function createStarsAndMoon() {
        applyNightTheme()
        generateStars(weatherEffectDiv);
        const moon = document.createElement('div');
        moon.classList.add('moon');
        weatherEffectDiv.appendChild(moon);
    }

    function applyNightTheme() {
        const form = document.querySelector('#userForm');
        const responsive = document.getElementById('responsive');
        const image = document.getElementById('img');

        form.style.background = 'rgba(0, 0, 0, 0.6)';
        form.style.color = '#ffffff';
    
        title.style.background = 'rgba(20, 20, 20, 0.9)';
        title.style.color = '#cccccc';
    
        responsive.style.background = 'rgba(50, 50, 50, 0.8)';
        responsive.style.color = '#cccccc';
        image.style.opacity = '0.8';
        
    }

    function applyDayTheme() {
        const form = document.querySelector('#userForm');
        const title = document.getElementById('title');
        const responsive = document.getElementById('responsive');
        const image = document.getElementById('img');

        // Resetting to original day theme styles
        form.style.background = 'rgba(255, 255, 255, 0.5)';
        form.style.color = '#000000';
    
        title.style.background = 'rgba(245, 245, 245, 0.8)';
        title.style.color = '#333';
    
        responsive.style.background = 'rgba(255, 255, 255, 0.8)';
        responsive.style.color = '#444';

        image.style.opacity = '1';
    }

    function generateStars(targetElement) {
        const numberOfStars = 100; // Number of stars you want to generate
    
        // Clear previous stars if any (useful for regenerating stars)
        targetElement.innerHTML = '';
    
        for (let i = 0; i < numberOfStars; i++) {
            let star = document.createElement('div');
            star.className = 'star';
            star.style.top = `${Math.random() * 100}%`;
            star.style.left = `${Math.random() * 100}%`;
            // Randomize the animation duration between 0.5s and 2.5s for varied blinking
            star.style.animationDuration = `${(Math.random() * 2) + 0.5}s`;
    
            targetElement.appendChild(star);
        }
    }
});