const express = require('express');
const Router = express.Router();
const axios = require('axios');


Router.get('', (req, res) => {
  return res.json({
    'description': 'Get all weather data from a city',
    'method': 'GET',
    'link': '/heatmap/location?city=',
  });
});

Router.get('/location', async (req, res) => {
  const city = req.query.city;

  if (!city) return res.status(400).send();

  const response = (await axios.get(`http://api.worldweatheronline.com/premium/v1/weather.ashx?key=${process.env.WWO_API_KEY}&q=${city}&num_of_days=2&format=json`)).data;

  const customClimateAverage = response.data.ClimateAverages[0].month.map((month) => {
    return {
      index: month.index,
      name: month.name,
      maxTempC: month.absMaxTemp,
      avgDailyRainfall: month.avgDailyRainfall,
    }
  })

  const customData = {
    requestType: response.data.request[0].type,
    city: response.data.request[0].query,
    tempC: response.data.current_condition[0].temp_C,
    feelsLikeC: response.data.current_condition[0].feelsLikeC,
    weatherCode: response.data.current_condition[0].weatherCode,
    climateAverage: customClimateAverage
  }

  return res.json({ ...customData })
})


module.exports = Router;
