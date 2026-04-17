const express = require("express");
const router = express.Router();
const Url = require("../models/Url");
const { nanoid } = require("nanoid");


// ===============================
// ✅ 1. FORM UI (BROWSER DEMO)
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
// ✅ 2. CREATE SHORT URL (GET - BROWSER)
// ===============================
router.get("/shorten", async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.send("❌ Please provide URL like: /api/url/shorten?url=https://google.com");
    }

    const shortId = nanoid(6);

    await Url.create({
      originalUrl: url,
      shortId
    });

    res.send(`
      <p>✅ Short URL created:</p>
      <a href="https://tourism-project.up.railway.app/${shortId}" target="_blank">
        https://tourism-project.up.railway.app/${shortId}
      </a>
    `);

  } catch (err) {
    res.status(500).send("Server Error");
  }
});


// ===============================
// ✅ 3. CREATE SHORT URL (POST - API)
// ===============================
router.post("/shorten", async (req, res) => {
  try {
    const shortId = nanoid(6);

    const url = await Url.create({
      originalUrl: req.body.url,
      shortId
    });

    res.json({
      success: true,
      shortUrl: `https://tourism-project.up.railway.app/${shortId}`
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});


// ===============================
// ✅ 4. REDIRECT TO ORIGINAL URL
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