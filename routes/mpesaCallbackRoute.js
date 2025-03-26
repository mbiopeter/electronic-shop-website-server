const express = require("express");
const router = express.Router();
const {
	mpesaCallbackController,
} = require("../controllers/mpesaCallbackController");

router.post("/callback", mpesaCallbackController);

module.exports = router;
