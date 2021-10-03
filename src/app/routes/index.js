const express = require('express');
const Router = express.Router();


Router.get('', (req, res) => {
  return res.json({
    'description': 'Project T.O.F. API',
    'links': [
      '/events',
      '/events/all',
      '/events/wildfires',
      '/events/wildfires?days=',
      '/heatmap',
      '/heatmap/location?city=',
      '/measures',
      '/measures/worldtemperature',
      '/measures/carbondioxide',
      '/measures/articice',
      '/newsletter',
    ]
  });
});


module.exports = Router;
