/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable camelcase */
const router = require('express').Router();
const { Ticket } = require('../../db/models');

// /user/personalticket

router
  .route('/')
  .get(async (req, res) => {
    const iduser = req.session.user?.id;
    const personalTicket = await Ticket.findAll({
      where: { user_id: iduser },
    });
    res.json({ success: true, data: personalTicket });
  })
  .post(async (req, res) => {
    const { userTicket } = req.body;
    const {
      airline,
      airlineName,
      departure_at,
      destination,
      destinationCity,
      destination_airport,
      duration,
      flight_number,
      link,
      origin,
      originCity,
      origin_airport,
      price,
      return_at,
      return_transfers,
      transfers,
      user_id,
    } = userTicket;
    await Ticket.create({
      airline,
      airlineName,
      departure_at,
      destination,
      destinationCity,
      destination_airport,
      duration,
      flight_number,
      link,
      origin,
      originCity,
      origin_airport,
      price,
      return_at,
      return_transfers,
      transfers,
      user_id: req.session?.user?.id,
    });
    res.end();
  })
  .delete(async (req, res) => {
    await Ticket.destroy({
      where: {
        id: req.body.userTicket.id,
      },
    });
    const personalTickets = await Ticket.findAll({
      where: { user_id: req.body.auth.id },
    });
    res.json({ success: true, data: personalTickets });
  });

router
  .route('/sort')
  .post(async (req, res) => {
    const { auth } = req.body;
    const personalTickets = await Ticket.findAll({
      where: { user_id: auth.id },
      order: [
        ['departure_at', 'ASC'],
      ],
      raw: true,
    });
    res.json({ success: true, data: personalTickets });
    res.end();
  });

module.exports = router;
