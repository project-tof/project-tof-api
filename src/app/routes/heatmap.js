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
  const feelsLikeC = response.data.current_condition[0].FeelsLikeC;

  let avgYearlyTemp = 0;

  const customClimateAverage = response.data.ClimateAverages[0].month.map((month) => {
    avgYearlyTemp = avgYearlyTemp + parseFloat(month.absMaxTemp);
    return {
      index: month.index,
      name: month.name,
      maxTempC: month.absMaxTemp,
      avgDailyRainfall: month.avgDailyRainfall,
    }
  })

  avgYearlyTemp = ((avgYearlyTemp) / 12);

  // (> 30 && < 35) = 1, (> 35 && < 40) = 2, (> 40) = 3;
  const yearlyTempAlert = avgYearlyTemp > 30 ? (avgYearlyTemp < 35 ? 1 : (avgYearlyTemp < 40 ? 2 : (avgYearlyTemp > 40 ? 3 : 0))) : 0;
  const dailyFeelsLikeAlert = feelsLikeC > 30 ? (feelsLikeC < 35 ? 1 : (feelsLikeC < 40 ? 2 : (feelsLikeC > 40 ? 3 : 0))) : 0;

  const customData = {
    requestType: response.data.request[0].type,
    city: response.data.request[0].query,
    tempC: response.data.current_condition[0].temp_C,
    feelsLikeC: feelsLikeC,
    weatherCode: response.data.current_condition[0].weatherCode,
    climateAverage: customClimateAverage,
    yearlyTempAlert: yearlyTempAlert,
    dailyFeelsLikeAlert: dailyFeelsLikeAlert
  }

  return res.json({ ...customData })
})


module.exports = Router;
