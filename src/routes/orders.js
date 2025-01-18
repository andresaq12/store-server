import { Router } from "express"
import { PrismaClient } from "@prisma/client"
import { authenticateJWT, autorizationUser } from "../middleware/authMiddleware.js"

const router = Router()
const prisma = new PrismaClient()

// GET ALL ORDERS - ADMIN
router.get('/orders', authenticateJWT, autorizationUser('admin'), async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: {
        id: 'asc'
      }
    })
    res.json(orders)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error fetching orders' })
  }
})

// GET ORDER BY ID - USER
router.get('/orders/:id', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params
    const order = await prisma.order.findUnique({
      where: {
        id: Number(id)
      }
    })
    res.json(order)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error fetching order' })
  }
})

// POST AN ORDER
// Hay que verificar porque la ruta de pago debería guardar la orden
router.post('/orders', async (req, res) => {
  const { userId, amount, status, address, order_details } = req.body
  try {
    const newOrder = await prisma.order.create({
      data: {
        userId,
        amount,
        status,
        address,
        order_details: {
          create: order_details
        }
      }
    })

    // Verifica para cada producto que exista el stock necesario para completar la orden
    for (const item of order_details) {
      const product = await prisma.product.findUnique({
        where: {
          id: item.productId
        }
      })

      if (!product) {
        res.status(500).json({ message: `Product with ID ${item.productId} not found` })
      }

      if (product.stock < item.quantity) {
        res.status(500).json({ message: `Not enough stock for product ID ${item.productId}` })
      }

      await prisma.product.update({
        where: {
          id: item.productId
        },
        data: {
          stock: product.stock - item.quantity
        }
      })
    }
    res.json(newOrder)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error saving order' })
  }
})

// UPDATE AN ORDER - USER OR ADMIN
router.patch('/orders/:id', authenticateJWT, autorizationUser('user', 'admin'), async (req, res) => {
  const orderId = req.params.id
  const { id, role } = req.user
  try {
    const order = prisma.order.findUnique({
      where: {
        id: orderId
      }
    })

    if (!order) return res.status(404).json({ message: 'Order not found' })

    if (role === 'user') {
      if (req.body.status !== 'canceled') {
        return res.status(400).json({ message: 'Invalid status received' })
      }
    }

    const updateOrder = await prisma.order.update({
      where: {
        id: id
      },
      data: req.body
    })
    res.json(updateOrder)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error updating order' })
  }
})

export default router