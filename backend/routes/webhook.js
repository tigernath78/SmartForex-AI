import express from 'express'
import axios from 'axios'
import User from '../models/User.js'
const router = express.Router()
async function checkSubscription(req, res, next) {
  const apiKey = req.headers.apikey || req.body.apiKey
  if (!apiKey) return res.status(401).json({ error: 'missing apiKey' })
  const user = await User.findOne({ apiKey })
  if (!user) return res.status(403).json({ error: 'invalid apiKey' })
  if (!user.subscription || user.subscription.status !== 'active') return res.status(402).json({ error: 'subscription_inactive' })
  req.user = user
  next()
}
router.post('/execute', checkSubscription, async (req, res) => {
  try {
    const { symbol, signal, volume } = req.body
    const user = req.user
    if (process.env.DERIV_WEBHOOK_URL) {
      try {
        await axios.post(process.env.DERIV_WEBHOOK_URL, { symbol, signal, volume, user: { id: user._id, email: user.email } }, { timeout: 7000 })
      } catch (err) { console.warn('Deriv forward failed', err.message) }
    }
    if (process.env.MT5_BRIDGE_URL) {
      try {
        await axios.post(process.env.MT5_BRIDGE_URL, { symbol, signal, volume, user: { id: user._id } }, { timeout: 7000 })
      } catch (err) { console.warn('MT5 bridge forward failed', err.message) }
    }
    res.json({ ok: true, message: 'Trade forwarded to connectors' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'execution_failed' })
  }
})
export default router
