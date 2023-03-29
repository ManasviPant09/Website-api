const router = require("express").Router();
// const stripe = require("stripe")(process.env.STRIPE_KEY);
require("dotenv").config();
const KEY = process.env.STRIPE_KEY;
const stripe = require("stripe")(KEY);

router.post("/payment", async (req, res) => {
  try{
    const paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card:{
        token: req.body.tokenId
      },
    });
    const customer = await stripe.customers.create({
      email: req.body.email,
      payment_method: paymentMethod.id,
    });
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: "inr",
      customer: customer.id,
      payment_method: paymentMethod.id,
      confirm: true,
    });
    res.status(200).json(paymentIntent);
  }
  catch(error){
    res.status(500).json({error: error.message});
  }
});
  
module.exports = router;