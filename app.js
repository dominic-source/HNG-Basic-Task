const express = require('express');
const bodyParser = require('body-parser');
const geoip = require('geoip-lite');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/hello', (req, res) => {
  const visitor_name = req.query.visitor_name;
  const ip = req.ip.split(':').pop();
  let obj, city;
  try {
    city = geoip.lookup(ip).city;
    obj = {
      "client_ip": ip,
      "location": city,
      "greeting": `Hello, ${visitor_name}!, the temperature is 11 degrees Celcius in ${city}`
      }
  } catch (error) {
    res.status(500).send('Ip address not found!');
  }
  res.status(200).json(obj);
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
