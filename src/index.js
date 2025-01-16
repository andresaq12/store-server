import express from 'express'
import 'dotenv/config'
import productsRoutes from './routes/products.js'
import categoriesRoutes from './routes/categories.js'
import usersRoutes from './routes/users.js'
import ordersRoutes from './routes/orders.js'

const app = express()

app.use(express.json())

app.use('/api', productsRoutes)
app.use('/api', categoriesRoutes)
app.use('/api', usersRoutes)
app.use('/api', ordersRoutes)

app.listen(3000)
console.log('Server on port ', 3000)