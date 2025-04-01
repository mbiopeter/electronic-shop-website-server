const express = require("express");
const router = express.Router();
const { stkPushController, mpesaCallbackController } = require("../controllers/mpesaController");

router.post("/stkpush", stkPushController);
router.post("/callback", mpesaCallbackController);

module.exports = router;
