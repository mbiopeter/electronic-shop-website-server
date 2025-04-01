const express = require("express");
const {
	putAccountsDetailsController,
	updateBillingInfoController,
	getCustomersController,
} = require("../controllers/customerController");

const router = express.Router();

router.get("", getCustomersController);
router.post("/accounts", putAccountsDetailsController);
router.post("/billing", updateBillingInfoController);

module.exports = router;
