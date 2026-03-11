const express = require("express");
const router = express.Router();
const admin = require("../api/admin");

router.post("/dangnhapQR", admin.dangnhapQR);

router.get("/layUser", admin.layUser);
router.post("/themUser", admin.themUser);
router.put("/capnhatUser/:id", admin.capnhatUser);
router.delete("/xoaUser/:id", admin.xoaUser);

router.get("/quanlyve", admin.layve);
router.post("/quanlyve", admin.taove);
router.put("/quanlyve/:id", admin.capnhatve);
router.delete("/quanlyve/:id", admin.xoave);

router.get("/layveUser", admin.layveUser);
router.put("/capnhatveUser/:id", admin.capnhatveUser);
router.delete("/xoaveUser/:id", admin.xoaveUser);

router.get("/laysanpham", admin.laysanpham);
router.post("/themsanpham", admin.themsanpham);
router.put("/suasanpham/:id", admin.suasanpham);
router.delete("/xoasanpham/:id", admin.xoasanpham);

router.get("/laydonhang", admin.laydonhang);
router.put("/suadonhang/:id", admin.suadonhang);
router.delete("/xoadonhang/:id", admin.xoadonhang);

router.get("/laygiohang", admin.laygiohang);
router.put("/suagiohang/:id", admin.suagiohang);
router.delete("/xoagiohang/:id", admin.xoagiohang);

module.exports = router;