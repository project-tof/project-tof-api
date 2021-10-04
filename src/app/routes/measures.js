const express = require('express');
const Router = express.Router();
const axios = require('axios');


Router.get('', (req, res) => {
  return res.json({
    'description': 'Get world temperature, carbon dioxide and artic ice measures',
    'method': 'GET',
    'links': [
      '/measures/worldtemperature',
      '/measures/carbondioxide',
      '/measures/articice'
    ]
  });
});

Router.get('/worldtemperature', async (req, res) => {
  const response = (await axios.get('https://global-warming.org/api/temperature-api')).data;

  let oldLanddVerifier = response.result[0].land;
  let resulOldtLand;
  let newLandVerifier = Number(response.result[response.result.length - 1].land);
  let resultNewLand;


  resulOldtLand = (oldLanddVerifier >= 0) ? oldLanddVerifier : oldLanddVerifier * -1;
  resultNewLand = (newLandVerifier >= 0) ? newLandVerifier : newLandVerifier * -1;


  const data = {
    result: response.result,
    landIncrease: (resulOldtLand + resultNewLand).toFixed(2),
    initialDate: response.result[0].time,
    finalDate: response.result[response.result.length - 1].time
  };

  return res.json({ 
    ...data 
  });
});

Router.get('/carbondioxide', async (req, res) => {
  const response = (await axios.get('https://global-warming.org/api/co2-api')).data;

  let min = response.co2[0].trend;
  let max;

  if (min <= response.co2[response.co2.length - 1].trend) {
    max = response.co2[response.co2.length - 1].trend;
  } else {
    min = response.co2[response.co2.length - 1].trend;
    max = response.co2[0].trend;
  }

  const data = {
    result: [ ...response.co2 ],
    carbonIncrease: (max - min).toFixed(2),
    initialDate: response.co2[0].year,
    finalDate: response.co2[response.co2.length - 1]
  };

  return res.json({ 
    ...data 
  });

});

Router.get('/articice', async (req, res) => {
  const response = (await axios.get('https://global-warming.org/api/arctic-api')).data;

  const data = {
    result: response.result,
    extentDif: (response.result[0].extent - response.result[response.result.length - 1].extent).toFixed(2),
    areaDif: (response.result[0].area - response.result[response.result.length - 1].area).toFixed(2),
  };

  return res.json({ 
    ...data 
  });
});


module.exports = Router;
