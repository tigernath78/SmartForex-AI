import express from 'express'
import User from '../models/User.js'
import Stripe from 'stripe'
const router = express.Router()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
router.get('/users', async (req, res) => {
  const users = await User.find().select('-__v')
  res.json(users)
})
router.post('/cancel-subscription', async (req, res) => {
  const { userId } = req.body
  const user = await User.findById(userId)
  if (!user || !user.subscription?.stripeCustomerId) return res.status(404).json({ error: 'user_not_found' })
  const subs = await stripe.subscriptions.list({ customer: user.subscription.stripeCustomerId, limit: 5 })
  for (const s of subs.data) await stripe.subscriptions.del(s.id)
  user.subscription.status = 'canceled'
  await user.save()
  res.json({ ok: true })
})
export default router
