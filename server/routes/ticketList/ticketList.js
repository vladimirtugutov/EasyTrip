/* eslint-disable no-unused-vars */
const router = require('express').Router();
const axios = require('axios');
const { City, Airline } = require('../../db/models');
require('dotenv').config();

const makeLink = (origin, destination, departureAt, returnAt) => {
  const apiKey = process.env.API_KEY;
  const aviaLink = process.env.AVIA_LINK;
  if (departureAt === undefined) {
    return `${aviaLink}?origin=${origin}&destination=${destination}&currency=rub&sorting=price&direct=true&limit=30&token=${apiKey}`;
  } if (departureAt !== undefined && returnAt === undefined) {
    return `${aviaLink}?origin=${origin}&destination=${destination}&currency=rub&departure_at=${departureAt}&sorting=price&direct=true&limit=30&token=${apiKey}`;
  }
  return `${aviaLink}?origin=${origin}&destination=${destination}&currency=rub&departure_at=${departureAt}&return_at=${returnAt}&sorting=price&direct=true&limit=30&token=${apiKey}`;
};

router
  .route('/')
  .post(async (req, res) => {
    try {
      const {
        origin, destination, departureAt,
      } = req.body;
      const airlines = await Airline.findAll({
        attributes: ['code', 'name_translations'],
        raw: true,
      });
      const cities = await City.findAll({
        attributes: ['code', 'name'],
        raw: true,
      });
      const { data } = await axios.get(makeLink(origin, destination, departureAt, ''));
      const result = data.data.map((dataItem) => {
        const originCity = cities.filter((element) => element.code === dataItem.origin);
        const destinationCity = cities.filter((element) => element.code === dataItem.destination);
        const airlineName = airlines.filter((element) => element.code === dataItem.airline);
        const newItem = {
          ...dataItem,
          originCity: originCity[0].name,
          destinationCity: destinationCity[0].name,
          airlineName: airlineName[0].name_translations,
        };
        return newItem;
      });
      res.json({ success: true, data: result, currency: 'rub' });
    } catch (error) {
      console.log(error);
    }
  });

module.exports = router;
