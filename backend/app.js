import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import connectDB from './services/db.js'
import webhookRoutes from './routes/webhook.js'
import stripeRoutes from './routes/stripe.js'
import adminRoutes from './routes/admin.js'

dotenv.config()
await connectDB()

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.use('/api/webhook', webhookRoutes)
app.use('/api/stripe', stripeRoutes)
app.use('/api/admin', adminRoutes)

app.get('/', (req, res) => res.send('Smart Forex AI Backend Running ✅'))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server listening on ${PORT}`))
