import express from 'express';
import cors from 'cors'; 
import axios from 'axios';

const app = express();
const port = 3000;

const apiKey = 'fakekey';  

app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(cors());  

app.post('/submitWeather', async (req, res) => {
    const { zip, countryCode } = req.body;
    
    const geoUrl = `http://api.openweathermap.org/geo/1.0/zip?zip=${zip},${countryCode}&appid=${apiKey}`;

    try {
        const geoResponse = await axios.get(geoUrl);
        const { lat, lon } = geoResponse.data;

        console.log(`Received coordinates: Latitude ${lat}, Longitude ${lon}`);

        const weatherUrl = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

        const weatherResponse = await axios.get(weatherUrl);

        res.json({
            message: `Weather data for Zip: ${zip}, Country Code: ${countryCode}`,
            weather: weatherResponse.data,
        });


    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching weather data');
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});