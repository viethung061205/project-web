const moment = require("moment");
const crypto = require("crypto");
const qs = require("qs");
const db = require("../config/db");

const tmnCode = "NBN9VF7L";
const secretKey = "S8DKUPXRA90AF5MPGTZ059D9Q1D1IQBB";
const vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
const returnUrl = "http://localhost:5173/vnpay-return";

function sortObject(obj) {
    let sorted = {};
    let keys = Object.keys(obj).sort();
    keys.forEach((key) => {
        sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, "+");
    });
    return sorted;
}

exports.luudonve = async (req, res) => {
    try {
        const {
            txn_ref,
            hoten,
            email,
            sdt,
            diachi,
            diadiem,
            loai_ve,
            soluong_ve,
            soluong_suatan,
            ngay_sudung,
            tong_tien
        } = req.body;

        const sql = `
            INSERT INTO bookings
            (txn_ref, hoten, email, sdt, diachi, diadiem, loai_ve, soluong_ve, soluong_suatan, ngay_sudung, tong_tien, trang_thai)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')
        `;

        await db.execute(sql, [
            txn_ref,
            hoten,
            email,
            sdt,
            diachi,
            diadiem,
            loai_ve,
            soluong_ve,
            soluong_suatan,
            ngay_sudung,
            tong_tien
        ]);

        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.taodonve = (req, res) => {
    try {
        const date = new Date();
        const createDate = moment(date).format("YYYYMMDDHHmmss");
        const ipAddr =
            req.headers["x-forwarded-for"] || req.connection.remoteAddress;

        const { amount, orderInfo, txnRef } = req.body;

        let vnp_Params = {
            vnp_Version: "2.1.0",
            vnp_Command: "pay",
            vnp_TmnCode: tmnCode,
            vnp_Locale: "vn",
            vnp_CurrCode: "VND",
            vnp_TxnRef: txnRef,
            vnp_OrderInfo: orderInfo,
            vnp_OrderType: "other",
            vnp_Amount: amount * 100,
            vnp_ReturnUrl: returnUrl,
            vnp_IpAddr: ipAddr,
            vnp_CreateDate: createDate
        };

        vnp_Params = sortObject(vnp_Params);
        const signData = qs.stringify(vnp_Params, { encode: false });
        const signed = crypto
            .createHmac("sha512", secretKey)
            .update(Buffer.from(signData, "utf-8"))
            .digest("hex");

        vnp_Params.vnp_SecureHash = signed;

        const paymentUrl =
            vnpUrl + "?" + qs.stringify(vnp_Params, { encode: false });

        res.status(200).json({ paymentUrl });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.thongtinthanhtoan = async (req, res) => {
    try {
        let vnp_Params = req.body.vnp_Params;
        const secureHash = vnp_Params.vnp_SecureHash;

        delete vnp_Params.vnp_SecureHash;
        delete vnp_Params.vnp_SecureHashType;

        vnp_Params = sortObject(vnp_Params);
        const signData = qs.stringify(vnp_Params, { encode: false });
        const signed = crypto
            .createHmac("sha512", secretKey)
            .update(Buffer.from(signData, "utf-8"))
            .digest("hex");

        if (secureHash !== signed) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid checksum" });
        }

        const responseCode = vnp_Params.vnp_ResponseCode;
        const txnRef = vnp_Params.vnp_TxnRef;
        const vnpTranNo = vnp_Params.vnp_TransactionNo;
        const bankCode = vnp_Params.vnp_BankCode;

        const status = responseCode === "00" ? "Success" : "Failed";

        await db.execute(
            `
            UPDATE bookings
            SET trang_thai = ?, ma_gd_vnpay = ?, ma_ngan_hang = ?
            WHERE txn_ref = ?
            `,
            [status, vnpTranNo, bankCode, txnRef]
        );

        res.status(200).json({ success: true, status });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};