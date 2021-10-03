const express = require('express');
const app = express();
const Router = require('../app/routes');
const EventsRouter = require('../app/routes/events');
const HeatmapRouter = require('../app/routes/heatmap');
const MeasuresRouter = require('../app/routes/measures');
const NewsletterRouter = require('../app/routes/newsletter');

app.use('/', Router);
app.use('/events', EventsRouter);
app.use('/heatmap', HeatmapRouter);
app.use('/measures', MeasuresRouter);
app.use('/newsletter', NewsletterRouter);


module.exports = app;
