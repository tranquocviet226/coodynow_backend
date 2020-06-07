const express = require("express");
const router = express.Router();
const Invoice = require("../../models/invoice");

router.post("/fetchOrder", async (req, res) => {
  await Invoice.find({ userId: req.body.userId }, (err, invoice) => {
    if (err) return res.json(err);
    if (!err) return res.json(invoice);
  });
});

router.post("/addOrder", async (req, res) => {
  const invoice = new Invoice({
    userId: req.body.userId,
    total: req.body.total,
    items: req.body.items,
    date: req.body.date,
  });
  try {
    invoice.save();
    await Invoice.find({ userId: req.body.userId }, (err, invoices) => {
      if (err) return res.json(err);
      if (!err) return res.json(invoices);
    });
  } catch (error) {
    res.json(error);
  }
});

module.exports = router;
