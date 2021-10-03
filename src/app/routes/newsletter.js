const express = require('express');
const Router = express.Router();
const puppeteer = require('puppeteer');


Router.get('', async (req, res) => {
  const browser = await puppeteer.launch({
    'args' : [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ],
  });

  const page = await browser.newPage();
  await page.goto('https://climate.nasa.gov/news');

  while ((await page.$x('/html/body/div[2]/div/div[2]/section[2]/div/div/section/div/article/ul/li[1]/div/div/div[2]/a')).length == 0)
    await page.waitForTimeout(500);

  const news = await page.evaluate(() => {
    const rawNews = Array.from(
      document.querySelector('.item_list').childNodes
    );

    return rawNews.map((s) => {
      const url = 'https://climate.nasa.gov' + s.childNodes[0].childNodes[0].getAttribute('href');
      const date = s.childNodes[0].childNodes[1].childNodes[0].textContent;
      const title = s.childNodes[0].childNodes[1].childNodes[1].childNodes[0].textContent;
      const description = s.childNodes[0].childNodes[1].childNodes[2].textContent;
      const image = 'https://climate.nasa.gov' + s.childNodes[0].childNodes[0].childNodes[1].childNodes[0].getAttribute('src');

      return {
        url,
        date,
        title,
        description,
        image
      };
    });
  });

  await browser.close();

  return res.json({
    'description': 'Get the 40 most recent news posted at https://climate.nasa.gov',
    'method': 'GET',
    news
  });
});


module.exports = Router;
