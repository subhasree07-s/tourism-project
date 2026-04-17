const Review = require("../models/Review");

exports.addReview = async (req, res) => {
  try {
    console.log("BODY:", req.body); // debug

    const { rating, comment, packageId } = req.body;

    if (!packageId) {
      return res.status(400).json({ message: "PackageId missing" });
    }

    const review = new Review({
      package: packageId,
      rating,
      comment
    });

    await review.save();

    res.status(201).json(review);

  } catch (err) {
    console.error("ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate("package");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};