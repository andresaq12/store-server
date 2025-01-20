import express from 'express'
import dotenv from 'dotenv'
import passport from 'passport'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import productsRoutes from './routes/products.js'
import categoriesRoutes from './routes/categories.js'
import usersRoutes from './routes/users.js'
import ordersRoutes from './routes/orders.js'
import { configureGoogleStrategy } from './passport/passportConfig.js'

dotenv.config()
const PORT = process.env.PORT ?? 3000
const corsOptions = {
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

const app = express()

app.use(cors(corsOptions))
app.use(express.json())
app.use(passport.initialize())

configureGoogleStrategy(passport)

app.use('/api', authRoutes)
app.use('/api', productsRoutes)
app.use('/api', categoriesRoutes)
app.use('/api', usersRoutes)
app.use('/api', ordersRoutes)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})