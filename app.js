import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import dotenv from 'dotenv';

const app = express();
dotenv.config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/hello', async (req, res) => {
  const visitor_name = req.query.visitor_name || 'Unknown';
  const apiKey = process.env.apiKey;
  const ipBaseURL = 'http://api.weatherapi.com/v1/ip.json';
  const weatherBaseURL = 'http://api.weatherapi.com/v1/current.json';

   // Get the client's IP address
   const clientIp = req.ip;

  try {
    // Get the IP address and location data
    const response = await axios.get(ipBaseURL, {
      params: {
        key: apiKey,
        q: clientIp,
      }
    });

    const data = response.data;
    const city = data.name;
    const ip = data.ip;

    // Get the weather data
    const weatherResponse = await axios.get(weatherBaseURL, {
      params: {
        key: apiKey,
        q: `${data.lat},${data.lon}`,
        current_fields: "temp_c" 
      }
    });
    // Temperature in Celsius
    const temperature = weatherResponse.data.current.temp_c;
    const obj = {
      "client_ip": ip,
      "location": city,
      "greeting": `Hello, ${visitor_name}! The temperature is ${temperature} degrees Celsius in ${city}.`
    };
    res.json(obj);
  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
