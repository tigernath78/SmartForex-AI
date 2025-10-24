import express from 'express'
import Stripe from 'stripe'
import bodyParser from 'body-parser'
import User from '../models/User.js'
const router = express.Router()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
// create checkout session
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { email, name } = req.body
    if (!email) return res.status(400).json({ error: 'missing email' })
    const customer = await stripe.customers.create({ email, name })
    const product = await stripe.products.create({ name: 'Smart Forex AI Monthly' })
    const price = await stripe.prices.create({ unit_amount: 5000, currency: 'usd', recurring: { interval: 'month' }, product: product.id })
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer: customer.id,
      line_items: [{ price: price.id, quantity: 1 }],
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      metadata: { customerEmail: email }
    })
    const apiKey = Math.random().toString(36).slice(2, 10)
    const user = await User.findOneAndUpdate(
      { email },
      { email, name, apiKey, 'subscription.status': 'pending', 'subscription.stripeCustomerId': customer.id },
      { upsert: true, new: true }
    )
    res.json({ url: session.url, apiKey })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'stripe_error' })
  }
})
router.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature']
  let event
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }
  const payload = event.data.object
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = payload
      const customerId = session.customer
      await User.findOneAndUpdate({ 'subscription.stripeCustomerId': customerId }, { 'subscription.status': 'active' })
      break
    }
    case 'invoice.payment_succeeded': {
      const invoice = payload
      const customerId = invoice.customer
      await User.findOneAndUpdate({ 'subscription.stripeCustomerId': customerId }, { 'subscription.status': 'active' })
      break
    }
    case 'invoice.payment_failed': {
      const invoice = payload
      const customerId = invoice.customer
      await User.findOneAndUpdate({ 'subscription.stripeCustomerId': customerId }, { 'subscription.status': 'past_due' })
      break
    }
    case 'customer.subscription.deleted': {
      const subscription = payload
      const customerId = subscription.customer
      await User.findOneAndUpdate({ 'subscription.stripeCustomerId': customerId }, { 'subscription.status': 'canceled' })
      break
    }
    default:
      console.log('Unhandled stripe event', event.type)
  }
  res.json({ received: true })
})
export default router
