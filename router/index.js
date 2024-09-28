const express = require("express");
const router = express.Router();
const userRouter = require("./auth.routes");
const productRouter = require("./product.routes");
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST_KEY);

router.use("/auth", userRouter);
router.use("/products", productRouter);
router.post("/cart-checkout", async (req, res) => {
  try {
    const { products } = req.body;

    const lineItems = products.map((product) => {
      return {
        quantity: product.qty,
        price_data: {
          currency: "usd",
          unit_amount: product.price * 100,
          product_data: {
            name: product.title,
          },
        },
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "https://ecom-project-lilac.vercel.app/success",
      cancel_url: "https://ecom-project-lilac.vercel.app/cancel",
    });

    res.status(200).json({ id: session.id });
  } catch (error) {
    console.log("error: ", error);
    res.status(200).json({ error: error.message });
  }
});

module.exports = router;
