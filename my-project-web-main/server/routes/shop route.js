const express = require("express");
const router = express.Router();
const shop = require("../api/shop");

router.get("/", shop.shop);

router.get("/:id", shop.chitietsanpham);

router.post("/themgiohang", shop.themgiohang);
router.get("/laygiohang/:email", shop.laygiohang);
router.delete("/xoagiohang/:cartId", shop.xoagiohang);
router.post("/datHangNgay", shop.datHangNgay);
router.get("/laydonhang/:email", shop.laydonhang);
router.delete("/huydonhang/:orderId", shop.huydonhang);

module.exports = router;