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
  const weatherBaseURL = 'http://api.weatherapi.com/v1/current.json';
  const clientIp = req.headers['x-forwarded-for'] || req.ip;
  // const clientIp = "41.203.78.171";
  try {
    // Get the weather data
    const weatherResponse = await axios.get(weatherBaseURL, {
      params: {
        key: apiKey,
        q: clientIp,
        current_fields: "temp_c" 
      }
    });

    // Temperature in Celsius
    const data = weatherResponse.data;
    const temperature = data.current.temp_c;
    const city = data.location.name;

    const obj = {
      "client_ip": clientIp,
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
