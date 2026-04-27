const express = require("express");
const router = express.Router();
const Url = require("../models/Url");
const { nanoid } = require("nanoid");


// ===============================
// ✅ FORM UI
// ===============================
router.get("/form", (req, res) => {
  res.send(`
    <h2>🌐 URL Shortener</h2>
    <form action="/api/url/shorten" method="get">
      <input type="text" name="url" placeholder="Enter URL" required style="width:300px; padding:5px;" />
      <button type="submit">Shorten</button>
    </form>
  `);
});


// ===============================
// ✅ CREATE SHORT URL (GET)
// ===============================
router.get("/shorten", async (req, res) => {
  try {
    const { url } = req.query;

    if (!url || !url.startsWith("http")) {
      return res.send("❌ Invalid URL");
    }

    let shortId;
    let exists = true;

    while (exists) {
      shortId = nanoid(6);
      const existing = await Url.findOne({ shortId });
      if (!existing) exists = false;
    }

    await Url.create({
      originalUrl: url,
      shortId
    });

    res.send(`
      <p>✅ Short URL created:</p>
      <a href="${process.env.BASE_URL}/${shortId}" target="_blank">
        ${process.env.BASE_URL}/${shortId}
      </a>
    `);

  } catch (err) {
    res.status(500).send("Server Error");
  }
});


// ===============================
// ✅ CREATE SHORT URL (POST)
// ===============================
router.post("/shorten", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || !url.startsWith("http")) {
      return res.status(400).json({
        success: false,
        message: "Invalid URL"
      });
    }

    let shortId;
    let exists = true;

    while (exists) {
      shortId = nanoid(6);
      const existing = await Url.findOne({ shortId });
      if (!existing) exists = false;
    }

    await Url.create({
      originalUrl: url,
      shortId
    });

    res.json({
      success: true,
      shortUrl: `${process.env.BASE_URL}/${shortId}`
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});


// ===============================
// ✅ REDIRECT
// ===============================
router.get("/:id", async (req, res) => {
  try {
    const data = await Url.findOne({ shortId: req.params.id });

    if (!data) {
      return res.status(404).send("❌ URL not found");
    }

    res.redirect(data.originalUrl);

  } catch (err) {
    res.status(500).send("Server Error");
  }
});


module.exports = router;