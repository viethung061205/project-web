const express = require("express");
const router = express.Router();
const ticket = require("../api/ticket");

router.get("/:diadiem", ticket.ticketdiadiem);

module.exports = router;
