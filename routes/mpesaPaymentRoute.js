const express = require("express");
const router = express.Router();
const {
	createTokenController,
	stkPushController,
} = require("../controllers/mpesaPaymentController");

router.post("/token", createTokenController);
router.post("/stkpush", stkPushController);

module.exports = router;
