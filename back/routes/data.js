const express = require("express");
const dataController = require("../controllers/data");
const router = express.Router();
router.get('/last_7', dataController.getLast);
router.get('/last_hours', dataController.getLastHours);
router.get('/last_days', dataController.getLastDays);
module.exports = router;