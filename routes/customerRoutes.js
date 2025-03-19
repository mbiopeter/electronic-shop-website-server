const express = require("express");
const {
	putAccountsDetailsController,
	putBillingInfoController,
} = require("../controllers/customerController");

const router = express.Router();

router.put("/accounts/:id", putAccountsDetailsController);
router.put("/billings/:id", putBillingInfoController);

module.exports = router;
