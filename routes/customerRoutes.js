const express = require("express");
const {
	putAccountsDetailsController,
	updateBillingInfoController,
	getCustomersController,
} = require("../controllers/customerController");

const router = express.Router();
router.get("", getCustomersController);
router.put("/accounts/:id", putAccountsDetailsController);
router.post("/billing", updateBillingInfoController);

module.exports = router;
