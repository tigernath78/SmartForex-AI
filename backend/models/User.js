import mongoose from 'mongoose'
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: String,
  apiKey: { type: String, unique: true },
  subscription: { status: { type: String, default: 'inactive' }, stripeCustomerId: String, stripeSubscriptionId: String, current_period_end: Date },
  deriv: { enabled: Boolean, account: Object },
  mt5: { enabled: Boolean, account: Object },
  createdAt: { type: Date, default: Date.now }
})
export default mongoose.model('User', userSchema)
