import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import productsRoutes from './routes/products.js'
import categoriesRoutes from './routes/categories.js'
import usersRoutes from './routes/users.js'
import ordersRoutes from './routes/orders.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT ?? 3000

app.use(express.json())

app.use('/api', authRoutes)
app.use('/api', productsRoutes)
app.use('/api', categoriesRoutes)
app.use('/api', usersRoutes)
app.use('/api', ordersRoutes)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})