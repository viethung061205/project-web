const db = require("../config/db");

exports.ticketdiadiem = (req, res) => {
  const { diadiem } = req.params;

  if (!diadiem) {
    return res.status(400).json({ message: "Thiếu địa điểm" });
  }

  const sql = `
    SELECT 
      id,
      diadiem,
      loai,
      mota,
      CAST(gia AS UNSIGNED) AS gia,
      CAST(giabth AS UNSIGNED) AS giabth
    FROM tickets
    WHERE diadiem = ?
  `;

  db.query(sql, [diadiem], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Lỗi server" });
    }

    res.json(rows);
  });
};
