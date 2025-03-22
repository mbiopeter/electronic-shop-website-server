const express = require("express");
const {
	putAccountsDetailsController,
	putBillingInfoController,
	getAllCustomersController,
} = require("../controllers/customerController");

const router = express.Router();

router.get("/allcustomers", getAllCustomersController);
router.put("/accounts/:id", putAccountsDetailsController);
router.put("/billings/:id", putBillingInfoController);

module.exports = router;
