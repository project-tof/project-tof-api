const express = require('express');
const Router = express.Router();
const axios = require('axios');


Router.get('', (req, res) => {
  return res.json({
    'description': 'Get all existent records of natural events from EONET',
    'method': 'GET',
    'links': [
      '/events/all',
      '/events/wildfires',
      '/events/wildfires?days='
    ]
  });
});

Router.get('/all', async (req, res) => {
  const response = (await axios.get(`https://eonet.sci.gsfc.nasa.gov/api/v2.1/events`)).data;

  return res.json({ 
    events: response.events
  });
});

Router.get('/wildfires', async (req, res) => {
  const days = req.query.days;

  const response = (await axios.get(`https://eonet.sci.gsfc.nasa.gov/api/v2.1/categories/8?days=${days}`)).data;

  return res.json({ 
    wildfires: response.events
  });
});


module.exports = Router;
