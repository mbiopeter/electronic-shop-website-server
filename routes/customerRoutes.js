const express = require("express");
const {
	putAccountsDetailsController,
	putBillingInfoController,
	getCustomerController,
} = require("../controllers/customerController");

const router = express.Router();

router.get("/customer/:id", getCustomerController);
router.put("/accounts/:id", putAccountsDetailsController);
router.put("/billings/:id", putBillingInfoController);

module.exports = router;
