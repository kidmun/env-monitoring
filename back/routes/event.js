const express = require("express");
const eventController = require("../controllers/event");
const router = express.Router();
router.get('/events', eventController.getEvents);
router.post('/create-event', eventController.postEvent);
router.delete('/delete-event/:userId', eventController.deleteEvent);
module.exports = router;