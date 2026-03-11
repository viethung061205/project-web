const express = require("express");
const router = express.Router();
const vnpay = require("../api/vnpay");

router.post("/luudonve", vnpay.luudonve); 
router.post("/taodonve", vnpay.taodonve);
router.post("/thongtinthanhtoan", vnpay.thongtinthanhtoan); 

module.exports = router;